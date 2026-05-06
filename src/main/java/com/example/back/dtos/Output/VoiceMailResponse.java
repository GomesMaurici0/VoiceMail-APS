package com.example.back.dtos.Output;

import java.time.LocalDateTime;

public record VoiceMailResponse(
        Long id,
        String audioUrl,
        Boolean ouvido,
        LocalDateTime dataCriacao
) {
}
