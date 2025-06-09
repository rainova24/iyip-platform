package com.itenas.iyip_platform.service;

import java.util.List;

import com.itenas.iyip_platform.dto.xTransactionDto;

public interface xTransactionService {
    xTransactionDto findById(Long id);
    List<xTransactionDto> findAll();
    List<xTransactionDto> findByUserId(Long userId);
    xTransactionDto save(xTransactionDto transactionDto);
    void deleteById(Long id);
}