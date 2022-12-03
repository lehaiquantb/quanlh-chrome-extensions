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
]

export const disableHostClipboardFeature: RegExp[] = [/w3schools.com/]
