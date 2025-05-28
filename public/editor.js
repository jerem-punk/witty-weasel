const devLink = document.getElementById('dev-link');
const buildButton = document.getElementById('build');
const bookmarkletLink = document.getElementById('bookmarklet-link');

let weasel = {
  source: '',
  built: '',
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function displayBuildError(message) {
  const errorDiv = document.getElementById('error');
  if (!message) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    bookmarkletLink.style.display = '';
  } else {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    bookmarkletLink.style.display = 'none';
  }
}

function displayBookmarkletSize(size) {
  document.querySelector('#bookmarklet-size').textContent = size;
}

const cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'default',
  tabSize: 2,
  indentWithTabs: false
});

// load current code
fetch('/code')
  .then(r => r.text())
  .then(code => {
    cm.setValue(code);
  });

const debouncedUpdate = debounce(() => {
  const code = cm.getValue();
  const indicator = document.getElementById('build-indicator');
  indicator.style.display = 'inline';

  fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: code
  })
  .then(async res => {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text);
    }
    weasel.built = text;
    const bookmarkletCode = 'javascript:' + encodeURIComponent(text);
    displayBookmarkletSize(Math.round(bookmarkletCode.length / 1024) + 'kb');
    bookmarkletLink.href = bookmarkletCode;
    displayBuildError(null);
  })
  .catch(err => {
    weasel.built = '';
    displayBuildError(err.message);
  })
  .finally(() => {
    indicator.style.display = 'none';
  });
}, 1000);

cm.on('change', debouncedUpdate);

document.getElementById('copy-button').addEventListener('click', () => {
  const builtLink = document.getElementById('built-link');
  const code = weasel.built;

  if (code) {
    navigator.clipboard.writeText(code)
      .then(() => {
        document.getElementById('copy-status').textContent = 'Copied!';
        setTimeout(() => {
          document.getElementById('copy-status').textContent = '';
        }, 1500);
      })
      .catch(err => {
        console.error('Clipboard copy failed:', err);
        document.getElementById('copy-status').textContent = '❌ Failed';
      });
  }
});