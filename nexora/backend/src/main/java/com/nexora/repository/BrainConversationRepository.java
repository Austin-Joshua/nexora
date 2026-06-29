package com.nexora.repository;

import com.nexora.model.BrainConversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrainConversationRepository extends JpaRepository<BrainConversation, Long> {
    List<BrainConversation> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    void deleteByCreatedAtBefore(java.time.LocalDateTime cutoff);
}
