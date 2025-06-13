package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.CreateCommunityRequest;
import com.itenas.iyip_platform.dto.request.UpdateCommunityRequest;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.UserCommunityResponse;
import com.itenas.iyip_platform.entity.Community;
import com.itenas.iyip_platform.entity.UserCommunity;
import com.itenas.iyip_platform.entity.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.CommunityRepository;
import com.itenas.iyip_platform.repository.UserCommunityRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.CommunityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final UserRepository userRepository;

    @Override
    public CommunityResponse findById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        return mapToResponse(community);
    }

    @Override
    public List<CommunityResponse> findAll() {
        return communityRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommunityResponse> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userCommunityRepository.findByUserOrderByJoinedAtDesc(user).stream()
                .map(uc -> mapToResponse(uc.getCommunity()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommunityResponse create(CreateCommunityRequest request) {
        Community community = new Community();
        community.setName(request.getName());
        community.setDescription(request.getDescription());

        Community saved = communityRepository.save(community);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CommunityResponse update(Long id, UpdateCommunityRequest request) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        if (request.getName() != null) {
            community.setName(request.getName());
        }
        if (request.getDescription() != null) {
            community.setDescription(request.getDescription());
        }

        Community updated = communityRepository.save(community);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!communityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Community not found");
        }
        communityRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void joinCommunity(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (userCommunityRepository.existsByUserAndCommunity(user, community)) {
            throw new IllegalStateException("User already member of this community");
        }

        UserCommunity userCommunity = new UserCommunity();
        userCommunity.setUser(user);
        userCommunity.setCommunity(community);
        userCommunityRepository.save(userCommunity);
    }

    @Override
    @Transactional
    public void leaveCommunity(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userCommunityRepository.deleteByUserAndCommunity(user, community);
    }

    @Override
    public boolean isUserMember(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userCommunityRepository.existsByUserAndCommunity(user, community);
    }

    @Override
    public List<UserCommunityResponse> getCommunityMembers(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        return userCommunityRepository.findByCommunityOrderByJoinedAtDesc(community).stream()
                .map(uc -> {
                    UserCommunityResponse response = new UserCommunityResponse();
                    response.setUserCommunityId(uc.getUserCommunityId());
                    response.setUserId(uc.getUser().getUserId());
                    response.setUserName(uc.getUser().getName());
                    response.setCommunityId(uc.getCommunity().getCommunityId());
                    response.setCommunityName(uc.getCommunity().getName());
                    response.setJoinedAt(uc.getJoinedAt());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private CommunityResponse mapToResponse(Community community) {
        CommunityResponse response = new CommunityResponse();
        response.setCommunityId(community.getCommunityId());
        response.setName(community.getName());
        response.setDescription(community.getDescription());
        response.setMemberCount(community.getMembers().size());
        response.setCreatedAt(community.getCreatedAt());
        response.setUpdatedAt(community.getUpdatedAt());
        return response;
    }
}