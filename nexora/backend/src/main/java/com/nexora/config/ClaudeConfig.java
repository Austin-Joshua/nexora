package com.nexora.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ClaudeConfig {

    @Value("${claude.api-key}")
    private String apiKey;

    @Value("${claude.api-url}")
    private String apiUrl;

    @Value("${claude.model}")
    private String model;

    @Bean
    public RestTemplate claudeRestTemplate() {
        return new RestTemplate();
    }

    public String getApiKey() { return apiKey; }
    public String getApiUrl() { return apiUrl; }
    public String getModel()  { return model;  }

    public HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");
        return headers;
    }
}
