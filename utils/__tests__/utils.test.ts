import { NinjaLynxCrypto } from '../NinjaLynxCrypto';

// How many times should the encrypt/decrypt occur
const ITERATIONS = 500;

const TIMEOUT = 120000;

function generateRandomString() {
  const length = Math.floor(Math.random() * 1024) + 1; // Random length between 1 and 32
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>? ';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result.trim(); // Trim to avoid leading/trailing spaces
}

// This function seeks to test the viability of the encrypt and decrypt functions and their dependencies (functions used within them)
async function plainTextMatchesDecryptedText() {
  const plainTextMasterKey = generateRandomString();
  const plainTextToBeEncrypted = generateRandomString();

  const encryptedMessage = await NinjaLynxCrypto.encrypt(
    plainTextMasterKey,
    plainTextToBeEncrypted
  );

  if (!encryptedMessage) return false;

  const decryptedMessage = await NinjaLynxCrypto.decrypt(
    plainTextMasterKey,
    encryptedMessage.concatenatedIvAsHexPlusCipherTextAsHex
  );

  return plainTextToBeEncrypted === decryptedMessage;
}

describe('Test utils suite', () => {
  test(
    'Encryption and Decryption functions are working correctly.',
    async () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const result = await plainTextMatchesDecryptedText();
        expect(result).toBe(true);
      }
    },
    TIMEOUT
  );

  test('SHA256 digest is hashing and encoding (hexadecimal) correctly.', async () => {
    const cascavel = await NinjaLynxCrypto.SHA256('cascavel');
    const cascaGrossa = await NinjaLynxCrypto.SHA256('casca-grossa');
    const zezinho = await NinjaLynxCrypto.SHA256('zézinho123');
    const azeite123 = await NinjaLynxCrypto.SHA256('azeite azeite 123');
    const space = await NinjaLynxCrypto.SHA256(' ');
    const nothing = await NinjaLynxCrypto.SHA256('');
    const characters = await NinjaLynxCrypto.SHA256(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>? '
    );

    expect(cascavel).toBe(
      '0cca13c42bdf28b5085bfc82720fb8eca59288952ffadca9783b564b02cd3780'
    );

    expect(cascaGrossa).toBe(
      '1007967983a7e9590e9e7cbf83d0b9f387e6111dc47a44304182efcca374bb22'
    );

    expect(zezinho).toBe(
      '44d166e2ab46cab2b083bcceaca05b252603180c560d293c7177c6df51502ce9'
    );

    expect(azeite123).toBe(
      '3f9bbf94b8c55fc4e9526733c105fb333be631dc947104fdb31063b566d0e4c3'
    );

    expect(space).toBe(
      '36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068'
    );

    expect(nothing).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );

    expect(characters).toBe(
      '62c3b3c147055b59191eb0251c8d08012833e7aa44fc4447bd1489eae5ae1f9f'
    );
  });
});
