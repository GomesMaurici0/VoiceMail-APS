package com.example.back.service.impl;

import com.example.back.dtos.Input.VoiceMailRequest;
import com.example.back.dtos.Output.VoiceMailResponse;
import com.example.back.mapper.VoiceMailMapper;
import com.example.back.persistence.entity.VoiceMail;
import com.example.back.persistence.repository.VoiceMailRepository;
import com.example.back.service.VoiceMailService;
import com.example.back.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoiceMailServiceImpl implements VoiceMailService {

    private final VoiceMailRepository repository;
    private final VoiceMailMapper mapper;
    private final WebSocketNotificationService notificationService;

    private static final String DIRETORIO_UPLOAD = "uploads/audio/";


    @Override
    public VoiceMailResponse criar(VoiceMailRequest dto) {
        VoiceMail entity = mapper.toEntity(dto);

        VoiceMail salvo = repository.save(entity);
        VoiceMailResponse response = mapper.toResponse(salvo);

        // Notifica todos os clientes sobre o novo voicemail
        notificationService.notifyNewVoiceMail(response);

        return response;
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

        // Notifica todos os clientes sobre a atualização
        notificationService.notifyVoiceMailStatusUpdated(id, true);
    }

    @Override
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("VoiceMail não encontrado");
        }

        repository.deleteById(id);

        // Notifica todos os clientes sobre a exclusão
        notificationService.notifyVoiceMailDeleted(id);
    }

    @Override
    public List<VoiceMailResponse> listarNaoOuvidos() {
        return repository.findAll()
                .stream()
                .filter(vm -> vm.getOuvido() == false)
                .map(mapper::toResponse)
                .toList();
    }
    @Override
    public VoiceMailRequest processarUploadDeAudio(MultipartFile arquivo, String transcricao) throws IOException {
        validarArquivo(arquivo);

        Path caminhoUpload = Paths.get(DIRETORIO_UPLOAD);
        criarDiretorioSeNaoExistir(caminhoUpload);

        String nomeArquivo = gerarNomeArquivo(arquivo.getOriginalFilename());
        Path caminhoCompleto = caminhoUpload.resolve(nomeArquivo);

        salvarArquivo(arquivo, caminhoCompleto);

        String urlAudio = "/audio/" + nomeArquivo;

        return new VoiceMailRequest(transcricao, urlAudio);
    }

    private void validarArquivo(MultipartFile arquivo) {
        if (arquivo.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode estar vazio");
        }
    }

    private void criarDiretorioSeNaoExistir(Path caminho) throws IOException {
        if (!Files.exists(caminho)) {
            Files.createDirectories(caminho);
        }
    }

    private String gerarNomeArquivo(String nomeOriginal) {
        return System.currentTimeMillis() + "_" + nomeOriginal;
    }

    private void salvarArquivo(MultipartFile arquivo, Path caminho) throws IOException {
        Files.copy(arquivo.getInputStream(), caminho);
    }
}