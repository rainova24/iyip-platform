package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.xTransactionDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.xTransaction;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.xTransactionRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.xTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class xTransactionServiceImpl implements xTransactionService {

    private final xTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public xTransactionDto findById(Long id) {
        xTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToDto(transaction);
    }

    @Override
    public List<xTransactionDto> findAll() {
        return transactionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<xTransactionDto> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return transactionRepository.findByUserOrderByTransactionDateDesc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public xTransactionDto save(xTransactionDto transactionDto) {
        xTransaction transaction;
        if (transactionDto.getId() != null) {
            transaction = transactionRepository.findById(transactionDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionDto.getId()));
        } else {
            transaction = new xTransaction();
            transaction.setTransactionDate(LocalDateTime.now());
        }

        User user = userRepository.findById(transactionDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + transactionDto.getUserId()));

        transaction.setUser(user);
        transaction.setTransactionType(transactionDto.getTransactionType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDescription(transactionDto.getDescription());
        transaction.setStatus(transactionDto.getStatus());

        transaction = transactionRepository.save(transaction);
        return mapToDto(transaction);
    }

    @Override
    public void deleteById(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    private xTransactionDto mapToDto(xTransaction transaction) {
        xTransactionDto dto = new xTransactionDto();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUser().getId());
        dto.setUserName(transaction.getUser().getName());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setDescription(transaction.getDescription());
        dto.setStatus(transaction.getStatus());
        return dto;
    }
}