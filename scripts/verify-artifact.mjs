import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactRoot = path.resolve(process.argv[2] ?? path.join(repositoryRoot, "dist"));
const read = (name) => fs.readFileSync(path.join(artifactRoot, name), "utf8");
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const categories = new Set(["创作设计", "编程开发", "文档办公", "研究分析", "运营增长", "工具效率"]);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const mediaLabels = new Set(["项目封面", "原文预览", "技能示例", "官方模板预览"]);
const checkedImages = new Map();
const mediaIndex = new Map();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngDimensions(bytes, label) {
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${label}: invalid PNG signature`);
  let offset = 8, header, ended = false;
  const idat = [];
  while (offset + 12 <= bytes.length) {
    const size = bytes.readUInt32BE(offset), type = bytes.toString("ascii", offset + 4, offset + 8);
    const end = offset + 12 + size;
    assert.ok(end <= bytes.length, `${label}: truncated PNG chunk`);
    assert.equal(bytes.readUInt32BE(offset + 8 + size), crc32(bytes.subarray(offset + 4, offset + 8 + size)), `${label}: PNG chunk checksum mismatch`);
    const data = bytes.subarray(offset + 8, offset + 8 + size);
    if (!header) {
      assert.equal(type, "IHDR", `${label}: PNG header must be first`);
      assert.equal(size, 13, `${label}: invalid PNG header`);
      header = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
      assert.equal(data[10] + data[11], 0, `${label}: unsupported PNG encoding`);
      assert.ok(header.interlace === 0 || header.interlace === 1, `${label}: invalid PNG interlace`);
      assert.ok(header.width > 0 && header.height > 0 && header.width * header.height <= 24_000_000, `${label}: invalid or excessive PNG dimensions`);
    } else assert.notEqual(type, "IHDR", `${label}: repeated PNG header`);
    if (type === "IDAT") idat.push(data);
    offset = end;
    if (type === "IEND") { assert.equal(size, 0, `${label}: invalid PNG terminator`); ended = true; break; }
  }
  assert.ok(header && ended && offset === bytes.length && idat.length, `${label}: incomplete PNG image`);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[header.color];
  assert.ok(channels && [1, 2, 4, 8, 16].includes(header.depth), `${label}: invalid PNG pixel format`);
  assert.ok([0, 3].includes(header.color) || header.depth >= 8, `${label}: invalid PNG bit depth`);
  const passes = header.interlace ? [[0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]] : [[0,0,1,1]];
  const rows = [];
  let expected = 0;
  for (const [left, top, stepX, stepY] of passes) {
    const width = Math.max(0, Math.ceil((header.width - left) / stepX)), height = Math.max(0, Math.ceil((header.height - top) / stepY));
    if (!width || !height) continue;
    const rowSize = Math.ceil(width * channels * header.depth / 8) + 1;
    rows.push([rowSize, height]); expected += rowSize * height;
  }
  const pixels = inflateSync(Buffer.concat(idat), { maxOutputLength: 64 * 1024 * 1024 });
  assert.equal(pixels.length, expected, `${label}: PNG pixels do not match dimensions`);
  let rowOffset = 0;
  for (const [rowSize, height] of rows) for (let row = 0; row < height; row++) {
    assert.ok(pixels[rowOffset] <= 4, `${label}: invalid PNG scanline filter`); rowOffset += rowSize;
  }
  return header;
}

function jpegDimensions(bytes, label) {
  assert.ok(bytes.length > 20 && bytes[0] === 255 && bytes[1] === 216 && bytes[bytes.length - 2] === 255 && bytes[bytes.length - 1] === 217, `${label}: incomplete JPEG image`);
  let offset = 2, dimensions;
  while (offset + 4 <= bytes.length) {
    assert.equal(bytes[offset], 255, `${label}: invalid JPEG marker`);
    while (bytes[offset] === 255) offset++;
    const marker = bytes[offset++];
    if (marker === 218 || marker === 217) break;
    if (marker === 1 || marker >= 208 && marker <= 215) continue;
    const size = bytes.readUInt16BE(offset);
    assert.ok(size >= 2 && offset + size <= bytes.length, `${label}: truncated JPEG segment`);
    if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {
      assert.ok(size >= 8, `${label}: invalid JPEG frame`);
      dimensions = { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    }
    offset += size;
  }
  assert.ok(dimensions, `${label}: JPEG has no image frame`);
  return dimensions;
}

function webpDimensions(bytes, label) {
  assert.ok(bytes.length > 20 && bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP", `${label}: invalid WebP signature`);
  assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, `${label}: incomplete WebP container`);
  let offset = 12, dimensions, frame = false;
  while (offset + 8 <= bytes.length) {
    const type = bytes.toString("ascii",offset,offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8;
    assert.ok(start + size <= bytes.length, `${label}: truncated WebP chunk`);
    if (type === "VP8X") { assert.ok(size >= 10, `${label}: invalid WebP canvas`); dimensions = { width: bytes.readUIntLE(start + 4,3) + 1, height: bytes.readUIntLE(start + 7,3) + 1 }; }
    if (type === "VP8 ") {
      assert.ok(size >= 10 && bytes.subarray(start + 3,start + 6).equals(Buffer.from([157,1,42])), `${label}: invalid WebP frame`);
      dimensions ||= { width: bytes.readUInt16LE(start + 6) & 0x3fff, height: bytes.readUInt16LE(start + 8) & 0x3fff }; frame = true;
    }
    if (type === "VP8L") {
      assert.ok(size >= 5 && bytes[start] === 47, `${label}: invalid lossless WebP frame`);
      const bits = bytes.readUInt32LE(start + 1);
      dimensions ||= { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }; frame = true;
    }
    if (type === "ANMF") { assert.ok(size >= 24, `${label}: invalid animated WebP frame`); frame = true; }
    offset = start + size + (size & 1);
  }
  assert.ok(offset === bytes.length && dimensions && frame, `${label}: incomplete WebP image`);
  return dimensions;
}

function inspectImage(src, label, expectedSha) {
  assert.ok(typeof src === "string" && /^\.\/assets\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp)$/i.test(src) && !src.includes("..") && !src.includes("//"), `${label}: require safe local ./assets image path`);
  const file = path.resolve(artifactRoot, src), real = fs.realpathSync(file), relative = path.relative(fs.realpathSync(artifactRoot), real);
  assert.ok(relative && !relative.startsWith("..") && !path.isAbsolute(relative), `${label}: asset resolves outside artifact`);
  assert.ok(fs.statSync(real).isFile(), `${label}: image asset is not a file`);
  let checked = checkedImages.get(real);
  if (!checked) {
    const bytes = fs.readFileSync(real), extension = path.extname(file).toLowerCase();
    assert.ok(bytes.length <= 8 * 1024 * 1024, `${label}: thumbnail exceeds 8 MiB`);
    const dimensions = extension === ".png" ? pngDimensions(bytes,label) : extension === ".webp" ? webpDimensions(bytes,label) : jpegDimensions(bytes,label);
    assert.ok(dimensions.width >= 480 && dimensions.height >= 256 && dimensions.width * dimensions.height <= 24_000_000, `${label}: image resolution ${dimensions.width}x${dimensions.height} must be at least 480x256`);
    checked = { ...dimensions, sha256: sha256(bytes) }; checkedImages.set(real, checked);
  }
  if (expectedSha !== undefined) { assert.match(expectedSha, /^[a-f0-9]{64}$/, `${label}: invalid image SHA-256`); assert.equal(checked.sha256, expectedSha, `${label}: image does not match reviewed SHA-256`); }
}

function inspectMedia(media, skill, label, lookupManifest = true) {
  for (const field of ["alt", "label", "sourceUrl", "license", "credit"]) assert.ok(hasText(media[field]), `${label}: ${field} is required`);
  assert.ok(!/^(?:image|img|cover|placeholder|图片|封面|预览)$/i.test(media.alt.trim()), `${label}: image alternative text must describe content`);
  assert.ok(mediaLabels.has(media.label), `${label}: image type is unsupported`);
  if (media.label === "技能示例") assert.equal(media.exampleStatus ?? skill.exampleStatus, "upstream-example", `${label}: only documented upstream results may be labeled Skill examples`);
  const source = requireHttps(media.sourceUrl, `${label} original source`);
  assert.ok(!/^(?:localhost|127\.|0\.|10\.|192\.168\.)/i.test(source.hostname) && !source.hostname.endsWith(".local"), `${label}: source must be public`);
  assert.match(media.sha256 ?? "", /^[a-f0-9]{64}$/, `${label}: reviewed image SHA-256 required`);
  inspectImage(media.src,label,media.sha256);
  if (lookupManifest) {
    const entry = mediaIndex.get(media.src);
    assert.ok(entry, `${label}: media is missing from its provenance manifest`);
    for (const field of ["sourceUrl", "license", "credit", "label", "sha256"]) assert.equal(media[field], entry[field], `${label}: ${field} disagrees with provenance manifest`);
  }
}

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
const mediaManifest = JSON.parse(read("media-manifest.json"));
assert.ok(Array.isArray(mediaManifest) && mediaManifest.length > 0, "Reviewed media provenance manifest is required");
for (const [index, entry] of mediaManifest.entries()) {
  const label = `Media manifest item ${index + 1}`;
  assert.ok(hasText(entry.file) && entry.file.startsWith("assets/") && !mediaIndex.has(`./${entry.file}`), `${label}: missing or duplicate asset file`);
  assert.ok(hasText(entry.caption), `${label}: describe image provenance`);
  assert.match(entry.sourceRepo ?? "", /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, `${label}: source repository required`);
  assert.match(entry.sourceCommit ?? "", /^[a-f0-9]{40}$/, `${label}: full source commit required`);
  requireHttps(entry.licenseUrl, `${label} license evidence`);
  inspectMedia({ ...entry, src: `./${entry.file}`, alt: entry.caption }, { exampleStatus: entry.exampleStatus }, label, false);
  mediaIndex.set(`./${entry.file}`, entry);
}

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
  assert.ok(hasText(skill.skillFile) && (skill.skillFile === "SKILL.md" || skill.skillFile.endsWith("/SKILL.md")), `${label}: original Skill file required`);
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
  assert.ok(["contain", "cover"].includes(skill.coverFit), `${label}: require coverFit`);
  inspectMedia({src:skill.cover,alt:skill.coverAlt,label:skill.coverLabel,sourceUrl:skill.coverSourceUrl,license:skill.coverLicense,credit:skill.coverCredit,sha256:skill.coverSha256},skill,`${label} cover`);
  assert.ok(!(skill.gallery && skill.galleries), `${label}: use a single gallery field`);
  const gallery = skill.gallery ?? skill.galleries ?? [];
  assert.ok(Array.isArray(gallery), `${label}: gallery must be an array`);
  for (const [index, media] of gallery.entries()) inspectMedia(media, skill, `${label} gallery ${index + 1}`);
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
console.log(`Verified: dark compiled website, ${catalog.length} reviewed Skills, ${sourceStats.size} sources, ${checkedImages.size} local images, matching metadata and license notices, no private source or source maps.`);
