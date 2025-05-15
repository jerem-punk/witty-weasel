const textarea = document.getElementById('code');
const devLink = document.getElementById('dev-link');
const buildButton = document.getElementById('build');
const bookmarkletLink = document.getElementById('bookmarklet-link');

// Charger le code actuel
fetch('/code')
  .then(r => r.text())
  .then(code => {
    textarea.value = code;
    updateDevLink(code);
  });

// Envoyer le code à chaque changement
textarea.addEventListener('input', () => {
  const code = textarea.value;
  fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: code
  });
  updateDevLink(code);
});

// Met à jour le lien de dev bookmarklet
function updateDevLink(code) {
  const encoded = encodeURIComponent(code);
  devLink.href = `javascript:(()=>{${code}})()`;
}

// Build le bookmarklet et met à jour le lien final
buildButton.addEventListener('click', () => {
  fetch('/build', { method: 'POST' })
    .then(r => r.text())
    .then(bookmarklet => {
      bookmarkletLink.href = bookmarklet;
    });
});
