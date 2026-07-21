# Optional local model and one-time data extraction

This is an implementation walkthrough, not a claim that the static app already calls a model or a market-data API. Fusion Research is intentionally offline-first today: it creates an inspectable model brief, and the user chooses whether to send that brief anywhere.

The recommended next step is a **loopback-only** local model integration plus a **separate, one-time data collector**. It keeps model inputs auditable and prevents secrets from being exposed in `index.html` or a public GitHub Pages deployment.

## What a local model should and should not do

Use a small local LLM to:

- turn the existing research brief and an attached source packet into a draft memo;
- identify missing sources, unit mismatches, and arithmetic that needs review;
- propose questions and a source ledger for the analyst to verify.

Do not use it to:

- fetch, invent, or silently update financial inputs;
- overwrite model assumptions or a source ledger without human review;
- make a trade decision or present generated text as a primary-source fact.

## Recommended architecture

```text
Reviewed filings / one-time API responses
              |
              v
      Normalised, dated input packet  --->  Analyst reviews and enters inputs
                                                  |
                                                  v
Browser report <--- explicit user action ---> loopback adapter ---> local LLM
  (no key)              (payload preview)       127.0.0.1 only
```

Keep the local LLM behind a tiny adapter rather than calling it directly from a static page. The adapter is responsible for a localhost-only allowlist, request-size limits, CORS, and logging only the minimal metadata required for debugging. The report must show the model name, generation time, and the exact brief it sent.

## Option A - llama.cpp with NVIDIA Nemotron 3 Nano 4B

This is the most direct desktop route for a GGUF model. NVIDIA publishes a `NVIDIA-Nemotron-3-Nano-4B-GGUF` model card with `Q4_K_M` guidance for `llama-server`; review the model's license before distribution or commercial use. The `llama.cpp` server exposes an OpenAI-compatible chat-completions endpoint.

1. Obtain the model through the approved local-model workflow and keep the GGUF outside this repository. Do not commit a model file.
2. Start a loopback-only server. Replace the placeholder with the actual, verified local GGUF path:

```sh
/opt/homebrew/bin/llama-server \
  --model "/absolute/path/to/NVIDIA-Nemotron-3-Nano-4B-Q4_K_M.gguf" \
  --host 127.0.0.1 \
  --port 8080 \
  --ctx-size 4096 \
  --alias "nemotron-3-nano-4b"
```

3. Test the server with a harmless, bounded request before wiring it into the report:

```sh
curl --fail http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nemotron-3-nano-4b",
    "temperature": 0.1,
    "max_tokens": 300,
    "messages": [
      {
        "role": "system",
        "content": "State only what is supplied. Mark missing evidence explicitly."
      },
      {
        "role": "user",
        "content": "Check this arithmetic: 2.4 + 0.6 = 3.0."
      }
    ]
  }'
```

4. Build a local adapter with one narrow route, for example `POST /api/research-brief`. It should accept the displayed brief and optional user-selected source excerpts, validate a size limit, then forward the request to `http://127.0.0.1:8080/v1/chat/completions`.
5. Add an **optional** “Draft with local model” control to the report only after the adapter works. Before sending, show a preview of the payload and an explicit `Local only · model name · no external provider` notice. Put the response in a draft panel; never merge it into financial inputs automatically.

For a first version, do not enable tools, web access, or write actions. A compact model is most useful here as a constrained research-writing and consistency-check assistant, not as an autonomous research agent.

## Option B - LocalAI

