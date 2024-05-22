/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shared/helper.common.ts":
/*!*************************************!*\
  !*** ./src/shared/helper.common.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addScript": () => (/* binding */ addScript),
/* harmony export */   "copyToClipboard": () => (/* binding */ copyToClipboard),
/* harmony export */   "createElementByText": () => (/* binding */ createElementByText),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "getChrome": () => (/* binding */ getChrome),
/* harmony export */   "getCurrentTab": () => (/* binding */ getCurrentTab),
/* harmony export */   "getGlobalVar": () => (/* binding */ getGlobalVar),
/* harmony export */   "getManifestVersion": () => (/* binding */ getManifestVersion),
/* harmony export */   "getRuntimeEnvironment": () => (/* binding */ getRuntimeEnvironment),
/* harmony export */   "globalVarIsExist": () => (/* binding */ globalVarIsExist),
/* harmony export */   "injectReplaceCSS": () => (/* binding */ injectReplaceCSS),
/* harmony export */   "isEmptyString": () => (/* binding */ isEmptyString),
/* harmony export */   "isMatchWebsite": () => (/* binding */ isMatchWebsite),
/* harmony export */   "parseJson": () => (/* binding */ parseJson),
/* harmony export */   "tryEval": () => (/* binding */ tryEval),
/* harmony export */   "waitUntil": () => (/* binding */ waitUntil)
/* harmony export */ });
/* eslint-disable no-eval */
const createElementByText = (textHTML = "") => {
    const template = document.createElement("template");
    textHTML = textHTML.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = textHTML;
    return template.content.firstElementChild;
};
function copyToClipboard(text) {
    try {
        const elem = document.createElement("textarea");
        elem.value = text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);
        return true;
    }
    catch (error) {
        return false;
    }
}
const isEmptyString = (str) => {
    return str === "" || str === null || str === undefined;
};
function globalVarIsExist(varName) {
    try {
        return !!window?.[varName] ?? eval(`typeof ${varName}`) !== "undefined";
    }
    catch (error) {
        // console.log('varIsExist', error);
        return false;
    }
}
function getGlobalVar(varName) {
    try {
        return globalVarIsExist(varName) ? window?.[varName] ?? eval(varName) : undefined;
    }
    catch (error) {
        return undefined;
    }
}
function getChrome() {
    return getGlobalVar("chrome");
}
async function getCurrentTab() {
    return (await getChrome()?.tabs?.query?.({
        active: true,
        currentWindow: true,
    }))?.[0];
}
function tryEval(str, context) {
    try {
        const contextString = `
                const { ${Object.keys(context ?? {}).join(",")} } = context ?? {};
            `;
        return eval(contextString + str);
    }
    catch (error) {
        console.error("tryEval =>", error);
        return undefined;
    }
}
function getRuntimeEnvironment() {
    const envs = [];
    try {
        const chrome = getChrome();
        if (!chrome) {
            envs.push("browser");
        }
        if (typeof chrome?.extension !== "undefined") {
            console.log("Script đang chạy trong background.");
            envs.push("background");
        }
        else if (typeof chrome?.runtime !== "undefined") {
            console.log("Script đang chạy trong background hoặc event page.");
            envs.push("background_or_event_page");
        }
        const popupExists = chrome?.extension?.getViews?.({ type: "popup" })?.length > 0;
        if (popupExists) {
            console.log("Script đang chạy trong popup.");
            envs.push("popup");
        }
        const isContentScript = window?.location?.href?.startsWith?.("http");
        const backgroundPageExists = typeof chrome?.extension?.getBackgroundPage?.() !== "undefined";
        if (isContentScript) {
            console.log("Script đang chạy trong content script.");
            envs.push("content_script");
        }
        if (backgroundPageExists) {
            console.log("Script đang chạy trong content script và background.");
            envs.push("content_script_and_background");
        }
        return envs;
    }
    catch (error) {
        console.log("getRuntimeEnvironment", error);
        envs.push("unknown");
        return envs;
    }
}
const parseJson = (value) => {
    try {
        return JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
    }
    catch (error) {
        console.log("Error in parseJson", error);
        return undefined;
    }
};
const isMatchWebsite = (matchRegexUrls) => {
    return matchRegexUrls?.some((url) => new RegExp(url).test(window.location.href));
};
const injectReplaceCSS = (() => {
    const style = document.createElement("style");
    document.head.append(style);
    return (cssText) => {
        try {
            style.textContent = cssText;
        }
        catch (error) {
            console.log(`Error in injectReplaceCSS ${error}`);
        }
    };
})();
const waitUntil = async (conditionCb, interval = 100, maxAttempts = 5000) => {
    let attempts = 0;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            if (await conditionCb()) {
                return resolve(null);
            }
            const intervalId = setInterval(async function () {
                attempts++;
                try {
                    const a = await conditionCb();
                    if (a || attempts >= maxAttempts) {
                        resolve(null);
                        clearInterval(intervalId);
                        return null;
                    }
                }
                catch (error) {
                    reject(error);
                    clearInterval(intervalId);
                }
            }, interval);
        }
        catch (error) {
            console.log("Error in waitUntil", error);
            reject(error);
        }
    });
};
const delay = (ts) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, ts);
    });
};
function addScript(src) {
    const s = document.createElement("script");
    s.setAttribute("src", src);
    document.body.appendChild(s);
}
function getManifestVersion() {
    return chrome.runtime.getManifest().manifest_version;
}
const HELPER = {
    createElementByText,
    copyToClipboard,
    isEmptyString,
    globalVarIsExist,
    getGlobalVar,
    getChrome,
    getCurrentTab,
    tryEval,
    getRuntimeEnvironment,
    parseJson,
    isMatchWebsite,
    injectReplaceCSS,
    waitUntil,
    delay,
    addScript,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HELPER);


