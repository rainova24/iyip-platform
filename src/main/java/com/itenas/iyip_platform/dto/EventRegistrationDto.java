package com.itenas.iyip_platform.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRegistrationDto {
    private Long eventRegistrationId;
    private Long userId;
    private String userName;
    private Long eventId;
    private String eventTitle;
    private LocalDateTime registeredAt;
}