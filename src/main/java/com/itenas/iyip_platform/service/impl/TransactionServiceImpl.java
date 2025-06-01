package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.TransactionDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Transaction;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.TransactionRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public TransactionDto findById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToDto(transaction);
    }

    @Override
    public List<TransactionDto> findAll() {
        return transactionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDto> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return transactionRepository.findByUserOrderByTransactionDateDesc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDto save(TransactionDto transactionDto) {
        Transaction transaction;
        if (transactionDto.getId() != null) {
            transaction = transactionRepository.findById(transactionDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionDto.getId()));
        } else {
            transaction = new Transaction();
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

    private TransactionDto mapToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
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