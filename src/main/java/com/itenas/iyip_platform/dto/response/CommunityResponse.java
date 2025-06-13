package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommunityResponse {
    private Long communityId;
    private String name;
    private String description;
    private Integer memberCount;
    private Boolean isMember; // Note: not "setIsMember" but "isMember"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
