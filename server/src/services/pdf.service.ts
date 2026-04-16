import fs from "fs/promises";

export class PdfService {
  static async extractText(filePath: string): Promise<string> {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const buffer = await fs.readFile(filePath);
    const data = new Uint8Array(buffer); // 🔥 KEY FIX

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");

      text += pageText + "\n";
    }

    return text;
  }
}