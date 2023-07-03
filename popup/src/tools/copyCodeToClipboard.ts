import { copyToClipboard, createElementByText } from "../utils/helper";

export const enableHostClipboardFeature: RegExp[] = [
  /^[\S]+$/gm,
  // /stackoverflow.com/,
  // /stackexchange.com/,
  // /superuser.com/,
  // /serverfault.com/,
  // /askubuntu.com/,
  // /mathoverflow.net/,
  // /math.stackexchange.com/,
  // /codereview.stackexchange.com/,
  // /programmers.stackexchange.com/,
  // /stackapps.com/,
  // /viblo.asia/,
  // /www.npmjs.com/,
];

export const disableHostClipboardFeature: RegExp[] = [/w3schools.com/];

export function handleCopyCodeToClipboard() {
  const buttonCopy = `
      <div class="quanlh-copy-button quanlh-super-center quanlh-d-none">
          <span class="quanlh-copy-success quanlh-d-none">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success">
                  <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
              </svg>
          </span>
          <span class="quanlh-copy-cp" aria-label="Copy">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
                  <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
              </svg>
          </span>
      </div>
  `;

  const snippets = document.querySelectorAll("pre");
  const listElement: { copyButton: HTMLElement; preElement: HTMLElement }[] =
    [];

  snippets.forEach((snippet) => {
    const parent = snippet.parentNode;
    const wrapper = document.createElement("div");

    parent?.replaceChild(wrapper, snippet);
    wrapper.appendChild(snippet);

    const buttonCopyElement = createElementByText(buttonCopy);
    listElement.push({
      copyButton: buttonCopyElement,
      preElement: snippet,
    });
    wrapper?.firstChild?.appendChild(buttonCopyElement);
  });

  listElement.forEach(({ copyButton, preElement }) => {
    const iconSuccess: HTMLElement | null = copyButton.querySelector(
      ".quanlh-copy-success"
    );
    const iconCopy: HTMLElement | null =
      copyButton.querySelector(".quanlh-copy-cp");
    copyButton.addEventListener("click", (event) => {
      const stringInCode = preElement.querySelector("code")?.textContent ?? "";
      const text = stringInCode === "" ? preElement.outerText : stringInCode;
      const success = copyToClipboard(text);
      if (success) {
        iconSuccess?.classList.remove("quanlh-d-none");
        iconCopy?.classList.add("quanlh-d-none");
        setTimeout(() => {
          iconSuccess?.classList.add("quanlh-d-none");
          iconCopy?.classList.remove("quanlh-d-none");
        }, 1000);
      }
    });

    preElement.addEventListener("mouseenter", (event) => {
      copyButton.classList.remove("quanlh-d-none");
    });

    preElement.addEventListener("mouseleave", (event) => {
      copyButton.classList.add("quanlh-d-none");
    });
  });
}

const host = window.location.host;

function checkHost(host: string): boolean {
  for (const enableHost of enableHostClipboardFeature) {
    if (!enableHost.test(host)) {
      return false;
    }
  }

  for (const disableHost of disableHostClipboardFeature) {
    if (disableHost.test(host)) {
      return false;
    }
  }

  return true;
}

if (checkHost(host)) {
  //   handleCopyCodeToClipboard();
}
