// --- Import explanations ---
// Explanations are loaded via <script> tag and available as window.cryptoExplanations

// --- Utility Functions ---
function showKeyOrMatrix(algo, prefix) {
  const keyInput = document.getElementById(prefix + '-key');
  const matrixInput = document.getElementById(prefix + '-matrix');
  const keyCiphers = ['caesar','vigenere','vernam','aes','des','monoalphabetic','polyalphabetic','playfair'];
  keyInput.style.display = keyCiphers.includes(algo) ? '' : 'none';
  matrixInput.style.display = algo === 'hill' ? '' : 'none';
  // Set placeholder to show sample key
  if (keyCiphers.includes(algo)) {
    const example = window.cryptoExplanations?.[algo]?.example;
    keyInput.placeholder = example && example.key ? `Key (e.g. ${example.key})` : 'Key (required)';
  } else {
    keyInput.placeholder = 'Key (if required)';
  }
}

function copyToClipboard(id) {
  const el = document.getElementById(id);
  el.select();
  document.execCommand('copy');
}

function downloadAsTxt(id, filename) {
  const text = document.getElementById(id).value;
  const blob = new Blob([text], {type: 'text/plain'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('encryptolab-theme', dark ? 'dark' : 'light');
  document.getElementById('theme-toggle').innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function getTheme() {
  return localStorage.getItem('encryptolab-theme') === 'dark';
}

// --- Cipher Functions ---
function encryptCaesar(text, shift) {
  shift = parseInt(shift) || 0;
  return text.replace(/[a-z]/gi, c => {
    const base = c >= 'a' && c <= 'z' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}
function decryptCaesar(text, shift) {
  return encryptCaesar(text, -parseInt(shift) || 0);
}
function encryptVigenere(text, key) {
  key = key.replace(/[^a-z]/gi, '').toUpperCase();
  let res = '', j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-z]/i.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      res += String.fromCharCode(((c.charCodeAt(0) - base + (key[j%key.length].charCodeAt(0) - 65)) % 26) + base);
      j++;
    } else res += c;
  }
  return res;
}
function decryptVigenere(text, key) {
  key = key.replace(/[^a-z]/gi, '').toUpperCase();
  let res = '', j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-z]/i.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      res += String.fromCharCode(((c.charCodeAt(0) - base - (key[j%key.length].charCodeAt(0) - 65) + 26) % 26) + base);
      j++;
    } else res += c;
  }
  return res;
}
function encryptMonoalphabetic(text, key) {
  key = key.toUpperCase();
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let map = {};
  for (let i = 0; i < 26; i++) map[alpha[i]] = key[i] || alpha[i];
  return text.replace(/[a-z]/gi, c => {
    const up = c.toUpperCase();
    const enc = map[up] || up;
    return c === up ? enc : enc.toLowerCase();
  });
}
function decryptMonoalphabetic(text, key) {
  key = key.toUpperCase();
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let map = {};
  for (let i = 0; i < 26; i++) map[key[i] || alpha[i]] = alpha[i];
  return text.replace(/[a-z]/gi, c => {
    const up = c.toUpperCase();
    const dec = map[up] || up;
    return c === up ? dec : dec.toLowerCase();
  });
}
function encryptPolyalphabetic(text, key) {
  return encryptVigenere(text, key);
}
function decryptPolyalphabetic(text, key) {
  return decryptVigenere(text, key);
}
function encryptVernam(text, key) {
  key = key.toUpperCase();
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-z]/i.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      res += String.fromCharCode(((c.charCodeAt(0) - base) ^ (key[i%key.length].charCodeAt(0) - 65)) + base);
    } else res += c;
  }
  return res;
}
function decryptVernam(text, key) {
  return encryptVernam(text, key);
}
function encryptAES(text, key) {
  return CryptoJS.AES.encrypt(text, key).toString();
}
function decryptAES(cipher, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    return bytes.toString(CryptoJS.enc.Utf8) || 'Invalid Key or Cipher';
  } catch { return 'Invalid Key or Cipher'; }
}
function encryptDES(text, key) {
  return CryptoJS.DES.encrypt(text, key).toString();
}
function decryptDES(cipher, key) {
  try {
    const bytes = CryptoJS.DES.decrypt(cipher, key);
    return bytes.toString(CryptoJS.enc.Utf8) || 'Invalid Key or Cipher';
  } catch { return 'Invalid Key or Cipher'; }
}
// Hill Cipher (2x2)
function parseMatrix(str) {
  const arr = str.split(',').map(Number);
  if (arr.length !== 4 || arr.some(isNaN)) return null;
  return [[arr[0], arr[1]], [arr[2], arr[3]]];
}
function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}
function encryptHill(text, matrixStr) {
  const matrix = parseMatrix(matrixStr);
  if (!matrix) return 'Invalid matrix';
  text = text.replace(/[^A-Z]/gi, '').toUpperCase();
  if (text.length % 2) text += 'X';
  let res = '';
  for (let i = 0; i < text.length; i += 2) {
    const a = text.charCodeAt(i) - 65;
    const b = text.charCodeAt(i+1) - 65;
    const x = (matrix[0][0]*a + matrix[0][1]*b) % 26;
    const y = (matrix[1][0]*a + matrix[1][1]*b) % 26;
    res += String.fromCharCode(x+65) + String.fromCharCode(y+65);
  }
  return res;
}
function decryptHill(text, matrixStr) {
  const matrix = parseMatrix(matrixStr);
  if (!matrix) return 'Invalid matrix';
  text = text.replace(/[^A-Z]/gi, '').toUpperCase();
  const det = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
  const invDet = modInverse(det, 26);
  if (invDet === null) return 'Matrix not invertible mod 26';
  // Inverse matrix mod 26
  const inv = [
    [(matrix[1][1]*invDet)%26, (-matrix[0][1]*invDet)%26],
    [(-matrix[1][0]*invDet)%26, (matrix[0][0]*invDet)%26]
  ];
  let res = '';
  for (let i = 0; i < text.length; i += 2) {
    const a = text.charCodeAt(i) - 65;
    const b = text.charCodeAt(i+1) - 65;
    let x = (inv[0][0]*a + inv[0][1]*b) % 26;
    let y = (inv[1][0]*a + inv[1][1]*b) % 26;
    if (x < 0) x += 26;
    if (y < 0) y += 26;
    res += String.fromCharCode(x+65) + String.fromCharCode(y+65);
  }
  return res;
}
// Playfair Cipher
function preparePlayfairKey(key) {
  key = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  let seen = new Set(), res = '';
  for (let c of key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
    if (!seen.has(c)) { res += c; seen.add(c); }
  }
  return res;
}
function playfairMatrix(key) {
  key = preparePlayfairKey(key);
  let matrix = [];
  for (let i = 0; i < 5; i++) matrix.push(key.slice(i*5, i*5+5).split(''));
  return matrix;
}
function playfairPos(matrix, c) {
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if (matrix[i][j] === c) return [i, j];
  return null;
}
function playfairPairs(text) {
  text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  let pairs = [], i = 0;
  while (i < text.length) {
    let a = text[i], b = text[i+1];
    if (!b || a === b) { b = 'X'; i++; }
    else i += 2;
    pairs.push([a, b]);
  }
  return pairs;
}
function encryptPlayfair(text, key) {
  let matrix = playfairMatrix(key);
  let pairs = playfairPairs(text);
  let res = '';
  for (let [a, b] of pairs) {
    let [r1, c1] = playfairPos(matrix, a), [r2, c2] = playfairPos(matrix, b);
    if (r1 === r2) {
      res += matrix[r1][(c1+1)%5] + matrix[r2][(c2+1)%5];
    } else if (c1 === c2) {
      res += matrix[(r1+1)%5][c1] + matrix[(r2+1)%5][c2];
    } else {
      res += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return res;
}
function decryptPlayfair(text, key) {
  let matrix = playfairMatrix(key);
  let pairs = playfairPairs(text);
  let res = '';
  for (let [a, b] of pairs) {
    let [r1, c1] = playfairPos(matrix, a), [r2, c2] = playfairPos(matrix, b);
    if (r1 === r2) {
      res += matrix[r1][(c1+4)%5] + matrix[r2][(c2+4)%5];
    } else if (c1 === c2) {
      res += matrix[(r1+4)%5][c1] + matrix[(r2+4)%5][c2];
    } else {
      res += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return res;
}

// --- UI Logic ---
function updateKeyMatrixInputs(prefix) {
  const algo = document.getElementById(prefix+'-algo').value;
  showKeyOrMatrix(algo, prefix);
}
function showExplanation(prefix, algo, input, key, matrix) {
  const box = document.getElementById(prefix+'-explanation');
  const explain = window.cryptoExplanations?.[algo]?.explain;
  if (explain) {
    box.innerHTML = explain(input, key, matrix);
    box.style.display = '';
  } else {
    box.innerHTML = 'No explanation available.';
    box.style.display = '';
  }
}
function hideExplanation(prefix) {
  document.getElementById(prefix+'-explanation').style.display = 'none';
}
function setExample(prefix) {
  const algo = document.getElementById(prefix+'-algo').value;
  const example = window.cryptoExplanations?.[algo]?.example;
  if (example) {
    document.getElementById(prefix+'-input').value = example.input;
    if (document.getElementById(prefix+'-key')) document.getElementById(prefix+'-key').value = example.key || '';
    if (document.getElementById(prefix+'-matrix')) document.getElementById(prefix+'-matrix').value = example.matrix || '';
  }
}
// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  setTheme(getTheme());
  document.getElementById('theme-toggle').onclick = () => setTheme(!getTheme());
  // Key/matrix input show/hide
  ['encrypt','decrypt'].forEach(prefix => {
    document.getElementById(prefix+'-algo').onchange = () => updateKeyMatrixInputs(prefix);
    updateKeyMatrixInputs(prefix);
  });
  // Encrypt
  document.getElementById('encrypt-btn').onclick = () => {
    const algo = document.getElementById('encrypt-algo').value;
    const input = document.getElementById('encrypt-input').value;
    const key = document.getElementById('encrypt-key').value;
    const matrix = document.getElementById('encrypt-matrix').value;
    let output = '';
    switch(algo) {
      case 'caesar': output = encryptCaesar(input, key); break;
      case 'vigenere': output = encryptVigenere(input, key); break;
      case 'vernam': output = encryptVernam(input, key); break;
      case 'hill': output = encryptHill(input, matrix); break;
      case 'monoalphabetic': output = encryptMonoalphabetic(input, key); break;
      case 'polyalphabetic': output = encryptPolyalphabetic(input, key); break;
      case 'playfair': output = encryptPlayfair(input, key); break;
      case 'aes': output = encryptAES(input, key); break;
      case 'des': output = encryptDES(input, key); break;
      default: output = 'Unsupported algorithm';
    }
    document.getElementById('encrypt-output').value = output;
    hideExplanation('encrypt');
  };
  // Decrypt
  document.getElementById('decrypt-btn').onclick = () => {
    const algo = document.getElementById('decrypt-algo').value;
    const input = document.getElementById('decrypt-input').value;
    const key = document.getElementById('decrypt-key').value;
    const matrix = document.getElementById('decrypt-matrix').value;
    let output = '';
    switch(algo) {
      case 'caesar': output = decryptCaesar(input, key); break;
      case 'vigenere': output = decryptVigenere(input, key); break;
      case 'vernam': output = decryptVernam(input, key); break;
      case 'hill': output = decryptHill(input, matrix); break;
      case 'monoalphabetic': output = decryptMonoalphabetic(input, key); break;
      case 'polyalphabetic': output = decryptPolyalphabetic(input, key); break;
      case 'playfair': output = decryptPlayfair(input, key); break;
      case 'aes': output = decryptAES(input, key); break;
      case 'des': output = decryptDES(input, key); break;
      default: output = 'Unsupported algorithm';
    }
    document.getElementById('decrypt-output').value = output;
    hideExplanation('decrypt');
  };
  // Copy
  document.getElementById('encrypt-copy').onclick = () => copyToClipboard('encrypt-output');
  document.getElementById('decrypt-copy').onclick = () => copyToClipboard('decrypt-output');
  // Download
  document.getElementById('encrypt-download').onclick = () => downloadAsTxt('encrypt-output', 'encrypted.txt');
  document.getElementById('decrypt-download').onclick = () => downloadAsTxt('decrypt-output', 'decrypted.txt');
  // Show Steps/How it Works
  document.getElementById('encrypt-explain-toggle').onclick = () => {
    const algo = document.getElementById('encrypt-algo').value;
    const input = document.getElementById('encrypt-input').value;
    const key = document.getElementById('encrypt-key').value;
    const matrix = document.getElementById('encrypt-matrix').value;
    showExplanation('encrypt', algo, input, key, matrix);
  };
  document.getElementById('decrypt-explain-toggle').onclick = () => {
    const algo = document.getElementById('decrypt-algo').value;
    const input = document.getElementById('decrypt-input').value;
    const key = document.getElementById('decrypt-key').value;
    const matrix = document.getElementById('decrypt-matrix').value;
    showExplanation('decrypt', algo, input, key, matrix);
  };
  // Try Example
  document.getElementById('encrypt-example').onclick = () => setExample('encrypt');
  document.getElementById('decrypt-example').onclick = () => setExample('decrypt');
}); 