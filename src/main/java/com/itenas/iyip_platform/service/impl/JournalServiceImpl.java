package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.JournalDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Journal;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.JournalRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;

    @Override
    public JournalDto findById(Long id) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found with id: " + id));
        return mapToDto(journal);
    }

    @Override
    public List<JournalDto> findAll() {
        return journalRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JournalDto> findByUserId(Long userId) {
        return journalRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JournalDto> findPublicJournals() {
        return journalRepository.findByIsPublicTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JournalDto save(JournalDto journalDto) {
        Journal journal;
        if (journalDto.getJournalId() != null) {
            journal = journalRepository.findById(journalDto.getJournalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Journal not found with id: " + journalDto.getJournalId()));
        } else {
            journal = new Journal();
            journal.setCreatedAt(LocalDateTime.now());
        }

        User user = userRepository.findById(journalDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + journalDto.getUserId()));

        journal.setUser(user);
        journal.setTitle(journalDto.getTitle());
        journal.setContent(journalDto.getContent());
        journal.setThumbnailUrl(journalDto.getThumbnailUrl());
        journal.setIsPublic(journalDto.getIsPublic());

        Journal savedJournal = journalRepository.save(journal);
        return mapToDto(savedJournal);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!journalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Journal not found with id: " + id);
        }
        journalRepository.deleteById(id);
    }

    @Override
    public List<JournalDto> searchJournals(String keyword) {
        return journalRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private JournalDto mapToDto(Journal journal) {
        JournalDto dto = new JournalDto();
        dto.setJournalId(journal.getJournalId());
        dto.setUserId(journal.getUser().getUserId());
        dto.setUserName(journal.getUser().getName());
        dto.setTitle(journal.getTitle());
        dto.setContent(journal.getContent());
        dto.setThumbnailUrl(journal.getThumbnailUrl());
        dto.setIsPublic(journal.getIsPublic());
        dto.setCreatedAt(journal.getCreatedAt());
        return dto;
    }
}