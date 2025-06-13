package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Long eventId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
    private Integer totalRegistrations;
    private Boolean isRegistered; // Note: not "setIsRegistered" but "isRegistered"
    private Boolean canRegister;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
