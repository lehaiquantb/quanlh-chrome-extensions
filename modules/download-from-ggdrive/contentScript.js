let pdf = new jsPDF();
let elements = document.getElementsByTagName("img");
const fileName = document.querySelector('meta[property~="og:title"]')?.content ?? 'Exported_file.pdf';

for (let i in elements) {
    let img = elements[i];
    console.log("add img ", img);
    if (!/^blob:/.test(img.src)) {
        console.log("invalid src");
        continue;
    }
    let can = document.createElement('canvas');
    let con = can.getContext("2d");
    can.width = img.width;
    can.height = img.height;
    con.drawImage(img, 0, 0, img.width, img.height);
    let imgData = can.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.addPage();
}

pdf.save(fileName);
