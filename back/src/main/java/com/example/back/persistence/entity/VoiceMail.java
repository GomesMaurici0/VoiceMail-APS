package com.example.back.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class VoiceMail {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url_audio", nullable = false)
    private String audioUrl;

    @Column(name = "ouvido", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean ouvido;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "transcricao")
    private String transcricao;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.ouvido = false;
    }
}
