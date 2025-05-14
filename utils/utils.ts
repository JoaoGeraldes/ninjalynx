'use client';

import { NinjaLynxCrypto } from './NinjaLynxCrypto';

// ⚡DO NOT DELETE THE IMPORTS (activate them to run tests) BELOW BECAUSE THEY ARE NEEDED FOR TESTS ON JEST
// ⚡DO NOT DELETE THE IMPORTS (activate them to run tests) BELOW BECAUSE THEY ARE NEEDED FOR TESTS ON JEST
// ⚡DO NOT DELETE THE IMPORTS (activate them to run tests) BELOW BECAUSE THEY ARE NEEDED FOR TESTS ON JEST

// import crypto from 'crypto';
// import { TextEncoder, TextDecoder } from 'util';

// ‼️ COMMENT THE IMPORTS TO TEST THE APP IN THE BROWSER (npm run dev)
// ‼️ COMMENT THE IMPORTS TO TEST THE APP IN THE BROWSER (npm run dev)
// ‼️ COMMENT THE IMPORTS TO TEST THE APP IN THE BROWSER (npm run dev)

/* --------------------------------- */
/* --------------------------------- */
/* ------------- utils ------------- */
/* --------------------------------- */
/* --------------------------------- */

export function generatePassword() {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialCharacters = '!-_?';
  const passwordLength = 16;

  // Ensure at least one uppercase letter
  let password = uppercaseLetters.charAt(
    Math.floor(Math.random() * uppercaseLetters.length)
  );

  // Add random characters to meet the desired length
  for (let i = 1; i < passwordLength; i++) {
    const allCharacters =
      lowercaseLetters + uppercaseLetters + numbers + specialCharacters;
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters.charAt(randomIndex);
  }

  return password;
}

export async function copyToClipboard(newClip: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(newClip).then(
      () => {
        resolve(true);
      },
      () => {
        console.log('Failed to copy to clipboard!');
        reject(false);
      }
    );
  });
}

export function getCookie(name = 'authToken') {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) return parts?.pop()?.split(';').shift();
  return null;
}

export async function setAuthCookie(plainTextToken: string) {
  // Set cookie "authToken" with the provided token.
  // It uses Secure and SameSite=Strict for better security.

  const sha256Token = await NinjaLynxCrypto.SHA256(plainTextToken);

  document.cookie = `authToken=${encodeURIComponent(
    sha256Token
  )}; path=/; Secure; SameSite=Strict`;
}

export async function removeAuthCookie() {
  document.cookie =
    'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
