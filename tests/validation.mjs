import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const required = [
  "<!doctype html>",
  "const baseState",
  "function calculate()",
  "function renderTrajectory()",
  "function renderSensitivity()",
  "function renderBridge()",
  "function renderMethod()",
  "function restoreSavedModel()",
  "function updateNumericInput",
  "localStorage.setItem",
  "exportCsv",
  "buildBrief",
  "data-scenario=\"bear\"",
  "data-key=\"currentPrice\"",
  "data-key=\"basicShares\"",
  "data-key=\"netCash\"",
  "data-key=\"terminalGrowth\"",
  "data-method=\"revenue\"",
  "Executive Summary",
  "Revenue Architecture",
  "Research Pack",
  "id=\"sensitivity-matrix\"",
  "id=\"bridge-chart\""
];

const missing = required.filter(marker => !html.includes(marker));
if (missing.length) {
  console.error("Static validation failed. Missing markers:\n- " + missing.join("\n- "));
  process.exit(1);
}

const scripts = (html.match(/<script>[\s\S]*?<\/script>/g) || []).join("\n");
if (/https?:\/\//i.test(scripts) || /\bfetch\s*\(/.test(scripts)) {
  console.error("Static validation failed. Runtime JavaScript must not depend on the network.");
  process.exit(1);
}

const workflow = readFileSync(resolve(root, ".github/workflows/pages.yml"), "utf8");
if (!workflow.includes("actions/checkout@v4")) {
  console.error("Static validation failed. GitHub Pages workflow must check out the repository before uploading the artifact.");
  process.exit(1);
}

console.log("Static validation passed: research report engine, live visualizations, local persistence, exports, and offline runtime markers are present.");
