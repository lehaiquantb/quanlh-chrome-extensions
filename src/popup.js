// Initialize butotn with users's prefered color
let downloadButton = document.getElementById("download-file");
let downloadButtonDocx = document.getElementById("download-file-docx");

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

chrome.storage.sync.get("color", ({ color }) => {
});

// When the button is clicked, inject setPageBackgroundColor into current page
downloadButton.addEventListener("click", async () => {
  const tab = await getCurrentTab();
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: setPageBackgroundColor,
  // });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['assets/js/jspdf.debug.js', 'modules/download-from-ggdrive/contentScript.js']
  });
});

downloadButtonDocx.addEventListener("click", async () => {
  const tab = await getCurrentTab();
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: setPageBackgroundColor,
  // });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: exportHTML
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function exportHTML() {
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + document.querySelector('.doc').outerHTML + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  let fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = 'document.doc';
  fileDownload.click();
  document.body.removeChild(fileDownload);
}
