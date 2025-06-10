package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.CommunityDto;
import com.itenas.iyip_platform.service.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CommunityController {

    private final CommunityService communityService;

    // TEST ENDPOINT - Untuk memastikan controller terdeteksi
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        log.info("=== TEST ENDPOINT CALLED ===");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Community Controller is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // GET /api/communities - Get all communities (PUBLIC ACCESS)
    @GetMapping
    public ResponseEntity<?> getAllCommunities() {
        try {
            log.info("=== GET ALL COMMUNITIES CALLED ===");

            List<CommunityDto> communities = communityService.findAll();
            log.info("Found {} communities", communities.size());

            Map<String, Object> response = new HashMap<>();
            response.put("data", communities);
            response.put("count", communities.size());
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("=== ERROR in getAllCommunities ===", e);

            Map<String, Object> error = new HashMap<>();
            error.put("message", "Failed to get communities: " + e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            error.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // GET /api/communities/{id} - Get community by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable Long id) {
        try {
            log.info("Getting community with id: {}", id);
            CommunityDto community = communityService.findById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("data", community);
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting community with id: {}", id, e);

            Map<String, Object> error = new HashMap<>();
            error.put("message", "Community not found");
            error.put("status", "error");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // POST /api/communities - Create new community
    @PostMapping
    public ResponseEntity<?> createCommunity(@RequestBody CommunityDto communityDto) {
        try {
            log.info("Creating community: {}", communityDto.getName());
            CommunityDto savedCommunity = communityService.save(communityDto);

            Map<String, Object> response = new HashMap<>();
            response.put("data", savedCommunity);
            response.put("message", "Community created successfully");
            response.put("status", "success");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating community", e);

            Map<String, Object> error = new HashMap<>();
            error.put("message", "Failed to create community: " + e.getMessage());
            error.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}