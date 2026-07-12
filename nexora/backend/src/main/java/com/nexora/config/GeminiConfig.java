package com.nexora.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;

    public String getApiKey() {
        return apiKey;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.contains("mock") && !apiKey.contains("your_");
    }
}
