import './assets/scss/app.scss';
import './assets/js/jspdf.debug';
import { downloadPdf, downloadWord } from './contentScript';

// Initialize butotn with users's prefered color
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

async function injectScript() {
	const tab = await getCurrentTab();
	// chrome.scripting.executeScript({
	//   target: { tabId: tab.id },
	//   function: setPageBackgroundColor,
	// });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ['assets/js/jspdf.debug.js'],
	});
}

// When the button is clicked, inject setPageBackgroundColor into current page
downloadButtonPdf.addEventListener('click', async () => {
	const tab = await getCurrentTab();
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: downloadPdf,
	});
});

downloadButtonDocx.addEventListener('click', async () => {
	const tab = await getCurrentTab();
	// chrome.scripting.executeScript({
	//   target: { tabId: tab.id },
	//   function: setPageBackgroundColor,
	// });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: downloadWord,
	});
});
