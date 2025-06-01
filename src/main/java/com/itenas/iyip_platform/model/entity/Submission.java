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
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime submissionDate;
    
    @Column
    private String fileUrl;
    
    @Column
    private String status; // misalnya: "submitted", "under review", "accepted", "rejected"
}