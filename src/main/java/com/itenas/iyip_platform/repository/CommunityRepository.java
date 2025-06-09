package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.model.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Community c JOIN c.members uc WHERE uc.user.userId = :userId")
    List<Community> findCommunitiesByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(uc) FROM UserCommunity uc WHERE uc.community.communityId = :communityId")
    Integer countMembersByCommunityId(@Param("communityId") Long communityId);
}