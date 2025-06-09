package com.itenas.iyip_platform.security;

import com.itenas.iyip_platform.repository.xTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final xTransactionRepository transactionRepository;

    public boolean isOwner(Long userId, Long transactionId) {
        return transactionRepository.findById(transactionId)
                .map(transaction -> transaction.getUser().getId().equals(userId))
                .orElse(false);
    }
}