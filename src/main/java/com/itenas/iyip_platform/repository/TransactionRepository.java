package com.itenas.iyip_platform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itenas.iyip_platform.model.entity.Transaction;
import com.itenas.iyip_platform.model.entity.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
}