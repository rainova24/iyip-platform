package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.CommunityDto;

import java.util.List;

public interface CommunityService {
    CommunityDto findById(Long id);
    List<CommunityDto> findAll();
    List<CommunityDto> findCommunitiesByUserId(Long userId);
    CommunityDto save(CommunityDto communityDto);
    void deleteById(Long id);
    void joinCommunity(Long communityId, Long userId);
    void leaveCommunity(Long communityId, Long userId);
    boolean isUserMember(Long communityId, Long userId);
}