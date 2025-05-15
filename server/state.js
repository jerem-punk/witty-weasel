export let currentCode = `alert('// Hello from Witty Weasel!');`;
export let bookmarkletCode = '';

export function updateCode(newCode) {
  currentCode = newCode;
}

export function updateBookmarklet(code) {
  bookmarkletCode = code;
}