[LocalAI](https://localai.io/docs/overview/) is useful when you want to swap between several local backends behind one OpenAI-compatible API. It can serve a suitable GGUF through its configured local runtime. Use the same adapter contract as Option A and bind the service to localhost or another deliberately protected private interface. Do not expose it to the public internet without authentication, transport security, and an access-control review.

## Option C - Google AI Edge

[Google AI Edge](https://developers.google.com/edge) is appropriate if Fusion Research becomes a native mobile application. Its on-device LLM path is not a drop-in HTTP server for this static website. Use it in a native iOS/Android client for private on-device summarisation, then preserve the same payload preview, source ledger, and human-review rules described above.

## One-time data extraction: source hierarchy

For a company model, start with a dated filing and investor-relations material. APIs are a convenience for locating, normalising, or cross-checking data; they do not replace the primary document. Record every response's retrieval time, endpoint, company identifier, and reporting period.

### Useful free or public sources

- **SEC EDGAR - US-company filings and XBRL facts.** No API key is required. Use `https://data.sec.gov/submissions/CIK##########.json` to locate filings and `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json` for company-wide standard XBRL facts. This is the preferred primary-data path for SEC registrants. Send a descriptive `User-Agent`, respect SEC access guidance, and use a local collector: `data.sec.gov` does not support browser CORS. [SEC API documentation](https://www.sec.gov/search-filings/edgar-application-programming-interfaces)
- **Alpha Vantage - small equity snapshot or cross-check.** A free API key is required. Useful endpoints include `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_KEY`, plus `INCOME_STATEMENT`, `BALANCE_SHEET`, `CASH_FLOW`, `EARNINGS`, and `SHARES_OUTSTANDING`. Free access and freshness vary by endpoint; intraday/realtime data is commonly premium or delayed, so verify the response rather than assuming it is realtime. [Alpha Vantage documentation](https://www.alphavantage.co/documentation/)
- **FRED - macro assumptions.** A free FRED API key is required. Use `https://api.stlouisfed.org/fred/series/observations?series_id=SERIES_ID&api_key=YOUR_KEY&file_type=json` for dated macro observations, such as rates, inflation, or industry drivers. FRED is excellent for macro context but is not a substitute for company financial statements. [FRED API overview](https://fred.stlouisfed.org/docs/api/fred/overview.html) and [series endpoint](https://fred.stlouisfed.org/docs/api/fred/series.html)
- **Yahoo Finance chart endpoint - convenience only.** `https://query1.finance.yahoo.com/v8/finance/chart/TICKER?range=1y&interval=1d` is a commonly used public website endpoint for a one-off price-history reference. It is **not a supported, documented Yahoo Finance developer API**; it can change or restrict access without notice. Do not make it a production dependency, do not rely on it for licensed realtime data, and record the date and the separate primary source used to validate a price.

### Minimum extraction packet

For one company, collect the smallest dated packet that can support the report:

| Model input | Preferred evidence | Typical source |
| --- | --- | --- |
| Current price and as-of time | Exchange or approved market-data reference | Alpha Vantage or a dated manual price check |
| Basic / diluted shares | Most recent filing, cover page, or earnings release | SEC filing / company IR |
| Cash, debt, and net cash | Balance sheet with period end | SEC XBRL plus filing reconciliation |
| Historical revenue, EBITDA, cash flow | Filed financial statements and definitions | SEC XBRL plus filing reconciliation |
| Guidance and operating KPIs | Dated earnings release, transcript, investor presentation | Company IR |
| WACC and macro inputs | Defined series, observation date, and methodology | FRED / analyst assumption |

### Safe collection sequence

1. Resolve the ticker to the correct legal issuer and CIK. Never infer a CIK from a ticker without verifying the company identity.
2. Download the latest filing metadata and the relevant report/earnings materials. Preserve raw files or response hashes outside the published site.
3. Extract only the fields used by the model and retain their units, period end, source URL, and source section.
4. Reconcile every machine-extracted value against the filing. XBRL concepts can have different periods, units, or company-specific extensions.
5. Save one reviewed, dated normalised snapshot. Manually enter or import only that reviewed snapshot into Fusion Research.
6. Keep API keys in a local environment file or system keychain used by the collector. Never place keys in `index.html`, browser local storage, a client-side bundle, screenshots, or a Git commit.

An example normalised snapshot should keep data and provenance together:

```json
{
  "as_of": "YYYY-MM-DD",
  "company": { "name": "Example Co.", "ticker": "EXMP", "cik": "0000000000" },
  "model_inputs": {
    "current_price_usd": null,
    "basic_shares_m": null,
    "net_cash_usd_b": null,
    "revenue_2025_usd_b": null
  },
  "sources": [
    {
      "field": "net_cash_usd_b",
      "source_url": "https://www.sec.gov/...",
      "retrieved_at": "YYYY-MM-DDTHH:MM:SSZ",
      "period_end": "YYYY-MM-DD",
      "status": "reviewed"
    }
  ]
}
```

## Acceptance checks before enabling either path

- The local-model setting is off by default and the only permitted network target is `127.0.0.1`.
- The user sees the exact outbound prompt and opts in for each generation.
- A generated draft cannot change values, sources, or scenario assumptions automatically.
- Every imported number has a unit, period end, source URL/title, and review status.
- API keys and model files are absent from Git history and the published static site.
- Three fixture companies with different reporting formats have been reconciled manually before relying on the extractor.

## Primary references

- [NVIDIA Nemotron 3 Nano 4B GGUF model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-GGUF)
- [llama.cpp server API reference](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- [LocalAI overview](https://localai.io/docs/overview/)
- [Google AI Edge](https://developers.google.com/edge)
- [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces)
- [Alpha Vantage API documentation](https://www.alphavantage.co/documentation/)
- [FRED API overview](https://fred.stlouisfed.org/docs/api/fred/overview.html)
