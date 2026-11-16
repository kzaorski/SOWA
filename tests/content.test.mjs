import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const baseline = JSON.parse(
  readFileSync(new URL("./content-baseline.json", import.meta.url), "utf8"),
);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
function normalize(value) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&quot;/g, '"')
    .replace(/&[lr]dquo;/g, '"')
    .replace(/Placówka powstał(?=\s)/g, "Placówka powstała")
    .replace(/indywidulne/g, "indywidualne")
    .normalize("NFC")
    .toLocaleLowerCase("pl")
    .replace(/[^\p{L}\p{N}]/gu, "");
}
const text = normalize(html);
for (const [index, paragraph] of baseline.paragraphs.entries()) {
  test(`original paragraph ${index + 1}: ${paragraph.slice(0, 75)}`, () => {
    assert.ok(
      text.includes(normalize(paragraph)),
      `Missing or changed original paragraph: ${paragraph}`,
    );
  });
}
for (const entry of baseline.schedule) {
  test(`schedule: ${entry}`, () =>
    assert.ok(
      text.includes(normalize(entry)),
      `Missing schedule entry: ${entry}`,
    ));
}
for (const value of baseline.facts) {
  test(`original fact: ${value}`, () =>
    assert.ok(
      text.includes(normalize(value)),
      `Missing original fact: ${value}`,
    ));
}
test("baseline covers the entire original daily schedule", () =>
  assert.equal(baseline.schedule.length, 11));
