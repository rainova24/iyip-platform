package com.itenas.iyip_platform.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "user")
    private Set<Transaction> transactions = new HashSet<>();
    
    @OneToMany(mappedBy = "user")
    private Set<UserCommunity> communities = new HashSet<>();
    
    @OneToMany(mappedBy = "user")
    private Set<EventRegistration> eventRegistrations = new HashSet<>();
    
    @OneToMany(mappedBy = "user")
    private Set<Submission> submissions = new HashSet<>();
    
    @OneToMany(mappedBy = "user")
    private Set<Journal> journals = new HashSet<>();
}