package com.itenas.iyip_platform.model.entity;

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
    private Long submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionType type;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    public enum SubmissionType {
        MATERIAL("material"),
        FASILITAS("fasilitas");

        private final String value;

        SubmissionType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum SubmissionStatus {
        PENDING("pending"),
        APPROVED("approved"),
        REJECTED("rejected");

        private final String value;

        SubmissionStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}