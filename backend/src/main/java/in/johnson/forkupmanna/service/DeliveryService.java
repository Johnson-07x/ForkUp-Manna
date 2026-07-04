package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.delivery.DeliveryResponse;

import java.util.List;

public interface DeliveryService {
    List<DeliveryResponse> getAvailableDeliveries();
    DeliveryResponse acceptDelivery(String deliveryId);
    DeliveryResponse markPickedUp(String deliveryId);
    DeliveryResponse markDelivered(String deliveryId);
    List<DeliveryResponse> getMyDeliveries();
    List<DeliveryResponse> getAllDeliveries();
}
