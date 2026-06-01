package com.example.back.controller;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.service.VoiceMailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/voicemails")

public class VoiceMailController {

    private final VoiceMailService voiceMailService;

    @PostMapping
    public ResponseEntity<VoiceMailResponse> criarMensagemDeVoz(@Valid @RequestBody VoiceMailRequest request) {
        var response = voiceMailService.criar(request);
        return ResponseEntity
                .created(URI.create("/api/voicemails/" + response.id()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<VoiceMailResponse>> listarTodas() {
        return ResponseEntity.ok(voiceMailService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoiceMailResponse> obterPorId(@PathVariable Long id) {
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
    public ResponseEntity<List<VoiceMailResponse>> listarNaoOuvidas() {
        return ResponseEntity.ok(voiceMailService.listarNaoOuvidos());
    }

    @PostMapping("/upload")
    public ResponseEntity<VoiceMailResponse> enviarAudio(@RequestParam("arquivo") MultipartFile arquivo, @RequestParam("transcricao") String transcricao) throws IOException {
        VoiceMailRequest requisicao = voiceMailService.processarUploadDeAudio(arquivo, transcricao);
        VoiceMailResponse resposta = voiceMailService.criar(requisicao);
        return ResponseEntity
                .created(URI.create("/api/voicemails/" + resposta.id()))
                .body(resposta);
    }
}
