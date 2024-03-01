import xlsx from 'xlsx';

export const readFileFromExcel = (path) => {
  const file = xlsx.readFile(path);
  let resp = {};
  const sheets = file.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const data = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
    resp[sheets[i]] = data;
  }
  return resp;
};

export const writeFile = (data, sheetName, path) => {
  const workBook = xlsx.utils.book_new();

  const ws = xlsx.utils.json_to_sheet(data);

  xlsx.utils.book_append_sheet(workBook, ws, sheetName);

  xlsx.writeFile(
    workBook,
    path,
    { bookType: 'xlsx', type: 'file' },
    function (err) {
      if (err) console.error(err);
      console.log('Excel file created successfully at path: ', path);
    }
  );
};
