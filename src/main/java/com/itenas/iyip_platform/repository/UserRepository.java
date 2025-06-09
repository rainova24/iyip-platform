// src/main/java/com/itenas/iyip_platform/repository/UserRepository.java
package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByNim(String nim);

    boolean existsByEmail(String email);

    boolean existsByNim(String nim);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'USER'")
    long countRegularUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'ADMIN'")
    long countAdminUsers();
}