package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Role-based queries (menggantikan AdminUserRepository dan RegularUserRepository)
    @Query("SELECT u FROM User u WHERE u.role.name = 'ADMIN'")
    List<User> findAllAdmins();

    @Query("SELECT u FROM User u WHERE u.role.name = 'USER'")
    List<User> findAllRegularUsers();

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    Page<User> findByRoleName(@Param("roleName") String roleName, Pageable pageable);

    // Location-based queries
    @Query("SELECT u FROM User u WHERE u.province = :province")
    List<User> findByProvince(@Param("province") String province);

    @Query("SELECT u FROM User u WHERE u.province = :province AND u.city = :city")
    List<User> findByProvinceAndCity(@Param("province") String province, @Param("city") String city);

    // Search queries
    @Query("SELECT u FROM User u WHERE u.name LIKE %:searchTerm% OR u.email LIKE %:searchTerm% OR u.nim LIKE %:searchTerm%")
    List<User> findByNameOrEmailOrNimContaining(@Param("searchTerm") String searchTerm);

    // Statistics queries for admin dashboard
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'ADMIN'")
    long countAdmins();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'USER'")
    long countRegularUsers();
}