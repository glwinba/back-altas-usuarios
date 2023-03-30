import { deleteFileLaterUpload, uploadFile } from "./files";
import reader from "xlsx";

export const extractDataExcel = async (req, res) => {
  let path = await uploadFile(req.files.file);

  setTimeout(async () => {
    const file = reader.readFile(path);

    let data = [];
    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i] === "PROVEEDOR") {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );

        temp.forEach((respuesta) => {
          data.push(respuesta);
        });
      }
    }

    res.json(data);
    deleteFileLaterUpload(path);
  }, 5000);
};
