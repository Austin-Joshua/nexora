package com.nexora.repository;

import com.nexora.model.Email;
import com.nexora.model.Email.EmailCategory;
import com.nexora.model.Email.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {

    boolean existsByGmailMessageId(String gmailMessageId);

    Optional<Email> findByGmailMessageId(String gmailMessageId);

    Optional<Email> findByIdAndUserId(Long id, Long userId);

    Page<Email> findByUserIdOrderByReceivedAtDesc(Long userId, Pageable pageable);

    Page<Email> findByUserIdAndCategoryOrderByReceivedAtDesc(Long userId, EmailCategory category, Pageable pageable);

    Page<Email> findByUserIdAndPriorityOrderByReceivedAtDesc(Long userId, Priority priority, Pageable pageable);

    Page<Email> findByUserIdAndCategoryAndPriorityOrderByReceivedAtDesc(
        Long userId, EmailCategory category, Priority priority, Pageable pageable);

    @Query("SELECT e FROM Email e WHERE e.user.id = :userId AND " +
           "(LOWER(e.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.senderName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.senderEmail) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Email> searchByUserId(@Param("userId") Long userId, @Param("search") String search, Pageable pageable);

    @Query("SELECT e.category, COUNT(e) FROM Email e WHERE e.user.id = :userId GROUP BY e.category")
    List<Object[]> countByUserIdGroupByCategory(@Param("userId") Long userId);

    List<Email> findByUserIdAndPriorityAndIsReadFalseOrderByReceivedAtDesc(
        Long userId, Priority priority, Pageable pageable);

    @Query("SELECT e FROM Email e WHERE e.user.id = :userId AND e.deadlineDetected BETWEEN :start AND :end ORDER BY e.deadlineDetected ASC")
    List<Email> findUpcomingDeadlines(@Param("userId") Long userId,
                                      @Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end);

    @Query("SELECT e FROM Email e WHERE e.user.id = :userId AND e.category = 'MEETING' AND " +
           "e.deadlineDetected BETWEEN :start AND :end ORDER BY e.deadlineDetected ASC")
    List<Email> findTodaysMeetings(@Param("userId") Long userId,
                                   @Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);

    List<Email> findTop20ByUserIdOrderByReceivedAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * Returns grouped sender statistics: sender email, sender name, count of emails,
     * most recent received date, and most recent subject — ordered by count descending.
     */
    @Query("""
        SELECT e.senderEmail, e.senderName, COUNT(e), MAX(e.receivedAt), MAX(e.subject)
        FROM Email e
        WHERE e.user.id = :userId
        GROUP BY e.senderEmail, e.senderName
        ORDER BY COUNT(e) DESC
        """)
    List<Object[]> countBySenderForUser(@Param("userId") Long userId);

    /**
     * Fetch all email received dates for a user after a start date.
     */
    @Query("SELECT e.receivedAt FROM Email e WHERE e.user.id = :userId AND e.receivedAt >= :start")
    List<LocalDateTime> findReceivedAtByUserIdAndReceivedAtAfter(@Param("userId") Long userId, @Param("start") LocalDateTime start);

    /**
     * Fetch all emails in a thread for a given user, ordered by received date ASC.
     */
    List<Email> findByUserIdAndGmailThreadIdOrderByReceivedAtAsc(Long userId, String gmailThreadId);

    /**
     * Fetch all emails from a specific sender for a given user, newest first.
     */
    Page<Email> findByUserIdAndSenderEmailOrderByReceivedAtDesc(
            Long userId, String senderEmail, Pageable pageable);
}

