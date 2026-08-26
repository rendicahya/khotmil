const TOTAL_JUZ = 30;

const KAABA = '🕋';
const CROSS = '❎';
const VARIATION_SELECTOR = '️';

// Matches a task line like "🍃 Juz 25 : Tini 🕋" tolerantly:
// group 1 = everything before the word "juz" (leaf emoji, spacing, etc.)
// group 2 = juz number
// group 3 = name + completion marks after the colon
const JUZ_LINE_REGEX = /^(.*?)juz\s*(\d{1,2})\s*:\s*(.*)$/i;

function stripMarks(rest) {
  return rest.split(KAABA).join('').split(CROSS).join('').split(VARIATION_SELECTOR).join('');
}

function parseNameAndMarks(rest) {
  const done = rest.includes(KAABA);
  const missCount = rest.split(CROSS).length - 1;
  const name = stripMarks(rest).trim().replace(/\s+/g, ' ');
  return { name, done, missCount };
}

function nextJuz(current) {
  return (current % TOTAL_JUZ) + 1;
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

  const outLines = lines.map((line) => {
    const match = line.match(JUZ_LINE_REGEX);
    if (!match) return collapseSpaces(line);

    const [, prefix, juzStr, rest] = match;
    const juzNum = parseInt(juzStr, 10);
    if (!Number.isFinite(juzNum) || juzNum < 1 || juzNum > TOTAL_JUZ) return collapseSpaces(line);

    const { name, done, missCount } = parseNameAndMarks(rest);
    if (!name) return collapseSpaces(line);

    const juz = nextJuz(juzNum);
    const suffix = done ? '' : ' ' + CROSS.repeat(missCount + 1);

    return collapseSpaces(`${prefix}Juz ${juz} : ${name}${suffix}`);
  });

  return advanceDatesByOneWeek(outLines.join('\n'));
}

export function countJuzLines(text) {
  if (!text) return 0;
  return text
    .split(/\r\n|\r|\n/)
    .filter((line) => JUZ_LINE_REGEX.test(line)).length;
}
