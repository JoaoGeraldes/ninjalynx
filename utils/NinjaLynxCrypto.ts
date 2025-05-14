// ⚡DO NOT DELETE THE IMPORTS (activate them to run tests) BELOW BECAUSE THEY ARE NEEDED FOR TESTS ON JEST
// ⚡DO NOT DELETE THE IMPORTS (activate them to run tests) BELOW BECAUSE THEY ARE NEEDED FOR TESTS ON JEST

// import crypto from 'crypto';
// import { TextEncoder, TextDecoder } from 'util';

// ‼️ COMMENT THE IMPORTS TO TEST THE APP IN THE BROWSER (npm run dev)
// ‼️ COMMENT THE IMPORTS TO TEST THE APP IN THE BROWSER (npm run dev)

export class NinjaLynxCrypto {
  /**
     *
     *  Decrypts an encrypted message, given the master key and the cipher text.
     * 
     * @returns A plain text, decrypted version.
     * 
     * @example
     * 
     * const decrypted = await decrypt(
          "my-secret-password",
          "someCipherText(encrypted)Here"
        );
     * 
     * 
     */
  static async decrypt(
    plainTextMasterKey: string,
    concatenatedIvAsHexPlusCipherTextAsHex: string
  ) {
    try {
      const key = await this.getMasterKeyFromPlainText(plainTextMasterKey);

      const cipherTextArrayBuffer: Uint8Array = this.binaryFromHexadecimal(
        this.splitAtPlus(concatenatedIvAsHexPlusCipherTextAsHex).cipherText
      );

      const iv: Uint8Array = this.binaryFromHexadecimal(
        this.splitAtPlus(concatenatedIvAsHexPlusCipherTextAsHex).iv
      );

      let decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        }, // Algorithm
        key, // Crypto key
        cipherTextArrayBuffer // Cipher text
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      throw new Error(
        'Failed to Decrypt, with the following error: ' + JSON.stringify(e)
      );
    }
  }

  /**
   *
   * @param plainTextMasterKey Master key - as plain text
   * @param plainText The message to be encrypted - as plain text
   * @example
   * ## How to use it:
   * ```js
   * encrypt("my-secret-master-key-password", "Message to be encrypted here!")
   * ```
   */
  static async encrypt(
    plainTextMasterKey: string,
    plainTextToBeEncrypted: string
  ) {
    try {
      let binaryPlainText = new TextEncoder().encode(plainTextToBeEncrypted);

      const key = await this.getMasterKeyFromPlainText(plainTextMasterKey);

      // The iv must never be reused with a given key to prevent replay attacks.
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const binaryCipherText = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        binaryPlainText
      );

      // const cipherTextAsHex = this.arrayBufferToHexadecimal(binaryCipherText);
      const cipherTextAsHex = this.binaryToHexadecimal(
        new Uint8Array(binaryCipherText)
      );
      const ivAsHex = this.binaryToHexadecimal(iv);

      const concatenatedIvAsHexPlusCipherTextAsHex = `${ivAsHex}+${cipherTextAsHex}`;

      const splittedConcatenated = this.splitAtPlus(
        concatenatedIvAsHexPlusCipherTextAsHex
      );

      const cipherTextAsHexBackToArrayBuffer = this.binaryFromHexadecimal(
        splittedConcatenated.cipherText
      );

      const ivBackToUint8Array = this.binaryFromHexadecimal(
        splittedConcatenated.iv
      );

      return {
        iv,
        binaryCipherText,
        cipherTextAsHex,
        cipherTextAsHexBackToArrayBuffer,
        ivAsHex,
        ivBackToUint8Array,
        concatenatedIvAsHexPlusCipherTextAsHex,
        splittedConcatenated,
      };
    } catch (e) {
      throw new Error(
        'Failed to encrypt with the following error: ' + JSON.stringify(e)
      );
    }
  }

  /**
   *
   * Digest a string to a SHA256 hash.
   *
   * # Example
   * ```js
   * SHA256("Hash me please!")
   * ```
   */
  static async SHA256(plainText: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Digest - Convert hash from ArrayBuffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private static async getMasterKeyFromPlainText(plainTextMasterKey: string) {
    const binaryPlainTextMasterKey = new TextEncoder().encode(
      plainTextMasterKey
    );

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      binaryPlainTextMasterKey,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: binaryPlainTextMasterKey,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    return key;
  }

  /**
   * Splits concatenated hexadecimal IV and Ciphertext
   */
  private static splitAtPlus(str: string) {
    const parts = str.split(/\+(.+)/); // Split at first "+"
    if (parts.length < 3) {
      throw new Error("String must contain a '+' character.");
    }
    return {
      iv: parts[0],
      cipherText: parts[1],
    };
  }

  /**
   * Convert  binary - Uint8Array into hexadecimal
   */
  private static binaryToHexadecimal(uint8Array: Uint8Array) {
    return Array.from(uint8Array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hexadecimal into binary - Uint8Array
   */
  private static binaryFromHexadecimal(hex: string) {
    if (typeof hex !== 'string') {
      throw new TypeError('Hex input must be a string.');
    }

    if (hex.length % 2 !== 0) {
      throw new Error('Invalid hex string: Length must be even.');
    }

    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      throw new Error('Invalid hex string: Contains non-hex characters.');
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }

    return bytes;
  }
}
