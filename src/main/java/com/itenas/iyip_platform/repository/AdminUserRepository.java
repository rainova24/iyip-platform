package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmail(String email);

    @Query("SELECT a FROM AdminUser a WHERE a.department = ?1")
    List<AdminUser> findByDepartment(String department);

    @Query("SELECT a FROM AdminUser a WHERE a.accessLevel >= ?1")
    List<AdminUser> findByAccessLevelGreaterThanEqual(Integer accessLevel);
}