package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.model.entity.Submission;
import com.itenas.iyip_platform.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserOrderBySubmittedAtDesc(User user);
    List<Submission> findByUserUserIdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByStatusOrderBySubmittedAtDesc(Submission.SubmissionStatus status);
    List<Submission> findByTypeOrderBySubmittedAtDesc(Submission.SubmissionType type);
    List<Submission> findByTypeAndStatusOrderBySubmittedAtDesc(Submission.SubmissionType type, Submission.SubmissionStatus status);
}