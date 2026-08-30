const TOTAL_JUZ = 30;

const KAABA = '🕋';
const CROSS = '❎';
const VARIATION_SELECTOR = '️';

// Marker appended when someone reports "kholash" via chat but has no existing
// emoji on their recap line (Safinda group only).
const KHOLASH_MARK = '🌷';

// Matches a task line like "🍃 Juz 25 : Tini 🕋" tolerantly:
// group 1 = everything before the word "juz" (leaf emoji, spacing, etc.)
// group 2 = juz number
// group 3 = name + trailing marks after the colon
const JUZ_LINE_REGEX = /^(.*?)juz\s*(\d{1,2})\s*:\s*(.*)$/i;

// Matches a group label like " Kelompok 1:" tolerantly (Besuki only). Group 1
// advances two juz per period; every other group advances one.
const GROUP_LABEL_REGEX = /^\s*kelompok\s*(\d+)/i;

// Trailing run of emoji / symbols / joiners / spacing that follows a name.
const TRAILING_MARKS_REGEX = /[\s‍️\p{Extended_Pictographic}]+$/u;

const graphemeSegmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('id', { granularity: 'grapheme' })
    : null;

function splitGraphemes(str) {
  if (!str) return [];
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(str), (s) => s.segment);
  }
  return Array.from(str.replace(/[️‍]/g, ''));
}

function stripMarks(rest) {
  return rest.split(KAABA).join('').split(CROSS).join('').split(VARIATION_SELECTOR).join('');
}

function parseNameAndMarks(rest) {
  const done = rest.includes(KAABA);
  const missCount = rest.split(CROSS).length - 1;
  const name = stripMarks(rest).trim().replace(/\s+/g, ' ');
  return { name, done, missCount };
}

function nextJuz(current, step) {
  return ((current - 1 + step) % TOTAL_JUZ) + 1;
}

function collapseSpaces(line) {
  return line.replace(/[ \t]{2,}/g, ' ');
}

function normalizeName(name) {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Normalises the leading part (leaf emoji, bullet, spacing) so every line reads
// "<prefix> Juz N : Name <marks>" with exactly one space before "Juz".
function formatLine(prefix, juz, name, marks) {
  const cleanPrefix = prefix.trim();
  const lead = cleanPrefix ? `${cleanPrefix} ` : '';
  const suffix = marks ? ` ${marks}` : '';
  return collapseSpaces(`${lead}Juz ${juz} : ${name}${suffix}`);
}

const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DATE_REGEX = new RegExp(
  `\\b(\\d{1,2})\\s+(${INDO_MONTHS.join('|')})\\s+(\\d{4})\\b`,
  'gi'
);

function advanceDatesByDays(text, days) {
  return text.replace(DATE_REGEX, (matchStr, dayStr, monthStr, yearStr) => {
    const monthIndex = INDO_MONTHS.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase()
    );
    if (monthIndex === -1) return matchStr;

    const date = new Date(Date.UTC(parseInt(yearStr, 10), monthIndex, parseInt(dayStr, 10)));
    date.setUTCDate(date.getUTCDate() + days);

    const newDay = date.getUTCDate();
    const newMonth = INDO_MONTHS[date.getUTCMonth()];
    const newYear = date.getUTCFullYear();

    return `${newDay} ${newMonth} ${newYear}`;
  });
}

/**
 * Transforms a "pembagian tugas" / recap text into the next period's version.
 * `options.group` selects the mechanism:
 *   - 'besuki' (default): one kelompok label per section, Kelompok 1 advances
 *     two juz, 🕋 clears / missing juz gets a ❎.
 *   - 'safinda': single kelompok, decorative emoji = "setoran" credit read
 *     ahead; each period drops one and the person is covered. Extra credit
 *     comes from `options.chatText` (pasted WhatsApp setoran messages).
 */
export function transformText(text, options = {}) {
  const { periodDays = 14, group = 'besuki', chatText = '' } = options;
  if (!text) return '';
  return group === 'safinda'
    ? transformSafinda(text, periodDays, chatText)
    : transformBesuki(text, periodDays);
}

function transformBesuki(text, periodDays) {
  const lines = text.split(/\r\n|\r|\n/);

  let currentGroup = null;

  const outLines = lines.map((line) => {
    if (line.trim() === '') return '';

    const groupMatch = line.match(GROUP_LABEL_REGEX);
    if (groupMatch) {
      currentGroup = parseInt(groupMatch[1], 10);
      return collapseSpaces(line);
    }

    const match = line.match(JUZ_LINE_REGEX);
    if (!match) return collapseSpaces(line);

    const [, prefix, juzStr, rest] = match;
    const juzNum = parseInt(juzStr, 10);
    if (!Number.isFinite(juzNum) || juzNum < 1 || juzNum > TOTAL_JUZ) return collapseSpaces(line);

    const { name, done, missCount } = parseNameAndMarks(rest);
    if (!name) return collapseSpaces(line);

    const step = currentGroup === 1 ? 2 : 1;
    const juz = nextJuz(juzNum, step);
    const marks = done ? '' : CROSS.repeat(missCount + 1);

    return formatLine(prefix, juz, name, marks);
  });

  const joined = outLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return advanceDatesByDays(joined, periodDays);
}

