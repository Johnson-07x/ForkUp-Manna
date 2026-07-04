package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.review.ReviewRequest;
import in.johnson.forkupmanna.dto.review.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse submitReview(ReviewRequest request);
    List<ReviewResponse> getReviewsForUser(String userUuid);
    List<ReviewResponse> getMyGivenReviews();
    List<ReviewResponse> getMyReceivedReviews();
}
