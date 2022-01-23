import { ScriptId, ScriptType } from './type';
import axios from 'axios';

chrome.runtime.onMessage.addListener(function (
	message: ScriptType,
	sender,
	sendResponse
) {
	switch (message.id) {
		case ScriptId.DOWNLOAD_PDF:
			downloadPdf();
			break;
		case ScriptId.DOWNLOAD_WORD:
			downloadWord();
		default:
			break;
	}
});

export function downloadPdf() {
	// @ts-ignore:
	let pdf = new jsPDF();
	let elements = document.getElementsByTagName('img');

	const fileName =
		(document.querySelector('meta[property~="og:title"]') as any)
			?.content ?? 'Exported_file.pdf';

	for (let i in elements) {
		let img = elements[i];
		console.log('add img ', img);
		if (!/^blob:/.test(img.src)) {
			console.log('invalid src');
			continue;
		}
		let can = document.createElement('canvas');
		let con = can.getContext('2d');
		can.width = img.width;
		can.height = img.height;
		con.drawImage(img, 0, 0, img.width, img.height);
		let imgData = can.toDataURL('image/jpeg', 1.0);
		pdf.addImage(imgData, 'JPEG', 0, 0);
		pdf.addPage();
	}

	pdf.save(fileName);
}

export function downloadWord() {
	const documentIDPath =
		document.URL.match(/(document|file)\/d(.*)\//)?.[2] ?? '';

	let parseDocument;

	// Make a request for a user with a given ID
	axios
		.get(`https://docs.google.com/document/d${documentIDPath}/mobilebasic`)
		.then(function (response) {
			// handle success
			console.log(response);
			const text = response?.data;
			const parser = new DOMParser();
			parseDocument = parser.parseFromString(text, 'text/html');
			handleDownloadWord(parseDocument.querySelector('.doc').outerHTML);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
		});

	// fetch(`https://docs.google.com/document/d${documentIDPath}/mobilebasic`)
	// 	.then((response) => response.text())
	// 	.then((data) => {
	// 		const parser = new DOMParser();
	// 		let parseDocument: Document;
	// 		parseDocument = parser.parseFromString(data ?? '', 'text/html');
	// 		handleDownloadWord(parseDocument.querySelector('.doc').outerHTML);
	// 	});
}

function handleDownloadWord(text: string) {
	const header =
		"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
		"xmlns:w='urn:schemas-microsoft-com:office:word' " +
		"xmlns='http://www.w3.org/TR/REC-html40'>" +
		"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
	const footer = '</body></html>';

	const sourceHTML = header + text + footer;

	const source =
		'data:application/vnd.ms-word;charset=utf-8,' +
		encodeURIComponent(sourceHTML);

	const filename = `${
		document.querySelector('title')?.text?.replace(/(.docx|.doc)$/g, '') ??
		'Document'
	}.doc`;

	let fileDownload = document.createElement('a');
	document.body.appendChild(fileDownload);
	fileDownload.href = source;
	fileDownload.download = filename;
	fileDownload.click();
	document.body.removeChild(fileDownload);
}
