package com.example.back.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@Slf4j
@Component
public class VoiceMailWebSocketHandler extends TextWebSocketHandler {

    private static final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        log.info("Nova conexão WebSocket estabelecida. Total: {}", sessions.size());

        session.sendMessage(new TextMessage("{\"type\":\"CONNECTED\",\"message\":\"Conectado ao servidor de voicemails\"}"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            log.debug("Mensagem recebida: {}", payload);


        } catch (Exception e) {
            log.error("Erro ao processar mensagem WebSocket", e);
            session.sendMessage(new TextMessage("{\"type\":\"ERROR\",\"message\":\"Erro ao processar mensagem\"}"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("Conexão WebSocket fechada. Total: {}", sessions.size());
    }


    public void broadcast(String message) {
        log.debug("Enviando broadcast para {} sessões", sessions.size());

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    log.error("Erro ao enviar mensagem para sessão", e);
                }
            }
        }
    }


    public int getActiveConnectionCount() {
        return sessions.size();
    }
}

