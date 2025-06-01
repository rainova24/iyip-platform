package com.itenas.iyip_platform.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "journals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Journal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column
    private String abstract_text;
    
    @Column
    private String authors;
    
    @Column(nullable = false)
    private LocalDateTime publicationDate;
    
    @Column
    private String fileUrl;
    
    @Column
    private String status; // misalnya: "draft", "published", "archived"
}