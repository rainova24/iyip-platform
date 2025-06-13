package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.CreateEventRequest;
import com.itenas.iyip_platform.dto.request.UpdateEventRequest;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.dto.response.EventRegistrationResponse;
import com.itenas.iyip_platform.entity.Event;
import com.itenas.iyip_platform.entity.EventRegistration;
import com.itenas.iyip_platform.entity.base.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.EventRepository;
import com.itenas.iyip_platform.repository.EventRegistrationRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.EventService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;

    @Override
    public EventResponse findById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return mapToResponse(event);
    }

    @Override
    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> findUpcomingEvents() {
        return eventRepository.findByStartDateAfter(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> findEventsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return eventRegistrationRepository.findByUserOrderByRegisteredAtDesc(user).stream()
                .map(er -> mapToResponse(er.getEvent()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse create(CreateEventRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());

        Event saved = eventRepository.save(event);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public EventResponse update(Long id, UpdateEventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getStartDate() != null) {
            event.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            event.setEndDate(request.getEndDate());
        }
        if (request.getRegistrationDeadline() != null) {
            event.setRegistrationDeadline(request.getRegistrationDeadline());
        }

        Event updated = eventRepository.save(event);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found");
        }
        eventRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void registerUser(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (eventRegistrationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalStateException("User already registered for this event");
        }

        if (event.getRegistrationDeadline() != null &&
                LocalDate.now().isAfter(event.getRegistrationDeadline())) {
            throw new IllegalStateException("Registration deadline has passed");
        }

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        eventRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void unregisterUser(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        eventRegistrationRepository.deleteByUserAndEvent(user, event);
    }

    @Override
    public boolean isUserRegistered(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return eventRegistrationRepository.existsByUserAndEvent(user, event);
    }

    @Override
    public List<EventRegistrationResponse> getEventRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        return eventRegistrationRepository.findByEventOrderByRegisteredAtDesc(event).stream()
                .map(er -> {
                    EventRegistrationResponse response = new EventRegistrationResponse();
                    response.setEventRegistrationId(er.getEventRegistrationId());
                    response.setUserId(er.getUser().getUserId());
                    response.setUserName(er.getUser().getName());
                    response.setUserEmail(er.getUser().getEmail());
                    response.setEventId(er.getEvent().getEventId());
                    response.setEventTitle(er.getEvent().getTitle());
                    response.setEventStartDate(er.getEvent().getStartDate());
                    response.setRegisteredAt(er.getRegisteredAt());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private EventResponse mapToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setEventId(event.getEventId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setStartDate(event.getStartDate());
        response.setEndDate(event.getEndDate());
        response.setRegistrationDeadline(event.getRegistrationDeadline());
        response.setTotalRegistrations(event.getRegistrations().size());
        response.setCanRegister(event.getRegistrationDeadline() == null ||
                LocalDate.now().isBefore(event.getRegistrationDeadline()));
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }
}