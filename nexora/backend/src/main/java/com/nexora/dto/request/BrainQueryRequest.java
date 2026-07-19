package com.nexora.dto.request;

import jakarta.validation.constraints.NotBlank;

public class BrainQueryRequest {
    @NotBlank(message = "Query cannot be empty")
    private String query;

    public BrainQueryRequest() {}

    public BrainQueryRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
