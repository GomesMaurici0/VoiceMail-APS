package com.example.back.service;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;

import java.util.List;

public interface VoiceMailService {

    VoiceMailResponse criar (VoiceMailRequest request);
    List<VoiceMailResponse> listar();
    VoiceMailResponse buscarPorId(Long id);
    void marcarComoOuvido(Long id);
    void deletar(Long id);
    List<VoiceMailResponse> listarNaoOuvidos();
}
