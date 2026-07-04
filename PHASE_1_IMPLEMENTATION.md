# Phase 1: Authentication & User Management - Implementation Guide

## Overview

Phase 1 implements the core authentication and user management system for ForkUp Manna using JWT-based authentication with Spring Security 6.x.

## Completed Components

### 1. User Entity

- **Location**: `src/main/java/in/johnson/forkupmanna/entity/User.java`
- **Features**:
  - Auto-generated UUID for each user
  - Supports four user roles: ADMIN, DONOR, RECEIVER, VOLUNTEER
  - Timestamp tracking (created_at, updated_at)
  - BCrypt password encryption support
  - User status tracking (ACTIVE/INACTIVE)

### 2. Role Enum

- **Location**: `src/main/java/in/johnson/forkupmanna/enums/UserRole.java`
- **Supported Roles**:
  - ADMIN: System administrator
  - DONOR: Food donor
  - RECEIVER: Food receiver organization
  - VOLUNTEER: Volunteer for delivery

### 3. JWT Authentication

- **Token Provider**: `src/main/java/in/johnson/forkupmanna/security/JwtTokenProvider.java`
  - Access token generation (24 hours expiration)
  - Refresh token generation (7 days expiration)
  - Token validation and claims extraction
  - Secure signing with HS512 algorithm

- **Authentication Filter**: `src/main/java/in/johnson/forkupmanna/security/JwtAuthenticationFilter.java`
  - Bearer token extraction from Authorization header
  - Token validation on each request
  - Security context population

### 4. API Endpoints

#### Register

- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "DONOR"
}
```

- **Response**: 201 Created with access and refresh tokens

#### Login

- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**: 200 OK with access and refresh tokens

#### Refresh Token

- **Endpoint**: `POST /api/v1/auth/refresh-token`
- **Request Body**:

```json
{
  "refreshToken": "refresh-token-value"
}
```

- **Response**: 200 OK with new access token

#### Health Check

- **Endpoint**: `GET /api/v1/auth/health`
- **Response**: 200 OK with "Service is running"

### 5. Security Configuration

- **Location**: `src/main/java/in/johnson/forkupmanna/config/SecurityConfig.java`
- **Features**:
  - Stateless session management
  - CORS and CSRF disabled for API
  - Custom JWT authentication filter
  - Swagger documentation endpoints are publicly accessible
  - All other endpoints require authentication

### 6. Custom UserDetailsService

- **Location**: `src/main/java/in/johnson/forkupmanna/config/CustomUserDetailsService.java`
- **Purpose**: Load user details from database for Spring Security

### 7. Global Exception Handler

- **Location**: `src/main/java/in/johnson/forkupmanna/exception/GlobalExceptionHandler.java`
- **Handled Exceptions**:
  - AppException: Custom application exceptions
  - MethodArgumentNotValidException: Validation errors
  - AccessDeniedException: Authorization failures
  - NoHandlerFoundException: 404 errors
  - General Exception: Unexpected errors

### 8. Swagger/OpenAPI Configuration

- **Location**: `src/main/java/in/johnson/forkupmanna/config/OpenApiConfig.java`
- **Features**:
  - API documentation available at `/swagger-ui.html`
  - JWT Bearer token support documented
  - All endpoints properly documented with OpenAPI 3.0

### 9. Flyway Database Migration

- **Location**: `src/main/resources/db/migration/V1__Create_Users_Table.sql`
- **Includes**:
  - Users table with UUID primary key
  - Support for all four user roles
  - Indexes on email, uuid, and role for performance
  - Proper collation for internationalization

### 10. DTOs for Data Transfer

- **RegisterRequest**: User registration data with validation
- **LoginRequest**: Login credentials
- **RefreshTokenRequest**: Refresh token
- **AuthResponse**: Authentication response with tokens
- **UserResponse**: User details in response
- **ErrorResponse**: Standardized error responses

## Testing

### Unit Tests

- **Location**: `src/test/java/in/johnson/forkupmanna/service/AuthServiceTest.java`
- **Coverage**: 8 test cases
  - Register success, duplicate email, invalid role
  - Login success, user not found, invalid password
  - Refresh token success and invalid token

**Run Tests**:

```bash
mvn test
```

## Database Setup

### Requirements

- MySQL 8.0+
- Database: `forkup_manna`

### Configuration

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/forkup_manna
spring.datasource.username=root
spring.datasource.password=your-password
```

### Create Database

```sql
CREATE DATABASE forkup_manna CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Flyway will automatically create the users table on first run.

## Build and Run

### Build the Project

```bash
mvn clean package
```

### Run the Application

```bash
java -jar target/ForkUp-Manna-0.0.1-SNAPSHOT.jar
```

Or using Maven:

```bash
mvn spring-boot:run
```

### Access Swagger UI

Open browser and navigate to:

```
http://localhost:8080/swagger-ui.html
```

## API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Donor",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "phone": "9876543210",
    "role": "DONOR"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Use Access Token in Protected Endpoints

```bash
curl -X GET http://localhost:8080/api/v1/protected-endpoint \
  -H "Authorization: Bearer <access-token>"
```

### Refresh Token

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh-token>"
  }'
```

## Project Structure

```
src/main/java/in/johnson/forkupmanna/
├── config/
│   ├── SecurityConfig.java
│   ├── CustomUserDetailsService.java
│   └── OpenApiConfig.java
├── controller/
│   └── AuthController.java
├── dto/
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── RefreshTokenRequest.java
│   ├── AuthResponse.java
│   ├── UserResponse.java
│   └── ErrorResponse.java
├── entity/
│   └── User.java
├── enums/
│   └── UserRole.java
├── exception/
│   ├── AppException.java
│   └── GlobalExceptionHandler.java
├── repository/
│   └── UserRepository.java
├── security/
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
├── service/
│   ├── AuthService.java
│   └── impl/
│       └── AuthServiceImpl.java
├── util/
│   └── Constants.java
└── ForkUpMannaApplication.java

src/main/resources/
├── application.properties
└── db/migration/
    └── V1__Create_Users_Table.sql
```

## Security Considerations

### Password Security

- Passwords are encrypted using BCrypt
- Minimum 8 characters required

### JWT Security

- HS512 signing algorithm used
- Secret key should be at least 32 characters in production
- Access tokens expire in 24 hours
- Refresh tokens expire in 7 days

### Input Validation

- All inputs are validated using Jakarta validation annotations
- Email format validation
- Required field validation

### CORS Configuration

- CORS is disabled for stateless API
- Cross-origin requests should use proper authentication headers

## Next Steps (Phase 2)

Phase 2 will implement:

- Donation Management
- Image Upload
- Search functionality

## Dependencies

- Spring Boot 3.x
- Spring Security 6.x
- Spring Data JPA
- JWT (JJWT 0.12.3)
- Lombok
- Flyway
- MySQL Connector
- SpringDoc OpenAPI

## Troubleshooting

### JWT Token Validation Fails

- Ensure the JWT secret in properties matches the one used to generate tokens
- Check token expiration time
- Verify Bearer token format in Authorization header

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in application.properties
- Ensure database exists

### Port Already in Use

- Change port in application.properties: `server.port=8081`
- Or kill the process using port 8080

## Performance Notes

- Database indexes on email, uuid, and role optimize query performance
- JWT tokens are stateless (no database lookup on each request)
- Refresh token rotation recommended for enhanced security in future phases
