package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.RegularUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegularUserRepository extends JpaRepository<RegularUser, Long> {
    Optional<RegularUser> findByNim(String nim);
    Optional<RegularUser> findByEmail(String email);
    boolean existsByNim(String nim);

    @Query("SELECT r FROM RegularUser r WHERE r.province = ?1")
    List<RegularUser> findByProvince(String province);

    @Query("SELECT r FROM RegularUser r WHERE r.province = ?1 AND r.city = ?2")
    List<RegularUser> findByProvinceAndCity(String province, String city);
}