// Splits a name from its trailing marks. Returns the decorative "kholash" emoji
// as a list of graphemes plus a count of ❎ (carried-over misses).
function parseSafindaMarks(rest) {
  const match = rest.match(TRAILING_MARKS_REGEX);
  const marksStr = (match ? match[0] : '').trim();
  const namePart = match ? rest.slice(0, match.index) : rest;
  const name = namePart.trim().replace(/\s+/g, ' ');

  const kholash = [];
  let missCount = 0;

  for (const seg of splitGraphemes(marksStr)) {
    const bare = seg.replace(/[️‍\s]/g, '');
    if (!bare) continue;
    if (bare === CROSS) {
      missCount += 1;
    } else {
      kholash.push(seg);
    }
  }

  return { name, kholash, missCount };
}

// Counts how many juz a chat message reports, e.g. "juz 7-8" -> 2, "juz 28" -> 1,
// "juz 5, 6 dan 7" -> 3.
function countJuzInMessage(body) {
  const match = body.match(
    /juz\s*([0-9]{1,2}(?:\s*(?:[-–—]|sampai|s\.?\/?d\.?)\s*[0-9]{1,2})?(?:\s*(?:,|dan|&|\/|\+)\s*[0-9]{1,2})*)/i
  );
  if (!match) return 0;

  const chunk = match[1];
  const range = chunk.match(/^([0-9]{1,2})\s*(?:[-–—]|sampai|s\.?\/?d\.?)\s*([0-9]{1,2})$/i);
  if (range) {
    const from = parseInt(range[1], 10);
    const to = parseInt(range[2], 10);
    if (Number.isFinite(from) && Number.isFinite(to) && to >= from) {
      return to - from + 1;
    }
  }

  const nums = chunk.match(/[0-9]{1,2}/g);
  return nums ? nums.length : 0;
}

/**
 * Parses pasted WhatsApp chat lines into a map of normalized name -> juz count
 * reported as done. Tolerant of the common export prefixes:
 *   "[8/30, 15:45] Bu Fulan: ..."  and  "8/30/26, 15:45 - Bu Fulan: ..."
 */
function parseChatSetoran(chatText) {
  const credits = new Map();
  if (!chatText) return credits;

  for (const rawLine of chatText.split(/\r\n|\r|\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    let m = line.match(/^\[[^\]]*\]\s*([^:]+?):\s*(.*)$/);
    if (!m) m = line.match(/^[^\][]*?\s-\s([^:]+?):\s*(.*)$/);
    if (!m) continue;

    const name = m[1].trim().replace(/\s+/g, ' ');
    const body = m[2];
    if (!name || /belum|belom|belon/i.test(body)) continue;

    const count = countJuzInMessage(body);
    if (count <= 0) continue;

    const key = normalizeName(name);
    credits.set(key, (credits.get(key) || 0) + count);
  }

  return credits;
}

function transformSafinda(text, periodDays, chatText) {
  const credits = parseChatSetoran(chatText);
  const lines = text.split(/\r\n|\r|\n/);

  const outLines = lines.map((line) => {
    if (line.trim() === '') return '';

    const match = line.match(JUZ_LINE_REGEX);
    if (!match) return collapseSpaces(line);

    const [, prefix, juzStr, rest] = match;
    const juzNum = parseInt(juzStr, 10);
    if (!Number.isFinite(juzNum) || juzNum < 1 || juzNum > TOTAL_JUZ) return collapseSpaces(line);

    const { name, kholash, missCount } = parseSafindaMarks(rest);
    if (!name) return collapseSpaces(line);

    const key = normalizeName(name);
    const credit = credits.get(key) || 0;
    if (credit) credits.set(key, 0); // apply chat credit to the first matching line

    const pending = kholash.slice();
    for (let i = 0; i < credit; i += 1) pending.push(KHOLASH_MARK);

    let newMiss = missCount;
    if (pending.length > 0) {
      // one juz of setoran credit covers the next period; drop it and no ❎
      pending.pop();
    } else {
      newMiss = missCount + 1;
    }

    const marks = pending.join('') + CROSS.repeat(newMiss);
    const juz = nextJuz(juzNum, 1);

    return formatLine(prefix, juz, name, marks);
  });

  const joined = outLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return advanceDatesByDays(joined, periodDays);
}

export function countJuzLines(text) {
  if (!text) return 0;
  return text
    .split(/\r\n|\r|\n/)
    .filter((line) => JUZ_LINE_REGEX.test(line)).length;
}
