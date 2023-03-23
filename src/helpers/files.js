export const uploadFile = async (myFile) => {
  const fileData = myFile;

  const path =
    __dirname +
    "/files/" +
    Date.now() +
    "." +
    mimeTypes.extension(fileData.mimetype);

  await fileData.mv(path, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Archivo subido correctamente");
  });

  return path;
};

export const deleteFileLaterUpload = (filePath) => {
  fs.access(filePath, (error) => {
    if (!error) {
      fs.unlinkSync(filePath);
      console.log("Archivo eliminado");
    } else {
      console.error("Error al eliminar archivo: ", error);
    }
  });
};
