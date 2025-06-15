package com.itenas.iyip_platform.entity;

import com.itenas.iyip_platform.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Submission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long submissionId;

    // UPDATED: Reference to concrete User class instead of base.User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionType type;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SubmissionStatus.PENDING;
        }
    }

    public enum SubmissionType {
        MATERIAL("Material"),      // Research papers, documents, academic materials
        FASILITAS("Fasilitas");   // Facility requests, equipment, infrastructure

        private final String displayName;

        SubmissionType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum SubmissionStatus {
        PENDING("Pending"),       // Waiting for admin review
        APPROVED("Approved"),     // Approved by admin
        REJECTED("Rejected");     // Rejected by admin

        private final String displayName;

        SubmissionStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}