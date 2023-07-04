/* eslint-disable no-eval */
export const createElementByText = (textHTML = "") => {
  const template = document.createElement("template");
  textHTML = textHTML.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = textHTML;
  return template.content.firstElementChild as HTMLElement;
};

export function copyToClipboard(text: string): boolean {
  try {
    const elem = document.createElement("textarea");
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    return true;
  } catch (error) {
    return false;
  }
}

export const isEmptyString = (str: string) => {
  return str === "" || str === null || str === undefined;
};

export function globalVarIsExist(varName: string) {
  try {
    return (
      !!(window as any)?.[varName] ?? eval(`typeof ${varName}`) !== "undefined"
    );
  } catch (error) {
    // console.log('varIsExist', error);
    return false;
  }
}

export function getGlobalVar<T = any>(varName: string): T | undefined {
  try {
    return globalVarIsExist(varName)
      ? (window as any)?.[varName] ?? eval(varName)
      : undefined;
  } catch (error) {
    return undefined;
  }
}

type Recursive<T> = {
  [key in keyof T]: T[key] extends Function ? T[key] : Recursive<T[key]>;
};

type Chrome = Recursive<typeof chrome>;

export function getChrome() {
  return getGlobalVar<Chrome>("chrome");
}

export async function getCurrentTab() {
  return (
    await getChrome()?.tabs?.query?.({
      active: true,
      currentWindow: true,
    })
  )?.[0];
}

export function tryEval(str: string, context?: Record<string, any>): any {
  try {
    const contextString = `
            const { ${Object.keys(context ?? {}).join(",")} } = context ?? {};
        `;
    return eval(contextString + str);
  } catch (error) {
    console.error("tryEval =>", error);
    return undefined;
  }
}
