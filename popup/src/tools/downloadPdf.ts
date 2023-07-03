import { jsPDF } from "jspdf";

export function downloadPdf() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF();
  const elements = document.getElementsByTagName("img");

  const fileName =
    (document.querySelector('meta[property~="og:title"]') as any)?.content ??
    "Exported_file.pdf";

  for (const i in elements) {
    const img = elements[i];
    console.log("add img ", img);
    if (!/^blob:/.test(img.src)) {
      console.log("invalid src");
      continue;
    }
    const can = document.createElement("canvas");
    const con = can.getContext("2d");
    can.width = img.width;
    can.height = img.height;
    con?.drawImage(img, 0, 0, img.width, img.height);
    const imgData = can.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
    pdf.addPage();
  }

  pdf.save(fileName);
}
