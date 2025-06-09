package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.EventDto;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto) {
        return new ResponseEntity<>(eventService.save(eventDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDto eventDto) {
        eventDto.setEventId(id);
        return ResponseEntity.ok(eventService.save(eventDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Void> registerForEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        eventService.registerUserForEvent(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unregister")
    public ResponseEntity<Void> unregisterFromEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        eventService.unregisterUserFromEvent(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EventDto>> getUserEvents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(eventService.findEventsByUserId(userDetails.getId()));
    }
}