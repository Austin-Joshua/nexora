package com.nexora.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;

import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.UserCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Date;

@Component
@Slf4j
public class GmailConfig {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    private static final String APPLICATION_NAME = "Nexora";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    /**
     * Build a Gmail service instance for a given user's decrypted access/refresh tokens.
     */
    public Gmail buildGmailService(String accessToken, String refreshToken, Date tokenExpiry)
            throws GeneralSecurityException, IOException {

        AccessToken token = new AccessToken(accessToken, tokenExpiry);

        UserCredentials credentials = UserCredentials.newBuilder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setAccessToken(token)
                .setRefreshToken(refreshToken)
                .build();

        return new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public GsonFactory getJsonFactory() {
        return JSON_FACTORY;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}
