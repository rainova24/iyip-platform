package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.CreateJournalRequest;
import com.itenas.iyip_platform.dto.request.UpdateJournalRequest;
import com.itenas.iyip_platform.dto.response.JournalResponse;

import java.util.List;

public interface JournalService {
    JournalResponse findById(Long id);
    List<JournalResponse> findAll();
    List<JournalResponse> findPublicJournals();
    List<JournalResponse> findByUserId(Long userId);
    JournalResponse create(Long userId, CreateJournalRequest request);
    JournalResponse update(Long id, UpdateJournalRequest request);
    void deleteById(Long id);
    boolean isOwner(Long journalId, Long userId);
}