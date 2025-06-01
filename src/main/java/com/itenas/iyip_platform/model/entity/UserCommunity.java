package com.itenas.iyip_platform.model.entity;

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
@Table(name = "user_communities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCommunity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;
    
    @Column
    private String role; // misalnya: "member", "admin", "moderator"
    
    @Column
    private String status; // misalnya: "active", "pending", "blocked"
}