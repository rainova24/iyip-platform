package com.itenas.iyip_platform.repository;

import com.itenas.iyip_platform.model.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStartDateAfterOrderByStartDateAsc(LocalDate date);
    List<Event> findByStartDateBeforeAndEndDateAfterOrderByStartDateAsc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT e FROM Event e JOIN e.registrations er WHERE er.user.userId = :userId ORDER BY e.startDate DESC")
    List<Event> findEventsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.event.eventId = :eventId")
    Integer countRegistrationsByEventId(@Param("eventId") Long eventId);
}