/**
 * AES-256-GCM encryption/decryption for user API keys.
 * Uses a master key from the API_KEY_ENCRYPTION_KEY secret.
 */

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;

function getEncryptionKeyHex(): string {
  const key = Deno.env.get("API_KEY_ENCRYPTION_KEY");
  if (!key) {
    throw new Error("API_KEY_ENCRYPTION_KEY is not configured");
  }
  return key;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function importKey(hexKey: string): Promise<CryptoKey> {
  const rawKey = hexToBytes(hexKey);
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypt a plaintext string. Returns base64-encoded IV + ciphertext.
 */
export async function encryptApiKey(plaintext: string): Promise<string> {
  const keyHex = getEncryptionKeyHex();
  const key = await importKey(keyHex);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded,
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Base64 encode
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64-encoded IV + ciphertext string back to plaintext.
 * If decryption fails (e.g. plaintext key from before encryption was enabled),
 * returns the original string as-is for backward compatibility.
 */
export async function decryptApiKey(encryptedData: string): Promise<string> {
  try {
    // Quick check: if it looks like a raw API key (starts with sk-, xi-, etc.), return as-is
    if (
      encryptedData.startsWith("sk-") ||
      encryptedData.startsWith("xi-") ||
      encryptedData.startsWith("ant-")
    ) {
      return encryptedData;
    }

    const keyHex = getEncryptionKeyHex();
    const key = await importKey(keyHex);

    // Base64 decode
    const binaryString = atob(encryptedData);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    if (combined.length < IV_LENGTH) {
      return encryptedData;
    }

    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext,
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // If decryption fails, assume it's a legacy plaintext key
    return encryptedData;
  }
}
