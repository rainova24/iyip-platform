package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.EventDto;

import java.util.List;

public interface EventService {
    EventDto findById(Long id);
    List<EventDto> findAll();
    List<EventDto> findUpcomingEvents();
    List<EventDto> findEventsByUserId(Long userId);
    EventDto save(EventDto eventDto);
    void deleteById(Long id);
    void registerUserForEvent(Long eventId, Long userId);
    void unregisterUserFromEvent(Long eventId, Long userId);
    boolean isUserRegistered(Long eventId, Long userId);
}