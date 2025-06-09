package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.EventDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Event;
import com.itenas.iyip_platform.model.entity.EventRegistration;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.EventRegistrationRepository;
import com.itenas.iyip_platform.repository.EventRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;

    @Override
    public EventDto findById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToDto(event);
    }

    @Override
    public List<EventDto> findAll() {
        return eventRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> findUpcomingEvents() {
        return eventRepository.findByStartDateAfterOrderByStartDateAsc(LocalDate.now()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> findEventsByUserId(Long userId) {
        return eventRepository.findEventsByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventDto save(EventDto eventDto) {
        Event event;
        if (eventDto.getEventId() != null) {
            event = eventRepository.findById(eventDto.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventDto.getEventId()));
        } else {
            event = new Event();
        }

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartDate(eventDto.getStartDate());
        event.setEndDate(eventDto.getEndDate());
        event.setRegistrationDeadline(eventDto.getRegistrationDeadline());

        Event savedEvent = eventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void registerUserForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (eventRegistrationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalStateException("User is already registered for this event");
        }

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        eventRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void unregisterUserFromEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!eventRegistrationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalStateException("User is not registered for this event");
        }

        eventRegistrationRepository.deleteByUserAndEvent(user, event);
    }

    @Override
    public boolean isUserRegistered(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return eventRegistrationRepository.existsByUserAndEvent(user, event);
    }

    private EventDto mapToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setTotalRegistrations(eventRepository.countRegistrationsByEventId(event.getEventId()));
        return dto;
    }
}