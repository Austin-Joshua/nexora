package com.nexora.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * AES-256 encryption/decryption for sensitive fields like Gmail tokens.
 */
@Component
@Slf4j
public class TokenEncryptor {

    private static final String ALGORITHM = "AES/CBC/PKCS5PADDING";
    private static final String IV = "nexora1234567890"; // 16-byte IV

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
            IvParameterSpec ivSpec = new IvParameterSpec(IV.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
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
            IvParameterSpec ivSpec = new IvParameterSpec(IV.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
            byte[] decoded = Base64.getDecoder().decode(encryptedText);
            return new String(cipher.doFinal(decoded), java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Decryption failed", e);
            throw new RuntimeException("Token decryption failed", e);
        }
    }
}
