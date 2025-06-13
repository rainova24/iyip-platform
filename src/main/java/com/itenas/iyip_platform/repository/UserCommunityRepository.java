package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.Community;
import com.itenas.iyip_platform.entity.base.User;
import com.itenas.iyip_platform.entity.UserCommunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCommunityRepository extends JpaRepository<UserCommunity, Long> {
    List<UserCommunity> findByUserOrderByJoinedAtDesc(User user);
    List<UserCommunity> findByCommunityOrderByJoinedAtDesc(Community community);
    Optional<UserCommunity> findByUserAndCommunity(User user, Community community);
    boolean existsByUserAndCommunity(User user, Community community);
    void deleteByUserAndCommunity(User user, Community community);
}