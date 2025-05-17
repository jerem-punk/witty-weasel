const devLink = document.getElementById('dev-link');
const buildButton = document.getElementById('build');
const bookmarkletLink = document.getElementById('bookmarklet-link');

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

const cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'default', // tu pourras en changer
  tabSize: 2,
  indentWithTabs: false
});

// Charger le code actuel
fetch('/code')
  .then(r => r.text())
  .then(code => {
    cm.setValue(code);
  });

const debouncedUpdate = debounce(() => {
  const code = cm.getValue();
  fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: code
  });
}, 1500);

cm.on('change', debouncedUpdate);

// Build le bookmarklet et met à jour le lien final
buildButton.addEventListener('click', () => {
  fetch('/build', { method: 'POST' })
    .then(r => r.text())
    .then(bookmarklet => {
      bookmarkletLink.href = bookmarklet;
    });
});
