export async function csvFileToArray(csvFile) {
  const csvString = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsText(csvFile);
  });

  return csvStringToArray(csvString);
}

export async function csvUrlToArray(csvUrl) {
  const csvString = await fetch(csvUrl).then((response) => response.text());
  return csvStringToArray(csvString);
}

export function csvStringToArray(csvString) {
  return [...getCsvRowStrings(csvString)].map((csvRowString) => [
    ...getCellStrings(csvRowString),
  ]);
}

function* getCsvRowStrings(csvString) {
  const lines = csvString.split(/\r?\n/);

  let row = [];
  let quotCount = 0;
  for (const line of lines) {
    row.push(line);
    quotCount += (line.match(/"/g) || []).length;

    if (quotCount % 2) continue;

    const csvRowString = row.join("\r\n");
    if (csvRowString) yield csvRowString;

    row = [];
    quotCount = 0;
  }
}

function* getCellStrings(csvRowString) {
  const cells = csvRowString.split(/,/);

  let cell = [];
  let quotCount = 0;
  for (const line of cells) {
    cell.push(line);
    quotCount += (line.match(/"/g) || []).length;

    if (quotCount % 2) continue;

    const cellString = cell.join(",").replace(/^"|""|"$/g, function (match) {
      return {
        '"': "",
        '""': '"',
      }[match];
    });
    yield cellString;

    cell = [];
    quotCount = 0;
  }
}
