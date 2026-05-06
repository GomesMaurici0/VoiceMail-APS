package com.example.back.persistence.repository;

import com.example.back.persistence.entity.VoiceMail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoiceMailRepository extends JpaRepository<VoiceMail, Long> {
}
