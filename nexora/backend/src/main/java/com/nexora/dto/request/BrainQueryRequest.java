package com.nexora.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrainQueryRequest {
    @NotBlank(message = "Query cannot be empty")
    private String query;
}
