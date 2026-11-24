package com.fatec.taskflow.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TaskResponse(
        Long id,
        @JsonProperty("titulo") String title,
        @JsonProperty("descricao") String description,
        @JsonProperty("responsavel") String assignee,
        String status,
        @JsonProperty("prioridade") String priority) {

}
