package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.review.ReviewRequest;
import in.johnson.forkupmanna.dto.review.ReviewResponse;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.Review;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.ReviewRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @Override
    public ReviewResponse submitReview(ReviewRequest request) {
        User reviewer = getCurrentUser();

        if (reviewRepository.existsByReviewerUuidAndDonationDonationId(reviewer.getUuid(), request.getDonationId())) {
            throw new AppException("You have already reviewed this donation", HttpStatus.BAD_REQUEST);
        }

        User reviewee = userRepository.findByUuid(request.getRevieweeId())
                .orElseThrow(() -> new AppException("Reviewee not found", HttpStatus.NOT_FOUND));

        Donation donation = donationRepository.findByDonationId(request.getDonationId())
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(reviewee)
                .donation(donation)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForUser(String userUuid) {
        return reviewRepository.findByRevieweeUuidOrderByCreatedAtDesc(userUuid)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyGivenReviews() {
        User user = getCurrentUser();
        return reviewRepository.findByReviewerUuidOrderByCreatedAtDesc(user.getUuid())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReceivedReviews() {
        User user = getCurrentUser();
        return reviewRepository.findByRevieweeUuidOrderByCreatedAtDesc(user.getUuid())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private ReviewResponse mapToResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getUuid())
                .reviewer(ReviewResponse.ReviewerSummary.builder()
                        .id(r.getReviewer().getUuid())
                        .name(r.getReviewer().getName())
                        .role(r.getReviewer().getRole().name())
                        .build())
                .reviewee(ReviewResponse.ReviewerSummary.builder()
                        .id(r.getReviewee().getUuid())
                        .name(r.getReviewee().getName())
                        .role(r.getReviewee().getRole().name())
                        .build())
                .donationId(r.getDonation().getDonationId())
                .donationTitle(r.getDonation().getTitle())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt() != null
                        ? r.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}
