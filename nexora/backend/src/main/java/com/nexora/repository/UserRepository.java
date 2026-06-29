package com.nexora.repository;

import com.nexora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByEmail(String email);
    boolean existsByGoogleId(String googleId);
    List<User> findAllByLastSyncedAtBeforeOrLastSyncedAtIsNull(LocalDateTime threshold);
}
