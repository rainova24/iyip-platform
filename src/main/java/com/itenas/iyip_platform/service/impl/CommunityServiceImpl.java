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
    private final UserRepository userRepository;
    private final UserCommunityRepository userCommunityRepository;

    @Override
    public CommunityDto findById(Long id) {
        try {
            log.info("Finding community by ID: {}", id);
            Community community = communityRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + id));
            log.info("Found community: {}", community.getName());
            return mapToDto(community);
        } catch (Exception e) {
            log.error("Error finding community by ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<CommunityDto> findAll() {
        try {
            log.info("=== DEBUG: CommunityService.findAll() called ===");

            // Step 1: Get all communities from repository
            log.info("Step 1: Calling communityRepository.findAll()");
            List<Community> communities = communityRepository.findAll();
            log.info("Step 2: Repository returned {} communities", communities.size());

            // Step 2: Log each community
            for (int i = 0; i < communities.size(); i++) {
                Community community = communities.get(i);
                log.info("Community {}: ID={}, Name={}, Description={}",
                        i + 1,
                        community.getCommunityId(),
                        community.getName(),
                        community.getDescription());
            }

            // Step 3: Map to DTOs
            log.info("Step 3: Mapping {} communities to DTOs", communities.size());
            List<CommunityDto> result = communities.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());

            log.info("Step 4: Successfully mapped to {} DTOs", result.size());
            return result;

        } catch (Exception e) {
            log.error("=== ERROR in CommunityService.findAll() ===", e);
            log.error("Error type: {}", e.getClass().getSimpleName());
            log.error("Error message: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public List<CommunityDto> findCommunitiesByUserId(Long userId) {
        try {
            log.info("Finding communities for user ID: {}", userId);

            // Use simpler approach for debugging
            List<UserCommunity> userCommunities = userCommunityRepository.findByUserOrderByJoinedAtDesc(
                    userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId))
            );

            List<CommunityDto> result = userCommunities.stream()
                    .map(uc -> mapToDto(uc.getCommunity()))
                    .collect(Collectors.toList());

            log.info("Found {} communities for user {}", result.size(), userId);
            return result;

        } catch (Exception e) {
            log.error("Error finding communities for user: {}", userId, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public CommunityDto save(CommunityDto communityDto) {
        try {
            log.info("Saving community: {}", communityDto.getName());
            Community community;

            if (communityDto.getCommunityId() != null) {
                community = communityRepository.findById(communityDto.getCommunityId())
                        .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityDto.getCommunityId()));
                log.info("Updating existing community with ID: {}", communityDto.getCommunityId());
            } else {
                community = new Community();
                log.info("Creating new community");
            }

            community.setName(communityDto.getName());
            community.setDescription(communityDto.getDescription());

            Community savedCommunity = communityRepository.save(community);
            log.info("Community saved with ID: {}", savedCommunity.getCommunityId());

            return mapToDto(savedCommunity);
        } catch (Exception e) {
            log.error("Error saving community", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        try {
            log.info("Deleting community with ID: {}", id);
            if (!communityRepository.existsById(id)) {
                throw new ResourceNotFoundException("Community not found with id: " + id);
            }
            communityRepository.deleteById(id);
            log.info("Community deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting community: {}", id, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void joinCommunity(Long communityId, Long userId) {
        try {
            log.info("User {} joining community {}", userId, communityId);

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

            log.info("User {} successfully joined community {}", userId, communityId);
        } catch (Exception e) {
            log.error("Error joining community", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void leaveCommunity(Long communityId, Long userId) {
        try {
            log.info("User {} leaving community {}", userId, communityId);

            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityId));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            if (!userCommunityRepository.existsByUserAndCommunity(user, community)) {
                throw new IllegalStateException("User is not a member of this community");
            }

            userCommunityRepository.deleteByUserAndCommunity(user, community);
            log.info("User {} successfully left community {}", userId, communityId);
        } catch (Exception e) {
            log.error("Error leaving community", e);
            throw e;
        }
    }

    @Override
    public boolean isUserMember(Long communityId, Long userId) {
        try {
            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + communityId));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            boolean isMember = userCommunityRepository.existsByUserAndCommunity(user, community);
            log.info("User {} membership in community {}: {}", userId, communityId, isMember);
            return isMember;
        } catch (Exception e) {
            log.error("Error checking membership", e);
            throw e;
        }
    }

    private CommunityDto mapToDto(Community community) {
        try {
            log.debug("Mapping community to DTO: ID={}, Name={}",
                    community.getCommunityId(), community.getName());

            CommunityDto dto = new CommunityDto();
            dto.setCommunityId(community.getCommunityId());
            dto.setName(community.getName());
            dto.setDescription(community.getDescription());

            // SIMPLIFIED member count - avoid complex query for now
            try {
                Integer memberCount = communityRepository.countMembersByCommunityId(community.getCommunityId());
                dto.setMemberCount(memberCount != null ? memberCount : 0);
                log.debug("Member count for community {}: {}", community.getCommunityId(), memberCount);
            } catch (Exception e) {
                log.warn("Error getting member count for community {}, setting to 0", community.getCommunityId(), e);
                dto.setMemberCount(0);
            }

            return dto;
        } catch (Exception e) {
            log.error("Error mapping community to DTO", e);
            throw e;
        }
    }
}