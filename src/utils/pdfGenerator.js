// Importing the necessary parts of pdf-lib and fs module
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';

// Function to read the logo as an ArrayBuffer
async function getLogoArrayBuffer() {
  // The path to the logo image
  const logoPath = '../assets/images/TGTR.png';
  // Read the logo file
  const logoData = await fs.readFile(logoPath);
  // Convert the Buffer to ArrayBuffer
  return logoData.buffer.slice(logoData.byteOffset, logoData.byteOffset + logoData.byteLength);
}

/**
 * Generates a PDF from given form data and returns the PDF document as a Blob.
 * @param {Object} formData - The data collected from the form.
 * @returns {Promise<Blob>} - A promise that resolves with the Blob of the generated PDF.
 */
export async function generatePDF(formData) {
  // Load the logo as an ArrayBuffer
  const logoArrayBuffer = await getLogoArrayBuffer();
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  // Embed the logo image
  const logoImage = await pdfDoc.embedPng(logoArrayBuffer);
  
  // Draw the logo at the top of the page
  const logoDims = logoImage.scale(0.25); // Scale the logo to an appropriate size
  page.drawImage(logoImage, {
    x: 50,
    y: page.getHeight() - logoDims.height - 50,
    width: logoDims.width,
    height: logoDims.height,
  });

  let yOffset = page.getHeight() - logoDims.height - 100; // Start below the logo
  const fontSize = 12;
  const lineMargin = 18;

  // Drawing form data as text in the PDF
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
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

  // Add a line for the signature if necessary
  page.drawLine({
    start: { x: 50, y: yOffset - 10 },
    end: { x: 250, y: yOffset - 10 },
    color: rgb(0.0, 0.0, 0.0),
    thickness: 1,
  });
  page.drawText("Signature:", {
    x: 50,
    y: yOffset - 30,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  // Return the PDF as a Blob
  return new Blob([pdfBytes], { type: 'application/pdf' });
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

/**
 * Attempts to share a file using the Web Share API.
 * @param {Blob} blob - The file as a Blob object to share.
 * @param {string} filename - The filename for the shared file.
 */
export async function shareFile(blob, filename) {
  // Create a file from the Blob object
  const file = new File([blob], filename, { type: blob.type });

  // Check if the Web Share API is supported and if it can share files
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      // Attempt to share the file
      await navigator.share({
        files: [file],
        title: 'Share PDF',
        text: 'Check out this PDF!',
      });
      console.log('File was shared successfully');
    } catch (error) {
      console.error('Error sharing the file:', error);
    }
  } else {
    console.log('Web Share API is not supported in this browser, or the file type cannot be shared.');
  }
}
