package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.entity.Event;
import com.itenas.iyip_platform.entity.EventRegistration;
import com.itenas.iyip_platform.entity.base.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUserOrderByRegisteredAtDesc(User user);
    List<EventRegistration> findByEventOrderByRegisteredAtDesc(Event event);
    Optional<EventRegistration> findByUserAndEvent(User user, Event event);
    boolean existsByUserAndEvent(User user, Event event);
    void deleteByUserAndEvent(User user, Event event);
}