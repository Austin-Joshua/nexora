package com.nexora.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256 encryption/decryption for sensitive fields like Gmail tokens.
 * Uses a dynamic IV prepended to the ciphertext.
 */
@Component
@Slf4j
public class TokenEncryptor {

    private static final String ALGORITHM = "AES/CBC/PKCS5PADDING";
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.encryption-key}")
    private String encryptionKey;

    public String encrypt(String plainText) {
        if (plainText == null) return null;
        try {
            byte[] keyBytes = encryptionKey.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
                throw new IllegalArgumentException("Invalid AES key length: " + keyBytes.length + " bytes (must be 16, 24, or 32)");
            }
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
            
            // Generate dynamic IV
            byte[] iv = new byte[16];
            secureRandom.nextBytes(iv);
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            
            // Prepend IV to encrypted bytes
            byte[] ivAndEncrypted = new byte[16 + encrypted.length];
            System.arraycopy(iv, 0, ivAndEncrypted, 0, 16);
            System.arraycopy(encrypted, 0, ivAndEncrypted, 16, encrypted.length);
            
            return Base64.getEncoder().encodeToString(ivAndEncrypted);
        } catch (Exception e) {
            log.error("Encryption failed", e);
            throw new RuntimeException("Token encryption failed", e);
        }
    }

    public String decrypt(String encryptedText) {
        if (encryptedText == null) return null;
        try {
            byte[] keyBytes = encryptionKey.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
                throw new IllegalArgumentException("Invalid AES key length: " + keyBytes.length + " bytes (must be 16, 24, or 32)");
            }
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
            
            byte[] decoded = Base64.getDecoder().decode(encryptedText);
            if (decoded.length < 16) {
                throw new IllegalArgumentException("Invalid encrypted text: too short");
            }
            
            // Extract IV
            byte[] iv = new byte[16];
            System.arraycopy(decoded, 0, iv, 0, 16);
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            
            // Extract ciphertext
            int ciphertextLength = decoded.length - 16;
            byte[] ciphertext = new byte[ciphertextLength];
            System.arraycopy(decoded, 16, ciphertext, 0, ciphertextLength);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
            return new String(cipher.doFinal(ciphertext), java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Decryption failed", e);
            throw new RuntimeException("Token decryption failed", e);
        }
    }
}
