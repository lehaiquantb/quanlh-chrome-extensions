// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let downloadButton = document.getElementById("download-file");

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
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

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
