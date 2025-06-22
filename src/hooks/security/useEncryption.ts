
import { useCallback } from 'react';

export const useEncryption = () => {
  const getEncryptionKey = useCallback(async () => {
    try {
      const sessionId = sessionStorage.getItem('security_session_id') || 'default';
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(sessionId.padEnd(32, '0').slice(0, 32)),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      return await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('security-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Failed to generate encryption key:', error);
      return null;
    }
  }, []);

  const encryptData = useCallback(async (data: string): Promise<string> => {
    try {
      const key = await getEncryptionKey();
      if (!key) return data;

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.warn('Encryption failed:', error);
      return data;
    }
  }, [getEncryptionKey]);

  const decryptData = useCallback(async (encryptedData: string): Promise<string> => {
    try {
      const key = await getEncryptionKey();
      if (!key) return encryptedData;

      // Safe base64 decoding
      const binaryString = atob(encryptedData);
      const combined = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        combined[i] = binaryString.charCodeAt(i);
      }

      if (combined.length < 12) {
        return encryptedData;
      }

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encryptedData;
    }
  }, [getEncryptionKey]);

  const encryptStorageItem = useCallback(async (key: string, value: any) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const encrypted = await encryptData(stringValue);
    localStorage.setItem(`encrypted_${key}`, encrypted);
  }, [encryptData]);

  const decryptStorageItem = useCallback(async (key: string) => {
    const encrypted = localStorage.getItem(`encrypted_${key}`);
    if (!encrypted) return null;
    
    const decrypted = await decryptData(encrypted);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }, [decryptData]);

  return {
    encryptData,
    decryptData,
    encryptStorageItem,
    decryptStorageItem
  };
};
