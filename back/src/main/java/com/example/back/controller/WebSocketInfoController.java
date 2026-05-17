package com.example.back.controller;

import com.example.back.websocket.VoiceMailWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/websocket")
public class WebSocketInfoController {

    @Autowired
    private VoiceMailWebSocketHandler webSocketHandler;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getWebSocketStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("connected", true);
        status.put("activeConnections", webSocketHandler.getActiveConnectionCount());
        status.put("wsUrl", "ws://localhost:8080/ws/voicemails");

        return ResponseEntity.ok(status);
    }
}

