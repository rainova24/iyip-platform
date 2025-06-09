package com.itenas.iyip_platform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itenas.iyip_platform.model.entity.xTransaction;
import com.itenas.iyip_platform.model.entity.User;

@Repository
public interface xTransactionRepository extends JpaRepository<xTransaction, Long> {
    List<xTransaction> findByUser(User user);
    List<xTransaction> findByUserOrderByTransactionDateDesc(User user);
}