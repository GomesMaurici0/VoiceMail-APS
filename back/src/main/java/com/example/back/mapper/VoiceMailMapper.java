package com.example.back.mapper;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.persistence.entity.VoiceMail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VoiceMailMapper {

    VoiceMail toEntity(VoiceMailRequest dto);

    VoiceMailResponse toResponse(VoiceMail entity);
}