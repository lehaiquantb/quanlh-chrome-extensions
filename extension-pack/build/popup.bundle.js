/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
// import "./assets/scss/app.scss"
const downloadButtonPdf = document.getElementById("download-file-pdf");
const downloadButtonDocx = document.getElementById("download-file-docx");
async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return tab;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
chrome.storage.sync.get("color", ({ color }) => { });

// async function injectScript(scriptType: ScriptType) {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, scriptType)
//   })
// }
// downloadButtonPdf.addEventListener("click", async () => {
//   await injectScript({ id: ScriptId.DOWNLOAD_PDF })
// chrome.scripting.executeScript({
// 	target: { tabId: tab.id },
// 	func: downloadPdf,
// });
// })
// downloadButtonDocx.addEventListener("click", async () => {
//   await injectScript({ id: ScriptId.DOWNLOAD_WORD })
// })

/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map