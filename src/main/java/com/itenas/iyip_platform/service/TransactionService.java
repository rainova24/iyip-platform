package com.itenas.iyip_platform.service;

import java.util.List;

import com.itenas.iyip_platform.dto.TransactionDto;

public interface TransactionService {
    TransactionDto findById(Long id);
    List<TransactionDto> findAll();
    List<TransactionDto> findByUserId(Long userId);
    TransactionDto save(TransactionDto transactionDto);
    void deleteById(Long id);
}