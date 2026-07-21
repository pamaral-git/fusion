# Financial Fusion Model — AI research template

Use this prompt only after pasting a live model brief and the relevant primary-source excerpts. It is designed to create a defensible research memo, not to replace source verification.

```text
You are building a Financial Fusion Model for [COMPANY]. Use the supplied model snapshot and source packet as the only evidence base.

Operating rules
1. Separate every statement into one of: sourced fact, model assumption, calculation, or open question.
2. Never fabricate a figure, date, quote, source, customer, contract, or citation. If information is absent, write “Not provided”.
3. Preserve units exactly as stated in the model and source packet, including USD billions, shares in millions, and USD/share. Do not introduce a sector-specific unit that the evidence does not support.
4. Recompute all arithmetic before describing it. Flag a discrepancy rather than silently repairing it.
5. Treat the model’s valuation weights and risk haircut as assumptions to explain, not validated conclusions.
6. Do not give personalised investment advice, price recommendations, or an instruction to trade.

Required output
1. Executive view — a concise thesis with sourced facts and separate assumptions.
2. Operating bridge — explain how the company's operational drivers convert into the revenue forecast. Reconcile each material driver with the supplied evidence and identify gaps.
3. Revenue architecture — revenue streams, pricing, volume/utilisation, and key milestones.
4. Margin and capital intensity — EBITDA bridge, capex, cash/debt, funding needs, and what can invalidate the forecast.
5. Valuation cross-check — EV / Revenue, EV / EBITDA, and DCF. Show formulas and cite input provenance.
6. Risks, disconfirming evidence, and catalysts — rank them by impact and evidentiary strength.
7. Source ledger — for every material claim, list the source file/title, date, page/section, and a short paraphrase. Identify missing primary sources.
8. Append a machine-readable JSON block with `facts`, `assumptions`, `calculations`, `risks`, and `missing_sources` arrays.

Style
- Be analytical, compact, and falsifiable.
- State uncertainty plainly.
- Use tables for reconciliation and valuation, not decorative formatting.
- Do not make up a target price beyond the supplied model output.
```
