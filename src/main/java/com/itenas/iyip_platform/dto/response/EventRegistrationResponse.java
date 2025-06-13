package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EventRegistrationResponse {
    private Long eventRegistrationId;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long eventId;
    private String eventTitle;
    private LocalDate eventStartDate; // Add import
    private LocalDateTime registeredAt;
}
