import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const resume = JSON.parse(readFileSync(new URL("../assets/json/resume.json", import.meta.url)));
test("public research distinguishes published papers and both working papers", () => {
  assert.equal(resume.publications.filter((p) => p.status === "Published article").length, 2);
  const working = resume.publications.filter((p) => p.status === "Working paper");
  assert.equal(working.length, 2);
  const qfi = working.find((p) => p.url.includes("abstract_id=7582999"));
  assert.equal(qfi.authors, "Saverio Cabra, Lorenzo Toscano and Alessandro Tugnetti");
  assert(working.some((p) => p.name === "The Out-of-Sample Predictability of Long-Run Economic Growth"));
  assert(!JSON.stringify(resume).includes("The Virtue of Complexity"));
});
test("public identity and contact do not retain the former candidate/address or references", () => {
  assert(!/candidate|Ph\.D\. Student|Currently a doctoral researcher/i.test(JSON.stringify(resume.basics)));
  assert.equal(resume.basics.location.city, "Luxembourg");
  assert(!resume.basics.location.address);
  assert(!resume.references);
  assert.equal(resume.teaching.length, 5);
});

test("language levels omit the removed qualifier", () => {
  assert(!JSON.stringify(resume.languages).includes("self-assessed"));
  assert.equal(resume.languages.find((l) => l.language === "English").fluency, "C1/C2");
  assert.equal(resume.languages.find((l) => l.language === "Luxembourgish").fluency, "B1");
});
