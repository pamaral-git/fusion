# Fusion Research

An offline-first, browser-based interactive equity-research report. It turns a company’s operating assumptions into a living investment memo, with the narrative, valuation, charts, scenarios, and AI research brief all driven by one transparent local model.

It is intentionally a static app: no account, analytics, remote API, tracking pixel, or build step is required. Open `index.html` locally, or deploy it as a GitHub Pages site.

## What it does

- Uses a report-first structure: executive summary, operating model, revenue architecture, valuation engine, scenario analysis, and research pack.
- Calculates market cap, diluted shares, net cash, EBITDA, free cash flow, EV / Revenue, EV / EBITDA, DCF, a blended target price, and risk-adjusted upside/downside.
- Updates narrative figures, an SVG operating trajectory, a price bridge, and a 6 × 6 sensitivity matrix with every input change.
- Includes editable issuer/capital inputs, Bear/Base/Bull scenarios with a truthful Custom state after manual edits, browser-only save/load, CSV export, and a copy/downloadable AI research brief.
- Uses Google Fonts when online, with system-font fallbacks and no other runtime dependency. Model data remains in the browser unless you explicitly export or copy it.
- Documents an opt-in, localhost-only local-LLM path and a one-time financial-data extraction workflow in [`docs/local-model-and-data-sources.md`](docs/local-model-and-data-sources.md).

## Important limitation

This repository prepares an AI-ready model brief; it does **not** call an LLM or fetch market data. That is deliberate: a functioning provider integration needs an explicit choice of model, authentication, data provenance, and a server-side secret boundary. The generated brief can be pasted into an approved AI workflow together with primary-source evidence.

For a small local model (including `llama.cpp` with NVIDIA Nemotron 3 Nano 4B), LocalAI, Google AI Edge, and free/public one-time data sources, see the [local-model and data-source walkthrough](docs/local-model-and-data-sources.md). It explains the safe integration boundary without placing keys or network calls in this static app.

No output is investment advice. Validate figures, units, calculations, and source material before using a model in an investment decision.

## Run locally

Open [`index.html`](index.html) in a current browser. There are no package installs or environment variables.

For a local server (useful when testing download behaviour), use any static server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Publish to GitHub Pages

1. Create a new GitHub repository and push this directory’s contents to its default branch.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to the default branch. The included workflow deploys the root static site.

The deployment workflow has the minimum Pages and ID-token permissions required by GitHub Pages. Review it before enabling it in a repository with other workflows.

## Model conventions

| Quantity | Unit |
| --- | --- |
| Financial statement values | USD billions |
| Share counts | millions |
| Valuation outputs | USD per share |

The DCF prevents a terminal-value singularity by requiring WACC to exceed terminal growth by at least 0.5 percentage points. The target price uses 42% EV / Revenue, 25% EV / EBITDA, and 33% DCF, then applies the selected risk haircut. These are transparent defaults, not universal valuation weights.

## Using AI responsibly

1. Start with a company name and adjust assumptions to match your evidence.
2. Add primary sources: filings, earnings releases, presentations, transcripts, and clearly dated industry evidence.
3. Copy the **AI handoff brief**.
4. Paste it, the cited evidence, and the template in [`prompts/financial-fusion-model.md`](prompts/financial-fusion-model.md) into your approved model.
5. Require the AI to label all sourced facts, inferred estimates, and unknowns separately. Do not allow invented citations.

## Validation

The project has no runtime dependencies. Run the structural validation script with a current Node.js runtime:

```sh
node tests/validation.mjs
```

For manual acceptance testing, confirm that every editable field updates the relevant prose and charts, valuation-method tabs change state without resetting issuer facts, a manual scenario edit becomes Custom, browser save/load works after a page reload, and CSV/Markdown exports contain the current model state.

## Repository layout

```text
.
├── index.html                         # Entire offline application: UI, CSS, model engine
├── docs/local-model-and-data-sources.md # Optional local-LLM and data-source walkthrough
├── prompts/financial-fusion-model.md  # AI analysis template and guardrails
├── tests/validation.mjs               # Dependency-free structural smoke check
├── .github/workflows/pages.yml        # Optional GitHub Pages deployment
├── changelog.md
└── LICENSE
```

## Security and privacy posture

- No secrets or API keys are used or expected.
- Any future API key belongs in an external local collector or protected service, never in this static page or a public repository.
- No user input is interpolated as HTML; model text is rendered with `textContent`.
- Browser persistence is namespaced by company name and remains local to the browser profile.
- Export actions create local files through the browser’s download mechanism only.

## License

MIT. See [`LICENSE`](LICENSE).
