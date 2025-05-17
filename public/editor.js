const devLink = document.getElementById('dev-link');
const buildButton = document.getElementById('build');
const bookmarkletLink = document.getElementById('bookmarklet-link');

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

// Envoyer le code à chaque changement
cm.on('change', () => {
  const code = cm.getValue();
  fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: code
  });
});

// Build le bookmarklet et met à jour le lien final
buildButton.addEventListener('click', () => {
  fetch('/build', { method: 'POST' })
    .then(r => r.text())
    .then(bookmarklet => {
      bookmarkletLink.href = bookmarklet;
    });
});
