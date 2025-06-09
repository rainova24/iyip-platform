package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.xTransactionDto;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.xTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class xTransactionController {

    private final xTransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<xTransactionDto>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<xTransactionDto> getTransactionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(transactionService.findById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<List<xTransactionDto>> getUserTransactions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(transactionService.findByUserId(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<xTransactionDto> createTransaction(
            @Valid @RequestBody xTransactionDto transactionDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // Set the current user as the transaction owner
        transactionDto.setUserId(userDetails.getId());
        return new ResponseEntity<>(transactionService.save(transactionDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<xTransactionDto> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody xTransactionDto transactionDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        transactionDto.setId(id);
        return ResponseEntity.ok(transactionService.save(transactionDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}