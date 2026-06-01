package com.example.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.back.websocket.VoiceMailWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private VoiceMailWebSocketHandler voiceMailWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Registra o handler para conexões WebSocket na rota /ws/voicemails
        registry.addHandler(voiceMailWebSocketHandler, "/ws/voicemails")
                .setAllowedOrigins("*");
    }
}

