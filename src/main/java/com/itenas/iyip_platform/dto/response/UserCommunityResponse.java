package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserCommunityResponse {
    private Long userCommunityId;
    private Long userId;
    private String userName;
    private Long communityId;
    private String communityName;
    private LocalDateTime joinedAt;
}