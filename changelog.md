# Changelog

## 2.2.0 — 2026-07-21

- Fixed GitHub Pages deployment by checking out the repository before publishing the artifact.
- Added editable issuer, capital-structure, historical-revenue, and terminal-growth inputs so the model can be adapted to another company.
- Made saved models recoverable after reload, preserved scenario identity, and marked manually changed scenario drivers as Custom.

## 2.1.0 — 2026-07-21

- Added an implementation walkthrough for optional local LLM use with `llama.cpp`, LocalAI, or Google AI Edge.
- Added verified free/public data-source guidance for SEC EDGAR, Alpha Vantage, FRED, and the unsupported Yahoo Finance chart endpoint, with provenance and secret-handling guardrails.
- Updated the AI research template to keep the operating-bridge instructions sector-agnostic.

## 2.0.0 — 2026-07-21

- Replaced the dashboard-style UI with a report-first interactive equity-research document, using the supplied Nebius research report as the information-architecture and visual reference.
- Removed the persistent control-panel shell, light cards, generic product headline, and capacity-specific modelling language.
- Added a reusable research flow: Executive Summary, Operating Model, Revenue Architecture, Valuation Engine, Scenario Analysis, and a source-aware Research Pack.
- Moved editable assumptions into the relevant analytical sections and added a deep blue-black editorial design system with a compact document header, sticky KPI ribbon, table of contents, inline citations, and restrained lime highlights.
- Retained scenarios, local save/load, CSV export, live narrative, charting, sensitivity analysis, and the source-aware AI handoff brief.
- Corrected the first-render valuation calculation and made the active scenario label truthful across the research narrative.

## 1.0.0 — 2026-07-21

- Rebuilt the legacy Nebius-specific static model as a domain-agnostic, self-contained Finance Fusion Model Studio.
- Added bidirectional revenue ↔ capacity calculations, auditable valuation methods, risk adjustment, scenarios, and all-live visualizations.
- Added offline browser persistence plus CSV, JSON, and Markdown brief exports.
- Added a safe AI handoff flow that produces a source-aware prompt without pretending to call an AI provider.
- Added responsive, keyboard-accessible product UI, a dependency-free validation script, GitHub Pages workflow, license, and publication documentation.

## Design record

The intended direction is a precise research workstation: a dark graphite shell, paper-like model canvas, practical monospace numerals, and chartreuse used only as an active state and positive signal. It avoids dashboard-card excess and external fonts so that the artifact remains fully offline.

The visual-concept generator was attempted during the redesign but was unavailable with a 403 response. No generated asset is used in this repository; all product visuals are code-native.
