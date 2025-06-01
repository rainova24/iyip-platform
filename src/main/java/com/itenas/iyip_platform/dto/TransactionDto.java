package com.itenas.iyip_platform.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private Long userId;
    private String userName;
    private String transactionType;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private String description;
    private String status;
}