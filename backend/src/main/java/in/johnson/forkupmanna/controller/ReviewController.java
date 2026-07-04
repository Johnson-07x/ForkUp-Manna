package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.review.ReviewRequest;
import in.johnson.forkupmanna.dto.review.ReviewResponse;
import in.johnson.forkupmanna.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DONOR', 'RECEIVER')")
    @Operation(summary = "Submit a review for a completed donation")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.submitReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", response));
    }

    @GetMapping("/for/{userUuid}")
    @Operation(summary = "Get all reviews received by a specific user")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsForUser(@PathVariable String userUuid) {
        List<ReviewResponse> reviews = reviewService.getReviewsForUser(userUuid);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }

    @GetMapping("/my-given")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get reviews I have submitted")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyGivenReviews() {
        List<ReviewResponse> reviews = reviewService.getMyGivenReviews();
        return ResponseEntity.ok(ApiResponse.success("My given reviews retrieved successfully", reviews));
    }

    @GetMapping("/my-received")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get reviews others have given me")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReceivedReviews() {
        List<ReviewResponse> reviews = reviewService.getMyReceivedReviews();
        return ResponseEntity.ok(ApiResponse.success("My received reviews retrieved successfully", reviews));
    }
}
