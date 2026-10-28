
import { PDFParse } from "pdf-parse";

export const extractTextFromPdf = async (
  fileBuffer: Buffer
): Promise<string> => {
  const parser = new PDFParse({
    data: fileBuffer,
  });

  try {
    const result = await parser.getText();
    const extractedText = result.text.trim();

    if (!extractedText) {
      throw new Error(
        "No readable text was found in the PDF."
      );
    }

    return extractedText;
  } finally {
    await parser.destroy();
  }
};
