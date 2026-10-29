
import multer from "multer";

const pdfFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  const isPdf =
    file.mimetype === "application/pdf" &&
    file.originalname.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    callback(new Error("Only PDF files are allowed."));
    return;
  }

  callback(null, true);
};

export const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: pdfFileFilter,
});
