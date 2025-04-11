export async function hashPassword(password: string): Promise<string> {
  // Convert the password string to a Uint8Array
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Use PBKDF2 which is available in Web Crypto API
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive a key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // Export the key
  const keyBuffer = await crypto.subtle.exportKey("raw", key);

  // Combine the salt and derived key for storage
  const result = new Uint8Array(salt.length + keyBuffer.byteLength);
  result.set(salt, 0);
  result.set(new Uint8Array(keyBuffer), salt.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...result));
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Convert from base64 to Uint8Array
    const buffer = Uint8Array.from(atob(hashedPassword), (c) => c.charCodeAt(0));

    // Extract the salt (first 16 bytes)
    const salt = buffer.slice(0, 16);
    const storedDerivedKey = buffer.slice(16);

    // Perform the same derivation with the provided password
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordData,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const keyBuffer = await crypto.subtle.exportKey("raw", key);
    const newDerivedKey = new Uint8Array(keyBuffer);

    // Compare the derived keys
    if (storedDerivedKey.length !== newDerivedKey.length) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    let result = 0;
    const length = Math.min(storedDerivedKey.length, newDerivedKey.length);
    for (let i = 0; i < length; i++) {
      const storedByte = storedDerivedKey[i];
      const newByte = newDerivedKey[i];
      if (typeof storedByte === "number" && typeof newByte === "number") {
        result |= storedByte ^ newByte;
      } else {
        return false; // If any byte is undefined, passwords don't match
      }
    }

    return result === 0;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
