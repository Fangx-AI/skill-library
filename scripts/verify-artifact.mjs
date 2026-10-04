import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactRoot = path.resolve(process.argv[2] ?? path.join(repositoryRoot, "dist"));
const read = (name) => fs.readFileSync(path.join(artifactRoot, name), "utf8");
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const categories = new Set(["创作设计", "编程开发", "文档办公", "研究分析", "运营增长", "工具效率"]);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

function requireHttps(value, label, { github = false } = {}) {
  assert.ok(hasText(value), `${label}: missing URL`);
  const url = new URL(value);
  assert.equal(url.protocol, "https:", `${label}: HTTPS required`);
  assert.equal(url.username + url.password, "", `${label}: URL credentials forbidden`);
  if (github) assert.equal(url.hostname, "github.com", `${label}: expected original GitHub source`);
  return url;
}

const html = read("index.html");
assert.match(html, /<html\b[^>]*\bclass=["'][^"']*\bdark\b/, "Website must use the reviewed dark design");
const app = read("app.js");
const styles = read("style.css");
assert.ok(app.length > 50_000, "Website bundle is incomplete");
assert.ok(app.split(/\r?\n/).some((line) => line.length > 20_000), "Publish the minified app bundle");
assert.ok(styles.length > 1_000, "Website stylesheet is incomplete");
for (const [name, text] of [["index.html", html], ["app.js", app], ["style.css", styles]]) {
  assert.doesNotMatch(text, /(?:sourceMappingURL|[A-Z]:[\\/]Users[\\/])/i, `${name}: source map or local path leaked`);
}

const catalogText = read("catalog.json");
const catalog = JSON.parse(catalogText);
assert.ok(Array.isArray(catalog) && catalog.length > 0, "Catalog must contain reviewed Skill records");
const metadata = JSON.parse(read("catalog-meta.json"));
assert.equal(metadata.version, 1, "Unsupported catalog metadata version");
assert.equal(metadata.sha256, sha256(catalogText), "Catalog does not match its reviewed SHA-256");
assert.equal(metadata.count, catalog.length, "Catalog count mismatch");
assert.ok(Number.isFinite(Date.parse(metadata.collectedAt)), "Metadata must record its collection date");

const ids = new Set();
const sourceStats = new Map();
const categoryCounts = {};
let officialCount = 0;
const licenseFile = path.join(repositoryRoot, "docs", "catalog-licenses.json");
const licenseNotices = JSON.parse(fs.readFileSync(licenseFile, "utf8"));

for (const skill of catalog) {
  const label = `Skill ${skill.id ?? "(missing id)"}`;
  assert.ok(hasText(skill.id) && !ids.has(skill.id), `${label}: missing or duplicate id`);
  ids.add(skill.id);
  for (const field of ["title", "summary", "scenario", "requirements", "compatibility"])
    assert.ok(hasText(skill[field]), `${label}: ${field} is required`);
  assert.match(skill.name ?? "", /^[a-z0-9][a-z0-9._:-]*$/, `${label}: invalid upstream Skill name`);
  assert.equal(skill.originalMetadata?.name, skill.name, `${label}: name must match upstream frontmatter`);
  assert.ok(categories.has(skill.category), `${label}: use the published task taxonomy`);
  categoryCounts[skill.category] = (categoryCounts[skill.category] ?? 0) + 1;
  assert.ok(["official", "community"].includes(skill.sourceKind), `${label}: source identity is required`);
  if (skill.sourceKind === "official") officialCount++;
  assert.match(skill.sourceRepo ?? "", /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, `${label}: invalid source repository`);
  assert.match(skill.sourceCommit ?? "", /^[a-f0-9]{40}$/, `${label}: full source commit required`);
  assert.ok(hasText(skill.skillFile) && skill.skillFile.endsWith("/SKILL.md"), `${label}: original Skill file required`);
  assert.ok(!skill.skillFile.includes("..") && !skill.skillFile.includes("\\"), `${label}: unsafe file path`);
  requireHttps(skill.sourceUrl, `${label} source`, { github: true });
  assert.equal(decodeURI(skill.sourceUrl), `https://github.com/${skill.sourceRepo}/blob/${skill.sourceCommit}/${skill.skillFile}`, `${label}: source must link the reviewed file at its commit`);
  assert.equal(skill.repoUrl, `https://github.com/${skill.sourceRepo}`, `${label}: repository link mismatch`);
  assert.ok(Number.isInteger(skill.githubStars) && skill.githubStars >= 0, `${label}: invalid repository Star snapshot`);
  assert.equal(skill.starsScope, "repository", `${label}: do not imply independent Skill Stars`);
  assert.ok(Number.isFinite(Date.parse(skill.collectedAt)), `${label}: collection timestamp required`);
  const previousSource = sourceStats.get(skill.sourceRepo);
  if (previousSource) {
    assert.equal(skill.sourceCommit, previousSource.commit, `${label}: source snapshot is inconsistent`);
    assert.equal(skill.githubStars, previousSource.stars, `${label}: repository Star snapshots disagree`);
  } else sourceStats.set(skill.sourceRepo, { commit: skill.sourceCommit, stars: skill.githubStars });
  assert.ok(["MIT", "Apache-2.0"].includes(skill.license), `${label}: unexpected catalog license`);
  requireHttps(skill.licenseUrl, `${label} license`, { github: true });
  assert.ok(skill.licenseUrl.includes(`/blob/${skill.sourceCommit}/`), `${label}: license evidence must be pinned`);
  const notice = licenseNotices[skill.licenseNoticeId];
  assert.ok(notice && hasText(notice.text), `${label}: missing original license notice`);
  assert.equal(notice.sourceRepo, skill.sourceRepo, `${label}: license notice source mismatch`);
  assert.equal(notice.sourceCommit, skill.sourceCommit, `${label}: license notice commit mismatch`);
  assert.equal(notice.license, skill.license, `${label}: license notice type mismatch`);
  requireHttps(skill.installGuideUrl, `${label} installation guide`);
  assert.ok(["skills-cli", "plugin", "source"].includes(skill.installMethod), `${label}: installation method required`);
  if (skill.installMethod === "skills-cli") {
    assert.equal(skill.installCommand, `npx skills add ${skill.sourceRepo} --skill ${skill.name}`, `${label}: command must use the upstream repository and Skill name`);
  } else assert.equal(skill.installCommand, null, `${label}: plugins and source guides must not advertise a standalone CLI command`);
  assert.equal(skill.exampleType, "suggested", `${label}: examples must not be represented as executed results`);
}

assert.equal(metadata.sourceCount, sourceStats.size, "Source count mismatch");
assert.equal(metadata.officialCount, officialCount, "Official source count mismatch");
assert.deepEqual(metadata.categories, categoryCounts, "Task category totals mismatch");

const forbiddenDirectories = new Set(["src", "node_modules", "private", "pro-source", "research-cache"]);
const forbiddenExtensions = new Set([".map", ".tsx", ".jsx", ".ts", ".zip", ".7z", ".tar", ".gz"]);
function inspectPublicDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(repositoryRoot, absolute);
    assert.ok(!entry.isSymbolicLink(), `Do not publish symlinked private files: ${relative}`);
    assert.ok(!forbiddenDirectories.has(entry.name), `Do not publish template/source folders: ${relative}`);
    assert.ok(!forbiddenExtensions.has(path.extname(entry.name).toLowerCase()), `Do not publish source/archive files: ${relative}`);
    assert.ok(!/^\.env(?:\.|$)/i.test(entry.name), `Do not publish local environment files: ${relative}`);
    if (entry.isDirectory()) inspectPublicDirectory(absolute);
  }
}
inspectPublicDirectory(repositoryRoot);
if (!artifactRoot.startsWith(repositoryRoot + path.sep)) inspectPublicDirectory(artifactRoot);
console.log(`Verified: dark compiled website, ${catalog.length} reviewed Skills, ${sourceStats.size} sources, matching metadata and license notices, no private source or source maps.`);
