const color = "#3aa757"
console.log("Background script running...");

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color })
  console.log("Default background color set to %cgreen", `color: ${color}`)
})

export {}
