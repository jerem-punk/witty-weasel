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
    .then(async res => {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text);
      }
      bookmarkletLink.href = text;
      displayBuildError(null);
    })
    .catch(err => {
      displayBuildError(err.message); // À toi de définir cette fonction
    });
});
