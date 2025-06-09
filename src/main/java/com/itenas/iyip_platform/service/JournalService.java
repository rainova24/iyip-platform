package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.JournalDto;

import java.util.List;

public interface JournalService {
    JournalDto findById(Long id);
    List<JournalDto> findAll();
    List<JournalDto> findByUserId(Long userId);
    List<JournalDto> findPublicJournals();
    JournalDto save(JournalDto journalDto);
    void deleteById(Long id);
    List<JournalDto> searchJournals(String keyword);
}