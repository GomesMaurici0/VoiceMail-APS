package com.example.back.service;

import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.websocket.VoiceMailWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class WebSocketNotificationService {

    @Autowired
    private VoiceMailWebSocketHandler webSocketHandler;

    private final ObjectMapper objectMapper = new ObjectMapper();


    public void notifyNewVoiceMail(VoiceMailResponse voicemail) {
        try {
            String message = objectMapper.writeValueAsString(new WebSocketMessage(
                    "NEW_VOICEMAIL",
                    "Um novo correio de voz foi adicionado",
                    voicemail
            ));
            webSocketHandler.broadcast(message);
        } catch (Exception e) {
            log.error("Erro ao notificar novo voicemail", e);
        }
    }

    public void notifyVoiceMailStatusUpdated(Long voiceMailId, Boolean ouvido) {
        try {
            String message = objectMapper.writeValueAsString(new WebSocketMessage(
                    "VOICEMAIL_UPDATED",
                    "Status do correio de voz foi atualizado",
                    new VoiceMailStatusUpdate(voiceMailId, ouvido)
            ));
            webSocketHandler.broadcast(message);
        } catch (Exception e) {
            log.error("Erro ao notificar atualização de voicemail", e);
        }
    }


    public void notifyVoiceMailDeleted(Long voiceMailId) {
        try {
            String message = objectMapper.writeValueAsString(new WebSocketMessage(
                    "VOICEMAIL_DELETED",
                    "Correio de voz foi removido",
                    new VoiceMailDeletedUpdate(voiceMailId)
            ));
            webSocketHandler.broadcast(message);
        } catch (Exception e) {
            log.error("Erro ao notificar exclusão de voicemail", e);
        }
    }


    public static class WebSocketMessage {
        public String type;
        public String message;
        public Object data;

        public WebSocketMessage(String type, String message, Object data) {
            this.type = type;
            this.message = message;
            this.data = data;
        }
    }


    public static class VoiceMailStatusUpdate {
        public Long voiceMailId;
        public Boolean ouvido;

        public VoiceMailStatusUpdate(Long voiceMailId, Boolean ouvido) {
            this.voiceMailId = voiceMailId;
            this.ouvido = ouvido;
        }
    }


    public static class VoiceMailDeletedUpdate {
        public Long voiceMailId;

        public VoiceMailDeletedUpdate(Long voiceMailId) {
            this.voiceMailId = voiceMailId;
        }
    }
}

