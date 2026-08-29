const TOTAL_JUZ = 30;

const KAABA = '🕋';
const CROSS = '❎';
const VARIATION_SELECTOR = '️';

// Matches a task line like "🍃 Juz 25 : Tini 🕋" tolerantly:
// group 1 = everything before the word "juz" (leaf emoji, spacing, etc.)
// group 2 = juz number
// group 3 = name + completion marks after the colon
const JUZ_LINE_REGEX = /^(.*?)juz\s*(\d{1,2})\s*:\s*(.*)$/i;

// Matches a group label like " Kelompok 1:" tolerantly. Group 1 advances
// two juz per period; every other group advances one.
const GROUP_LABEL_REGEX = /^\s*kelompok\s*(\d+)/i;

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

const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DATE_REGEX = new RegExp(
  `\\b(\\d{1,2})\\s+(${INDO_MONTHS.join('|')})\\s+(\\d{4})\\b`,
  'gi'
);

function advanceDatesByOneWeek(text) {
  return text.replace(DATE_REGEX, (matchStr, dayStr, monthStr, yearStr) => {
    const monthIndex = INDO_MONTHS.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase()
    );
    if (monthIndex === -1) return matchStr;

    const date = new Date(Date.UTC(parseInt(yearStr, 10), monthIndex, parseInt(dayStr, 10)));
    date.setUTCDate(date.getUTCDate() + 7);

    const newDay = date.getUTCDate();
    const newMonth = INDO_MONTHS[date.getUTCMonth()];
    const newYear = date.getUTCFullYear();

    return `${newDay} ${newMonth} ${newYear}`;
  });
}

/**
 * Parses a raw "pembagian tugas" text into per-line info, tolerant of
 * inconsistent manual formatting. Non-juz lines (header, footer, group
 * labels, blank lines) are left untouched.
 */
export function transformText(text) {
  if (!text) return '';

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
    const suffix = done ? '' : ' ' + CROSS.repeat(missCount + 1);

    return collapseSpaces(`${prefix}Juz ${juz} : ${name}${suffix}`);
  });

  const joined = outLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return advanceDatesByOneWeek(joined);
}

export function countJuzLines(text) {
  if (!text) return 0;
  return text
    .split(/\r\n|\r|\n/)
    .filter((line) => JUZ_LINE_REGEX.test(line)).length;
}
