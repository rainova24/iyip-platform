package com.itenas.iyip_platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommunityDto {
    private Long communityId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private Integer memberCount;
    private Boolean isMember;
}