#!/usr/bin/env node
/**
 * Converts markdown estimation file to PDF.
 * Outputs to `estimations/` folder in project root (creates it if missing).
 *
 * Usage:
 *   node generate-pdf.js <input.md> [output.pdf]
 *
 * Requires one of:
 *   - npx md-to-pdf (installed on demand)
 *   - pandoc (system)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
  console.error("Usage: node generate-pdf.js <input.md> [output.pdf]");
  process.exit(1);
}

const inputAbsolute = path.isAbsolute(inputPath)
  ? inputPath
  : path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(inputAbsolute)) {
  console.error(`File not found: ${inputAbsolute}`);
  process.exit(1);
}

const projectRoot = process.cwd();
const estimationsDir = path.join(projectRoot, "estimations");

if (!fs.existsSync(estimationsDir)) {
  fs.mkdirSync(estimationsDir, { recursive: true });
}

const baseName = path.basename(inputAbsolute, ".md");
const outputAbsolute = outputPath
  ? path.isAbsolute(outputPath)
    ? outputPath
    : path.resolve(process.cwd(), outputPath)
  : path.join(estimationsDir, `${baseName}.pdf`);

function tryMdToPdf() {
  try {
    execSync(`npx --yes md-to-pdf "${inputAbsolute}"`, {
      stdio: "inherit",
    });
    const defaultPdf = inputAbsolute.replace(/\.md$/i, ".pdf");
    if (defaultPdf !== outputAbsolute && fs.existsSync(defaultPdf)) {
      fs.renameSync(defaultPdf, outputAbsolute);
    }
    return true;
  } catch {
    return false;
  }
}

function tryPandoc() {
  try {
    execSync(`pandoc "${inputAbsolute}" -o "${outputAbsolute}"`, {
      stdio: "inherit",
    });
    return true;
  } catch {
    return false;
  }
}

if (tryMdToPdf()) {
  console.log(`PDF saved: ${outputAbsolute}`);
} else if (tryPandoc()) {
  console.log(`PDF saved: ${outputAbsolute}`);
} else {
  console.error(
    "No PDF converter found. Install one of:\n" +
      "  - npx md-to-pdf (requires Node.js)\n" +
      "  - pandoc (https://pandoc.org/installing.html)"
  );
  process.exit(1);
}
