import { getManifestVersion } from "./shared"

const color = "#3aa757"
console.log("Background script running...", chrome)

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.sync.set({ color })
  console.log("Default background color set to %cgreen", `color: ${color}`)
})
// const getTabs = () => {
//   return new Promise<chrome.tabs.Tab[]>((resolve) => {
//     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//       resolve(tabs)
//     })
//   })
// }
// ;(async () => {
//   const tab = (await getTabs())?.[0]
//   console.log("Tab clicked!", tab.url, tab.id, tab)

//   const tabId = tab?.id

//   if (tabId) {
//     chrome.scripting.executeScript({
//       target: {
//         tabId,
//       },
//       // files: ["assets/js/swagger-ui-bundle.min.js"],
//       world: "MAIN",
//       func: () => {
//         console.log("Script injected!")
//       },
//     })
//   }
// })()

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.tabs.query(
//     { active: true, currentWindow: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
//     function (tabs) {
//       const url = tabs[0].url
//       console.log(url)
//     },
//   )
// })

if (getManifestVersion() === 2) {
  // chrome.webRequest.onBeforeRequest.addListener(
  //   (request) => {
  //     console.log(request)
  //   },
  //   { urls: ["https://*/*", "http://*/*"] },
  // )
} else {
  // rules for V3 
}

// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     console.log(details.requestBody)
//   },
//   { urls: ["https://api-dev.cr-mdr.aws.tokyotechies.co.jp/swagger"] },
//   ["requestBody"],
// )

export {}
