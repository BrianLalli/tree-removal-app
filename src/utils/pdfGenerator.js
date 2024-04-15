// Importing the necessary part of pdf-lib
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Generates a PDF from given form data and returns the PDF document as a Blob.
 * @param {Object} formData - The data collected from the form.
 * @returns {Promise<Blob>} - A promise that resolves with the Blob of the generated PDF.
 */
export async function generatePDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  let yOffset = height - 50; // Start printing from top of the page.
  
  // Adjust these values as needed for your layout
  const fontSize = 12;
  const lineMargin = 15;

  // Drawing form data as text in the PDF
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      page.drawText(`${key}: ${formData[key]}`, {
        x: 50,
        y: yOffset,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineMargin; // Move to the next line
    }
  }

  // Add a line for the signature
  page.drawLine({
    start: { x: 50, y: yOffset - 20 },
    end: { x: 300, y: yOffset - 20 },
    color: rgb(0.0, 0.0, 0.0),
    thickness: 1.5,
  });
  page.drawText("Signature:", {
    x: 50,
    y: yOffset - 40,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Triggers a download of the given Blob.
 * @param {Blob} blob - The Blob to download (e.g., our generated PDF).
 * @param {string} filename - The filename to save as.
 */
export function downloadPDF(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
