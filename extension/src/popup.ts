import { ScriptId, ScriptType } from "./type"
import "./assets/scss/app.scss"

const downloadButtonPdf = document.getElementById("download-file-pdf")
const downloadButtonDocx = document.getElementById("download-file-docx")

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  return tab
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
chrome.storage.sync.get("color", ({ color }) => {})

async function injectScript(scriptType: ScriptType) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, scriptType)
  })
}

downloadButtonPdf.addEventListener("click", async () => {
  await injectScript({ id: ScriptId.DOWNLOAD_PDF })
  // chrome.scripting.executeScript({
  // 	target: { tabId: tab.id },
  // 	func: downloadPdf,
  // });
})

downloadButtonDocx.addEventListener("click", async () => {
  await injectScript({ id: ScriptId.DOWNLOAD_WORD })
})
