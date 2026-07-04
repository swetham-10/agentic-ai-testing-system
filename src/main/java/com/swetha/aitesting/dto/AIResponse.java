package com.swetha.aitesting.dto;

import lombok.Data;
import java.util.List;

@Data
public class AIResponse {
    private List<String> suggestions;
    private String priority;
}