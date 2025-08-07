# 🔐 EncryptoLab

**Advanced Text Encryption & Decryption Tool**

A modern, interactive web application that implements multiple cryptographic algorithms for educational and practical use. EncryptoLab provides an intuitive interface for encrypting and decrypting text using both classical and modern ciphers.

![EncryptoLab Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

- **🎯 Multiple Algorithms**: Support for 9 different encryption algorithms
- **🔄 Real-time Processing**: Instant encryption and decryption
- **📚 Educational**: Step-by-step explanations for each algorithm
- **🌙 Dark/Light Mode**: Toggle between themes for comfortable viewing
- **📋 Easy Copy**: One-click copy to clipboard
- **💾 Download**: Export results as text files
- **🎪 Examples**: Try pre-configured examples for each algorithm
- **📱 Responsive**: Works on desktop, tablet, and mobile devices

## 🔧 Supported Algorithms

### Classical Ciphers
- **Caesar Cipher** - Simple shift cipher
- **Vigenère Cipher** - Polyalphabetic substitution
- **Vernam Cipher** - One-time pad encryption
- **Hill Cipher** - Matrix-based encryption
- **Monoalphabetic Cipher** - Single alphabet substitution
- **Polyalphabetic Cipher** - Multiple alphabet substitution
- **Playfair Cipher** - Digraph substitution cipher

### Modern Ciphers
- **AES (Advanced Encryption Standard)** - Industry-standard symmetric encryption
- **DES (Data Encryption Standard)** - Legacy symmetric encryption

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installation required

### Quick Start
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd encryptolab
   ```

2. Open `index.html` in your web browser:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js serve
   npx serve .
   
   # Or simply open the file
   open index.html
   ```

3. Start encrypting and decrypting text!

## 💡 Usage

### Basic Operation
1. **Select an Algorithm**: Choose from the dropdown menu
2. **Enter Text**: Type or paste your text in the input area
3. **Provide Key**: Enter the required key (if applicable)
4. **Encrypt/Decrypt**: Click the respective button
5. **View Results**: See the output and optional step-by-step explanation

### Algorithm-Specific Keys

| Algorithm | Key Format | Example |
|-----------|------------|---------|
| Caesar | Number (shift) | `3` |
| Vigenère | Text string | `SECRET` |
| Vernam | Same length as input | `RANDOMKEY` |
| Hill | Matrix values | `3,3,2,5` (2x2 matrix) |
| Monoalphabetic | 26-char substitution | `ZYXWVUTSRQPONMLKJIHGFEDCBA` |
| Polyalphabetic | Keyword | `KEYWORD` |
| Playfair | Keyword | `MONARCHY` |
| AES/DES | Password | `mypassword123` |

### Features Guide

#### 🎪 Try Examples
Click the magic wand button (✨) to load pre-configured examples for each algorithm.

#### 📖 Learn How It Works
Click "Show Steps/How it Works" to see detailed explanations of the encryption process.

#### 🌙 Theme Toggle
Click the moon/sun icon in the header to switch between light and dark modes.

#### 📋 Copy & Download
- Use the copy button to copy results to clipboard
- Use the download button to save results as a `.txt` file

## 🏗️ Project Structure

```
encryptolab/
├── index.html              # Main HTML file
├── style.css               # CSS styles and themes
├── script.js               # Core JavaScript functionality
├── assets/
│   └── crypto-explanations.js  # Algorithm explanations
└── README.md               # This file
```

## 🔍 Technical Details

### Dependencies
- **CryptoJS**: For AES and DES implementations
- **Font Awesome**: For icons
- **Google Fonts**: Poppins and Fira Code fonts

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Key Features Implementation
- **Responsive Design**: CSS Grid and Flexbox
- **Theme System**: CSS custom properties with localStorage persistence
- **Modular JavaScript**: Separate functions for each algorithm
- **Educational Components**: Interactive step-by-step explanations

## 🎓 Educational Use

EncryptoLab is perfect for:
- **Computer Science Students** learning cryptography
- **Educators** teaching encryption concepts
- **Security Professionals** demonstrating cipher differences
- **Anyone** curious about how encryption works

Each algorithm includes:
- Real-time step-by-step calculations
- Clear explanations of the process
- Visual representation of transformations
- Example inputs and keys

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Add New Algorithms**: Implement additional ciphers
2. **Improve UI/UX**: Enhance the user interface
3. **Add Features**: File upload, batch processing, etc.
4. **Fix Bugs**: Report and fix any issues
5. **Documentation**: Improve explanations and docs

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