/***/ }),

/***/ "./src/shared/index.ts":
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ECommandId": () => (/* binding */ ECommandId),
/* harmony export */   "Storage": () => (/* reexport safe */ _services_storage__WEBPACK_IMPORTED_MODULE_1__.Storage),
/* harmony export */   "addScript": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.addScript),
/* harmony export */   "chrome": () => (/* binding */ chrome),
/* harmony export */   "copyToClipboard": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.copyToClipboard),
/* harmony export */   "createElementByText": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.createElementByText),
/* harmony export */   "delay": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.delay),
/* harmony export */   "getChrome": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.getChrome),
/* harmony export */   "getCurrentTab": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.getCurrentTab),
/* harmony export */   "getGlobalVar": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.getGlobalVar),
/* harmony export */   "getManifestVersion": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.getManifestVersion),
/* harmony export */   "getRuntimeEnvironment": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.getRuntimeEnvironment),
/* harmony export */   "globalVarIsExist": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.globalVarIsExist),
/* harmony export */   "injectReplaceCSS": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.injectReplaceCSS),
/* harmony export */   "isEmptyString": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.isEmptyString),
/* harmony export */   "isMatchWebsite": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.isMatchWebsite),
/* harmony export */   "parseJson": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.parseJson),
/* harmony export */   "storageChrome": () => (/* reexport safe */ _services_storage__WEBPACK_IMPORTED_MODULE_1__.storageChrome),
/* harmony export */   "storageLocal": () => (/* reexport safe */ _services_storage__WEBPACK_IMPORTED_MODULE_1__.storageLocal),
/* harmony export */   "tryEval": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.tryEval),
/* harmony export */   "waitUntil": () => (/* reexport safe */ _helper_common__WEBPACK_IMPORTED_MODULE_0__.waitUntil)
/* harmony export */ });
/* harmony import */ var _helper_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper.common */ "./src/shared/helper.common.ts");
/* harmony import */ var _services_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/storage */ "./src/shared/services/storage.ts");

