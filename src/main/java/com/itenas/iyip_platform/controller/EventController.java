package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.CreateEventRequest;
import com.itenas.iyip_platform.dto.request.UpdateEventRequest;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.EventService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        try {
            List<EventResponse> events = eventService.findAll();
            return ResponseEntity.ok(ApiResponse.success("Events retrieved", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get events: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventResponse event = eventService.findById(id);
            return ResponseEntity.ok(ApiResponse.success("Event retrieved", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Event not found"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateEventRequest request) {
        try {
            EventResponse event = eventService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Event created", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create event: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEventRequest request) {
        try {
            EventResponse event = eventService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Event updated", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update event: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            eventService.registerUser(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Registered for event", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to register: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<?> unregisterFromEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            eventService.unregisterUser(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Unregistered from event", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to unregister: " + e.getMessage()));
        }
    }
}