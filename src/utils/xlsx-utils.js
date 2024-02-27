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
