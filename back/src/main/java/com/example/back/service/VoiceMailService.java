package com.example.back.service;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VoiceMailService {

    VoiceMailResponse criar (VoiceMailRequest request);
    List<VoiceMailResponse> listar();
    VoiceMailResponse buscarPorId(Long id);
    void marcarComoOuvido(Long id);
    void deletar(Long id);
    List<VoiceMailResponse> listarNaoOuvidos();
    VoiceMailRequest processarUploadDeAudio(MultipartFile arquivo, String transcricao) throws IOException;

}
