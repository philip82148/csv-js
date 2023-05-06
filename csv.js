export async function csvToArray(file) {
  const content = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsText(file);
  });

  return csvStringToArray(content);
}

function csvStringToArray(csvString) {
  return [...getRowStrings(csvString)].map((rowString) => [
    ...getCells(rowString),
  ]);
}

function* getRowStrings(csvString) {
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

function* getCells(csvRowString) {
  const cells = csvRowString.split(/,/);

  let cell = [];
  let quotCount = 0;
  for (const line of cells) {
    cell.push(line);
    quotCount += (line.match(/"/g) || []).length;

    if (quotCount % 2) continue;

    const cellString = cell.join(",");
    yield cellString.replace(/^"|""|"$/g, function (match) {
      return {
        '"': "",
        '""': '"',
      }[match];
    });

    cell = [];
    quotCount = 0;
  }
}
