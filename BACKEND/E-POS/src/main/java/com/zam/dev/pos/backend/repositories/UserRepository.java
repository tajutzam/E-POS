package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUuid(String uuid);

    Boolean existsByEmail(String email);
}