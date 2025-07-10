window.cryptoExplanations = {
  caesar: {
    explain: (input, key) => {
      let shift = parseInt(key)||0;
      let steps = input.split('').map((c,i) => {
        if (!/[a-z]/i.test(c)) return `${c} (unchanged)`;
        let base = c === c.toLowerCase() ? 97 : 65;
        let orig = c.charCodeAt(0) - base;
        let enc = (orig + shift + 26) % 26;
        let res = String.fromCharCode(enc+base);
        return `${c} → (${orig}+${shift})%26=${enc} → ${res}`;
      });
      return `<b>Caesar Cipher Steps:</b><br>${steps.join('<br>')}`;
    },
    example: {input:'HELLO', key:'3'}
  },
  vigenere: {
    explain: (input, key) => {
      key = key.replace(/[^a-z]/gi, '').toUpperCase();
      let expanded = '';
      let j = 0;
      for (let i = 0; i < input.length; i++) {
        if (/[a-z]/i.test(input[i])) expanded += key[j++%key.length];
        else expanded += ' ';
      }
      let steps = input.split('').map((c,i) => {
        if (!/[a-z]/i.test(c)) return `${c} (unchanged)`;
        let base = c === c.toLowerCase() ? 97 : 65;
        let orig = c.charCodeAt(0) - base;
        let k = expanded[i].charCodeAt(0) - 65;
        let enc = (orig + k) % 26;
        let res = String.fromCharCode(enc+base);
        return `${c} + ${expanded[i]} → (${orig}+${k})%26=${enc} → ${res}`;
      });
      return `<b>Vigenère Steps:</b><br>Expanded Key: <code>${expanded}</code><br>${steps.join('<br>')}`;
    },
    example: {input:'ATTACKATDAWN', key:'LEMON'}
  },
  vernam: {
    explain: (input, key) => {
      key = key.toUpperCase();
      let steps = input.split('').map((c,i) => {
        if (!/[a-z]/i.test(c)) return `${c} (unchanged)`;
        let base = c === c.toLowerCase() ? 97 : 65;
        let orig = c.charCodeAt(0) - base;
        let k = key[i%key.length].charCodeAt(0) - 65;
        let enc = orig ^ k;
        let res = String.fromCharCode(enc+base);
        return `${c} ^ ${key[i%key.length]} → ${orig}^${k}=${enc} → ${res}`;
      });
      return `<b>Vernam Steps:</b><br>${steps.join('<br>')}`;
    },
    example: {input:'HELLO', key:'XMCKL'}
  },
  hill: {
    explain: (input, key, matrix) => {
      let arr = matrix ? matrix.split(',').map(Number) : [];
      if (arr.length !== 4) return 'Invalid matrix';
      let m = [[arr[0],arr[1]],[arr[2],arr[3]]];
      let txt = input.replace(/[^A-Z]/gi, '').toUpperCase();
      if (txt.length % 2) txt += 'X';
      let steps = [];
      for (let i = 0; i < txt.length; i += 2) {
        let a = txt.charCodeAt(i)-65, b = txt.charCodeAt(i+1)-65;
        let x = (m[0][0]*a + m[0][1]*b)%26;
        let y = (m[1][0]*a + m[1][1]*b)%26;
        steps.push(`${txt[i]}${txt[i+1]}: [${a},${b}] * [[${m[0][0]},${m[0][1]}],[${m[1][0]},${m[1][1]}]] = [${x},${y}] → ${String.fromCharCode(x+65)}${String.fromCharCode(y+65)}`);
      }
      return `<b>Hill Cipher Steps:</b><br>${steps.join('<br>')}`;
    },
    example: {input:'HELP', matrix:'3,3,2,5'}
  },
  monoalphabetic: {
    explain: (input, key) => {
      key = key.toUpperCase();
      let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let map = {};
      for (let i = 0; i < 26; i++) map[alpha[i]] = key[i] || alpha[i];
      let steps = input.split('').map(c => {
        if (!/[a-z]/i.test(c)) return `${c} (unchanged)`;
        let up = c.toUpperCase();
        let enc = map[up] || up;
        return `${c} → ${enc}`;
      });
      return `<b>Monoalphabetic Steps:</b><br>Key: <code>${key}</code><br>${steps.join('<br>')}`;
    },
    example: {input:'HELLO', key:'QWERTYUIOPASDFGHJKLZXCVBNM'}
  },
  polyalphabetic: {
    explain: (input, key) => window.cryptoExplanations.vigenere.explain(input, key),
    example: {input:'CRYPTO', key:'KEY'}
  },
  playfair: {
    explain: (input, key) => {
      key = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
      let matrix = [];
      let seen = new Set(), res = '';
      for (let c of key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
        if (!seen.has(c)) { res += c; seen.add(c); }
      }
      for (let i = 0; i < 5; i++) matrix.push(res.slice(i*5, i*5+5).split(''));
      let txt = input.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
      let pairs = [], i = 0;
      while (i < txt.length) {
        let a = txt[i], b = txt[i+1];
        if (!b || a === b) { b = 'X'; i++; }
        else i += 2;
        pairs.push([a, b]);
      }
      let steps = pairs.map(([a, b]) => {
        let r1, c1, r2, c2;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
          if (matrix[i][j] === a) { r1 = i; c1 = j; }
          if (matrix[i][j] === b) { r2 = i; c2 = j; }
        }
        let out;
        if (r1 === r2) out = `${a}${b}: Same row → ${matrix[r1][(c1+1)%5]}${matrix[r2][(c2+1)%5]}`;
        else if (c1 === c2) out = `${a}${b}: Same col → ${matrix[(r1+1)%5][c1]}${matrix[(r2+1)%5][c2]}`;
        else out = `${a}${b}: Rectangle → ${matrix[r1][c2]}${matrix[r2][c1]}`;
        return out;
      });
      let mtx = matrix.map(row => row.join(' ')).join('<br>');
      return `<b>Playfair Steps:</b><br>Matrix:<br><code>${mtx}</code><br>${steps.join('<br>')}`;
    },
    example: {input:'HIDETHEGOLD', key:'MONARCHY'}
  },
  aes: {
    explain: (input, key) => `<b>AES Steps:</b><br>1. Use CryptoJS.AES.encrypt()<br>2. Key: <code>${key}</code><br>3. Output is Base64-encoded ciphertext.<br>`,
    example: {input:'Encrypt this!', key:'password123'}
  },
  des: {
    explain: (input, key) => `<b>DES Steps:</b><br>1. Use CryptoJS.DES.encrypt()<br>2. Key: <code>${key}</code><br>3. Output is Base64-encoded ciphertext.<br>`,
    example: {input:'Secret', key:'mykey'}
  }
}; 