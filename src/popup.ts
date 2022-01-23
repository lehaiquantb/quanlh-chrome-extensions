import { ScriptId, ScriptType } from './type';
import './assets/scss/app.scss';
import './assets/js/jspdf.debug';

let downloadButtonPdf = document.getElementById('download-file-pdf');
let downloadButtonDocx = document.getElementById('download-file-docx');

async function getCurrentTab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	return tab;
}

chrome.storage.sync.get('color', ({ color }) => {});

async function injectScript(scriptType: ScriptType) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, scriptType);
	});
}

downloadButtonPdf.addEventListener('click', async () => {
	await injectScript({ id: ScriptId.DOWNLOAD_PDF });
	// chrome.scripting.executeScript({
	// 	target: { tabId: tab.id },
	// 	func: downloadPdf,
	// });
});

downloadButtonDocx.addEventListener('click', async () => {
	await injectScript({ id: ScriptId.DOWNLOAD_WORD });
});
