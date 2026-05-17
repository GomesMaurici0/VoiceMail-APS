package com.example.back.mapper;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.persistence.entity.VoiceMail;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-17T12:27:18-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class VoiceMailMapperImpl implements VoiceMailMapper {

    @Override
    public VoiceMail toEntity(VoiceMailRequest dto) {
        if ( dto == null ) {
            return null;
        }

        VoiceMail voiceMail = new VoiceMail();

        voiceMail.setAudioUrl( dto.audioUrl() );
        voiceMail.setTranscricao( dto.transcricao() );

        return voiceMail;
    }

    @Override
    public VoiceMailResponse toResponse(VoiceMail entity) {
        if ( entity == null ) {
            return null;
        }

        String transcricao = null;
        Long id = null;
        String audioUrl = null;
        Boolean ouvido = null;
        LocalDateTime dataCriacao = null;

        transcricao = entity.getTranscricao();
        id = entity.getId();
        audioUrl = entity.getAudioUrl();
        ouvido = entity.getOuvido();
        dataCriacao = entity.getDataCriacao();

        VoiceMailResponse voiceMailResponse = new VoiceMailResponse( transcricao, id, audioUrl, ouvido, dataCriacao );

        return voiceMailResponse;
    }
}
