package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.Journal;
import com.itenas.iyip_platform.entity.base.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    List<Journal> findByUserOrderByCreatedAtDesc(User user);
    List<Journal> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    List<Journal> findByIsPublicTrueOrderByCreatedAtDesc();
    List<Journal> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
    List<Journal> findByIsPublicTrue();
}