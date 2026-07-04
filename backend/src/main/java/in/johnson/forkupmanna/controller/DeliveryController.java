package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.delivery.DeliveryResponse;
import in.johnson.forkupmanna.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/available")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getAvailableDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getAvailableDeliveries();
        return ResponseEntity.ok(ApiResponse.success("Available deliveries retrieved successfully", deliveries));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getMyDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getMyDeliveries();
        return ResponseEntity.ok(ApiResponse.success("My deliveries retrieved successfully", deliveries));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getAllDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(ApiResponse.success("All deliveries retrieved successfully", deliveries));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse<DeliveryResponse>> acceptDelivery(@PathVariable String id) {
        DeliveryResponse response = deliveryService.acceptDelivery(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery accepted successfully", response));
    }

    @PutMapping("/{id}/pickup")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markPickedUp(@PathVariable String id) {
        DeliveryResponse response = deliveryService.markPickedUp(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery marked as picked up", response));
    }

    @PutMapping("/{id}/deliver")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markDelivered(@PathVariable String id) {
        DeliveryResponse response = deliveryService.markDelivered(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery completed successfully", response));
    }
}
