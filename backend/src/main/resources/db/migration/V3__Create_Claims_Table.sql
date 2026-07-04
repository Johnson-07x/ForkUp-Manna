CREATE TABLE IF NOT EXISTS claims (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    claim_id CHAR(36) NOT NULL UNIQUE,
    donation_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    volunteer_id BIGINT,
    status ENUM('PENDING','APPROVED','REJECTED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_donation_id (donation_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_status (status),
    CONSTRAINT fk_claim_donation FOREIGN KEY (donation_id) REFERENCES donations(id),
    CONSTRAINT fk_claim_receiver FOREIGN KEY (receiver_id) REFERENCES users(id),
    CONSTRAINT fk_claim_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