var ECommandId;
(function (ECommandId) {
    ECommandId["DOWNLOAD_WORD"] = "download-word";
    ECommandId["DOWNLOAD_PDF"] = "download-pdf";
    ECommandId["TEST_COMMAND"] = "test-command";
    ECommandId["GET_RECAPTCHA_TOKEN"] = "get-reCAPTCHA-token";
})(ECommandId || (ECommandId = {}));


const chrome = (0,_helper_common__WEBPACK_IMPORTED_MODULE_0__.getChrome)();


/***/ }),

/***/ "./src/shared/services/storage.ts":
/*!****************************************!*\
  !*** ./src/shared/services/storage.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Storage": () => (/* binding */ Storage),
/* harmony export */   "storageChrome": () => (/* binding */ storageChrome),
/* harmony export */   "storageLocal": () => (/* binding */ storageLocal)
/* harmony export */ });
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/shared */ "./src/shared/index.ts");

class Storage {
    type = "chromeStorage";
    constructor(type = "chromeStorage") {
        this.type = type;
        // switch (this.type) {
        //   case "localStorage":
        //     break
        //   case "chromeStorage":
        //     this.onChange()
        //     break
        // }
    }
    async set(key, value) {
        try {
            switch (this.type) {
                case "localStorage":
                    // eslint-disable-next-line no-case-declarations
                    const oldValue = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.parseJson)(localStorage)?.[key];
                    localStorage.setItem(key, value);
                    // eslint-disable-next-line no-case-declarations
                    const event = new CustomEvent("itemInserted", {
                        detail: {
                            oldValue,
                            newValue: value,
                            key,
                        },
                    });
                    document.dispatchEvent(event);
                    break;
                case "chromeStorage":
                    await _shared__WEBPACK_IMPORTED_MODULE_0__.chrome?.storage?.local?.set?.({ [key]: value });
                    break;
            }
        }
        catch (error) {
            console.log("error set", error);
        }
    }
    async get(key) {
        try {
            switch (this.type) {
                case "localStorage":
                    return localStorage.getItem(key);
                case "chromeStorage":
                    return (await _shared__WEBPACK_IMPORTED_MODULE_0__.chrome?.storage?.local?.get?.(key))?.[key];
            }
        }
        catch (error) {
            console.log("error get", error);
            return undefined;
        }
    }
    onChange(cb) {
        switch (this.type) {
            case "localStorage":
                document.addEventListener("itemInserted", (event) => {
                    const { key, oldValue, newValue } = event?.detail ?? {};
                    // eslint-disable-next-line node/no-callback-literal
                    cb?.({
                        [key]: {
                            oldValue,
                            newValue,
                        },
                    });
                }, false);
                break;
            case "chromeStorage":
                _shared__WEBPACK_IMPORTED_MODULE_0__.chrome?.storage?.onChanged?.addListener?.((changes, namespace) => {
                    // console.log("changes", changes, namespace)
                    if (namespace === "local") {
                        cb?.(changes);
                    }
                });
        }
    }
    async clear() {
        switch (this.type) {
            case "localStorage":
                localStorage.clear();
                break;
            case "chromeStorage":
                await _shared__WEBPACK_IMPORTED_MODULE_0__.chrome?.storage?.local?.clear?.();
                break;
        }
    }
}
const storageChrome = new Storage("chromeStorage");
const storageLocal = new Storage("localStorage");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/shared/index.ts");

const color = "#3aa757";
console.log("Background script running...", chrome);
chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);
});
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
if ((0,_shared__WEBPACK_IMPORTED_MODULE_0__.getManifestVersion)() === 2) {
    // chrome.webRequest.onBeforeRequest.addListener(
    //   (request) => {
    //     console.log(request)
    //   },
    //   { urls: ["https://*/*", "http://*/*"] },
    // )
}
else {
    // rules for V3 
}

})();

/******/ })()
;
//# sourceMappingURL=background.bundle.js.map