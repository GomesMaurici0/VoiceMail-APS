package com.example.back.dtos.Input;

import jakarta.validation.constraints.NotBlank;

public record VoiceMailRequest(
        String transcricao,
        @NotBlank(message = "A URL de áudio é obrigatória")
        String audioUrl
) {}
