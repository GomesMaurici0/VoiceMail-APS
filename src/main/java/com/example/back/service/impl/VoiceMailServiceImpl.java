package com.example.back.service.impl;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.mapper.VoiceMailMapper;
import com.example.back.persistence.entity.VoiceMail;
import com.example.back.persistence.repository.VoiceMailRepository;
import com.example.back.service.VoiceMailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoiceMailServiceImpl implements VoiceMailService {

    private final VoiceMailRepository repository;

    private final VoiceMailMapper mapper;

    @Override
    public VoiceMailResponse criar(VoiceMailRequest dto) {
        VoiceMail entity = mapper.toEntity(dto);

        VoiceMail salvo = repository.save(entity);

        return mapper.toResponse(salvo);
    }

    @Override
    public List<VoiceMailResponse> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public VoiceMailResponse buscarPorId(Long id) {
        VoiceMail entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("VoiceMail não encontrado"));

        return mapper.toResponse(entity);
    }

    @Override
    public void marcarComoOuvido(Long id) {
        VoiceMail entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("VoiceMail não encontrado"));

        entity.setOuvido(true);

        repository.save(entity);
    }

    @Override
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("VoiceMail não encontrado");
        }

        repository.deleteById(id);
    }

    @Override
    public List<VoiceMailResponse> listarNaoOuvidos() {
        return repository.findAll()
                .stream()
                .filter(vm -> vm.getOuvido() == false)
                .map(mapper::toResponse)
                .toList();
    }
}