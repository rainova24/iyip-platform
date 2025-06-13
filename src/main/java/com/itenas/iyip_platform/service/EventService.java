package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.CreateEventRequest;
import com.itenas.iyip_platform.dto.request.UpdateEventRequest;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.dto.response.EventRegistrationResponse;

import java.util.List;

public interface EventService {
    EventResponse findById(Long id);
    List<EventResponse> findAll();
    List<EventResponse> findUpcomingEvents();
    List<EventResponse> findEventsByUserId(Long userId);
    EventResponse create(CreateEventRequest request);
    EventResponse update(Long id, UpdateEventRequest request);
    void deleteById(Long id);
    void registerUser(Long eventId, Long userId);
    void unregisterUser(Long eventId, Long userId);
    boolean isUserRegistered(Long eventId, Long userId);
    List<EventRegistrationResponse> getEventRegistrations(Long eventId);
}