#!/usr/bin/env node
/**
 * scripts/generate-image-dimensions.mjs
 * ---------------------------------------------------------------
 * Scans every MediaItem across content/data/*.json, reads the REAL
 * pixel dimensions of each referenced file from /public (via
 * `image-size`, which parses just the file header — no full decode
 * needed, so this is fast even across hundreds of images), and
 * writes width/height back into the JSON automatically.
 *
 * Run this any time you add or change an image:
 *   npm run generate:dimensions
 *
 * Same reasoning as the Supabase migration seam elsewhere in this
 * project: dimensions are metadata computed ONCE at ingestion time
 * and stored — never recomputed at render time, never hand-typed.
 * Once Supabase is connected, this same logic moves into the upload
 * handler (compute width/height when a file is uploaded, store them
 * as columns) instead of running as a standalone script.
 *
 * Setup: npm install --save-dev image-size
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
const DATA_DIR = join(__dirname, "..", "content", "data");
const DATA_FILES = ["designs.json", "canvas.json", "case-studies.json"];

function dimensionsFor(publicPath) {
  const filePath = join(PUBLIC_DIR, publicPath);
  try {
    const buffer = readFileSync(filePath);
    const { width, height } = imageSize(buffer);
    return { width, height };
  } catch (err) {
    console.warn(`  ! Could not read "${publicPath}" (${err.message}) — leaving existing value`);
    return null;
  }
}

function tagMedia(media) {
  if (!media) return;
  // A video's dimensions are probed from its POSTER frame — the
  // poster is guaranteed to share the video's aspect ratio in
  // practice, and probing an actual video file needs much heavier
  // tooling (ffprobe) for no real benefit at this scale.
  const probePath = media.type === "video" ? media.poster : media.src;
  const dims = dimensionsFor(probePath);
  if (dims) {
    media.width = dims.width;
    media.height = dims.height;
  }
}

let totalItems = 0;

for (const file of DATA_FILES) {
  const filePath = join(DATA_DIR, file);
  const items = JSON.parse(readFileSync(filePath, "utf-8"));

  for (const item of items) {
    tagMedia(item.heroMedia);
    (item.otherMedia ?? []).forEach(tagMedia);
    if (item.resultMedia) tagMedia(item.resultMedia);
    for (const section of item.sections ?? []) {
      for (const block of section.blocks ?? []) {
        tagMedia(block.media);
      }
    }
  }

  writeFileSync(filePath, JSON.stringify(items, null, 2) + "\n");
  totalItems += items.length;
  console.log(`✓ ${file} — ${items.length} items processed`);
}

console.log(`\nDone — ${totalItems} items across ${DATA_FILES.length} files.`);
