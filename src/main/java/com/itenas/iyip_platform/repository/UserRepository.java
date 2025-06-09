package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByNim(String nim);
    boolean existsByEmail(String email);
    boolean existsByNim(String nim);
}