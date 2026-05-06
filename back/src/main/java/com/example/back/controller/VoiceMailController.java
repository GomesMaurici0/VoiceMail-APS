package com.example.back.controller;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.service.VoiceMailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/voicemails")
public class VoiceMailController {

    private final VoiceMailService voiceMailService;

    public VoiceMailController(VoiceMailService voiceMailService) {
        this.voiceMailService = voiceMailService;
    }


    @PostMapping
    public ResponseEntity<VoiceMailResponse> criarMensagemDeVoz(@RequestBody VoiceMailRequest request) {
        var response = voiceMailService.criar(request);
        return ResponseEntity
                .created(URI.create("/api/voicemails/" + response.id()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<VoiceMailResponse>> listar() {
        return ResponseEntity.ok(voiceMailService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoiceMailResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(voiceMailService.buscarPorId(id));
    }

    @PatchMapping("/{id}/ouvido")
    public ResponseEntity<Void> marcarComoOuvido(@PathVariable Long id) {
        voiceMailService.marcarComoOuvido(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        voiceMailService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nao-ouvidos")
    public ResponseEntity<List<VoiceMailResponse>> listarNaoOuvidos() {
        return ResponseEntity.ok(voiceMailService.listarNaoOuvidos());
    }
}