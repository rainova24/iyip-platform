package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.CreateJournalRequest;
import com.itenas.iyip_platform.dto.request.UpdateJournalRequest;
import com.itenas.iyip_platform.dto.response.JournalResponse;
import com.itenas.iyip_platform.entity.Journal;
import com.itenas.iyip_platform.entity.base.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.JournalRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.JournalService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;

    @Override
    public JournalResponse findById(Long id) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));
        return mapToResponse(journal);
    }

    @Override
    public List<JournalResponse> findAll() {
        return journalRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JournalResponse> findPublicJournals() {
        return journalRepository.findByIsPublicTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JournalResponse> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return journalRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JournalResponse create(Long userId, CreateJournalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Journal journal = new Journal();
        journal.setUser(user);
        journal.setTitle(request.getTitle());
        journal.setContent(request.getContent());
        journal.setThumbnailUrl(request.getThumbnailUrl());
        journal.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : false);

        Journal saved = journalRepository.save(journal);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public JournalResponse update(Long id, UpdateJournalRequest request) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));

        if (request.getTitle() != null) {
            journal.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            journal.setContent(request.getContent());
        }
        if (request.getThumbnailUrl() != null) {
            journal.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getIsPublic() != null) {
            journal.setIsPublic(request.getIsPublic());
        }

        Journal updated = journalRepository.save(journal);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!journalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Journal not found");
        }
        journalRepository.deleteById(id);
    }

    @Override
    public boolean isOwner(Long journalId, Long userId) {
        Journal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));
        return journal.getUser().getUserId().equals(userId);
    }

    private JournalResponse mapToResponse(Journal journal) {
        JournalResponse response = new JournalResponse();
        response.setJournalId(journal.getJournalId());
        response.setUserId(journal.getUser().getUserId());
        response.setUserName(journal.getUser().getName());
        response.setTitle(journal.getTitle());
        response.setContent(journal.getContent());
        response.setThumbnailUrl(journal.getThumbnailUrl());
        response.setIsPublic(journal.getIsPublic());
        response.setCreatedAt(journal.getCreatedAt());
        response.setUpdatedAt(journal.getUpdatedAt());
        return response;
    }
}