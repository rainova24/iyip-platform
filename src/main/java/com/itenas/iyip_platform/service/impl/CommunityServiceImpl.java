package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.CommunityDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Community;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.model.entity.UserCommunity;
import com.itenas.iyip_platform.repository.CommunityRepository;
import com.itenas.iyip_platform.repository.UserCommunityRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final UserCommunityRepository userCommunityRepository;

    @Override
    public CommunityDto findById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + id));
        return mapToDto(community);
    }

    @Override
    public List<CommunityDto> findAll() {
        return communityRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommunityDto> findCommunitiesByUserId(Long userId) {
        return communityRepository.findCommunitiesByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommunityDto save(CommunityDto communityDto) {
        Community community;
        if (communityDto.getCommunityId() != null) {
            community = communityRepository.findById(communityDto.getCommunityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityDto.getCommunityId()));
        } else {
            community = new Community();
        }

        community.setName(communityDto.getName());
        community.setDescription(communityDto.getDescription());

        Community savedCommunity = communityRepository.save(community);
        return mapToDto(savedCommunity);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!communityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Community not found with id: " + id);
        }
        communityRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void joinCommunity(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (userCommunityRepository.existsByUserAndCommunity(user, community)) {
            throw new IllegalStateException("User is already a member of this community");
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
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!userCommunityRepository.existsByUserAndCommunity(user, community)) {
            throw new IllegalStateException("User is not a member of this community");
        }

        userCommunityRepository.deleteByUserAndCommunity(user, community);
    }

    @Override
    public boolean isUserMember(Long communityId, Long userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return userCommunityRepository.existsByUserAndCommunity(user, community);
    }

    private CommunityDto mapToDto(Community community) {
        CommunityDto dto = new CommunityDto();
        dto.setCommunityId(community.getCommunityId());
        dto.setName(community.getName());
        dto.setDescription(community.getDescription());
        dto.setMemberCount(communityRepository.countMembersByCommunityId(community.getCommunityId()));
        return dto;
    }
}