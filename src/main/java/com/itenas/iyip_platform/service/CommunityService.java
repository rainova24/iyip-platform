package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.CreateCommunityRequest;
import com.itenas.iyip_platform.dto.request.UpdateCommunityRequest;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.UserCommunityResponse;

import java.util.List;

public interface CommunityService {
    CommunityResponse findById(Long id);
    List<CommunityResponse> findAll();
    List<CommunityResponse> findByUserId(Long userId);
    CommunityResponse create(CreateCommunityRequest request);
    CommunityResponse update(Long id, UpdateCommunityRequest request);
    void deleteById(Long id);
    void joinCommunity(Long communityId, Long userId);
    void leaveCommunity(Long communityId, Long userId);
    boolean isUserMember(Long communityId, Long userId);
    List<UserCommunityResponse> getCommunityMembers(Long communityId);
}