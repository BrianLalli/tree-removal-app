import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Assuming you have a utility to fetch array buffer of the image
async function fetchLogoImage() {
  const response = await fetch('../assets/images/TGTR.png'); // Adjust the path to where your logo is stored
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

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

  // Embed the company logo
  const logoImageBytes = await fetchLogoImage();
  const logoImage = await pdfDoc.embedPng(logoImageBytes);
  const logoWidth = 100;
  const logoHeight = logoImage.height / logoImage.width * logoWidth;
  page.drawImage(logoImage, {
    x: 50,
    y: height - 50 - logoHeight,
    width: logoWidth,
    height: logoHeight
  });

  // Initialize yOffset after logo
  let yOffset = height - 60 - logoHeight; // Start below the logo

  // Drawing form data as text in the PDF
  const fontSize = 12;
  const lineMargin = 15;
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
    color: rgb(0, 0, 0),
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
