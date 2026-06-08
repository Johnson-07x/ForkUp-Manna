# ForkUp Manna

## Transforming Surplus Food into Hope

ForkUp Manna is a social impact platform designed to reduce food waste and fight hunger by connecting food donors with orphanages, old-age homes, NGOs, shelters, and volunteers.

The platform enables restaurants, hotels, wedding halls, bakeries, supermarkets, and individuals to donate surplus food safely and efficiently, ensuring that edible food reaches people in need rather than ending up as waste.

---

# Table of Contents

- Project Vision
- Problem Statement
- Solution Overview
- Key Objectives
- User Roles
- System Workflow
- Features
- Technology Stack
- System Architecture
- Database Design
- Backend Architecture
- Frontend Architecture
- API Design Standards
- Security Requirements
- Functional Requirements
- Non-Functional Requirements
- Development Roadmap
- Future Enhancements

---

# Project Vision

To create a scalable and transparent food redistribution ecosystem that minimizes food wastage while helping underprivileged communities access nutritious food.

---

# Problem Statement

Millions of tons of food are wasted every year while many people struggle with hunger.

Common sources of food waste include:

- Restaurants
- Hotels
- Wedding Halls
- Caterers
- Supermarkets
- Bakeries
- Households

At the same time:

- Orphanages require food support
- Old age homes face food shortages
- NGOs struggle to collect food donations
- Shelters lack reliable food supply

There is no centralized platform that efficiently connects surplus food providers with organizations in need.

---

# Solution Overview

ForkUp Manna acts as a bridge between:

## Food Donors

- Restaurants
- Hotels
- Wedding Halls
- Bakeries
- Supermarkets
- Individuals

## Food Receivers

- Orphanages
- Old Age Homes
- NGOs
- Community Kitchens
- Shelters

## Volunteers

- Food Collection Volunteers
- Delivery Volunteers

## Administrators

- System Monitoring
- Verification
- Reporting
- User Management

---

# Key Objectives

1. Reduce food wastage.
2. Support hunger relief initiatives.
3. Ensure food safety and traceability.
4. Enable transparent donation tracking.
5. Improve food redistribution efficiency.
6. Generate measurable social impact.

---

# User Roles

## ADMIN

Responsibilities:

- Manage users
- Verify organizations
- Verify donors
- Manage reports
- Monitor donations
- Block malicious users
- View analytics

---

## DONOR

Examples:

- Restaurants
- Hotels
- Wedding Halls
- Caterers
- Individuals

Capabilities:

- Register
- Login
- Manage profile
- Create food donations
- Upload food images
- Track donation status
- View donation history

---

## RECEIVER

Examples:

- Orphanages
- NGOs
- Old Age Homes
- Shelters

Capabilities:

- Register
- Login
- View nearby donations
- Claim donations
- Confirm food receipt
- View donation history

---

## VOLUNTEER

Capabilities:

- Register
- Login
- Accept delivery tasks
- Pickup food
- Deliver food
- Update delivery status

---

# System Workflow

## Donation Lifecycle

### Step 1

Donor creates donation.

Status:

```text
AVAILABLE
```

### Step 2

Receiver claims donation.

Status:

```text
CLAIMED
```

### Step 3

Volunteer accepts delivery task.

Status:

```text
PICKUP_ASSIGNED
```

### Step 4

Volunteer picks up food.

Status:

```text
PICKED_UP
```

### Step 5

Food delivered.

Status:

```text
DELIVERED
```

### Step 6

Receiver confirms receipt.

Status:

```text
COMPLETED
```

---

# Core Features

## Authentication Module

Features:

- User Registration
- Login
- Logout
- JWT Authentication
- Refresh Token
- Forgot Password
- Reset Password
- Email Verification
- Role-Based Access Control

---

## User Profile Management

Profile Information:

- Name
- Email
- Phone Number
- Organization Name
- Address
- City
- State
- Pincode
- Latitude
- Longitude
- Profile Picture

---

## Donation Management

Donors can:

- Create donation
- Upload food images
- Update donation
- Delete donation
- Track donation status

Donation Details:

- Food Name
- Description
- Quantity
- Unit
- Food Type
- Preparation Time
- Expiry Time
- Pickup Address
- Latitude
- Longitude
- Images

Food Categories:

- Vegetarian
- Non-Vegetarian
- Bakery
- Fruits
- Vegetables
- Packaged Food

---

## Claim Management

Receivers can:

- Browse donations
- Search donations
- Claim donations
- Cancel claims

---

## Volunteer Management

Volunteers can:

- View assigned tasks
- Accept tasks
- Mark pickup complete
- Mark delivery complete

---

## Notification System

Events:

- Donation Created
- Donation Claimed
- Volunteer Assigned
- Food Picked Up
- Food Delivered
- Donation Completed

Channels:

- Email
- In-App Notifications

Future:

- SMS
- WhatsApp

---

## Search and Discovery

Filters:

- Food Type
- Distance
- Availability
- Date
- Quantity
- Organization

---

## Nearby Donation Discovery

Location Based Search using:

- Latitude
- Longitude
- Haversine Formula

Distance Filters:

- 5 KM
- 10 KM
- 20 KM
- 50 KM

---

## Food Safety Module

Donors must provide:

- Preparation Time
- Expiry Time
- Storage Conditions

System automatically marks food as:

```text
EXPIRED
```

when expiry time is reached.

---

## Dashboard and Analytics

Metrics:

- Total Donations
- Total Meals Saved
- Total Food Waste Reduced
- Active Donors
- Active NGOs
- Active Volunteers
- Completed Deliveries

---

# Technology Stack

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Lombok
- MapStruct
- Flyway
- Swagger/OpenAPI

---

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- React Query
- Material UI

---

## Database

- MySQL 8

---

## File Storage

- Cloudinary

Alternative:

- AWS S3

---

## Maps

- OpenStreetMap
- Leaflet.js

---

## Deployment

Backend:

- Docker
- Railway
- Render
- AWS

Frontend:

- Vercel
- Netlify

Database:

- MySQL

---

# System Architecture

```text
Frontend (React)
        |
        |
REST API
        |
        |
Spring Boot Backend
        |
 ---------------------
 |         |         |
MySQL   Cloudinary  Email
Database  Storage  Service
```

---

# Backend Architecture

Follow Clean Architecture principles.

```text
src/main/java/in/johnson/forkupmanna

├── auth
├── user
├── donor
├── receiver
├── volunteer
├── donation
├── claim
├── delivery
├── notification
├── dashboard
├── common
├── security
├── config
├── exception
└── util
```

Each module contains:

```text
controller
service
service/impl
repository
entity
dto
mapper
```

---

# Database Design

## users

```sql
id
uuid
name
email
password
phone
role
status
created_at
updated_at
```

## donor_profiles

```sql
id
user_id
organization_name
organization_type
address
latitude
longitude
```

## receiver_profiles

```sql
id
user_id
organization_name
organization_type
address
latitude
longitude
```

## volunteer_profiles

```sql
id
user_id
vehicle_type
availability_status
```

## donations

```sql
id
donor_id
food_name
description
quantity
unit
food_type
prepared_time
expiry_time
status
latitude
longitude
created_at
updated_at
```

## donation_images

```sql
id
donation_id
image_url
```

## claims

```sql
id
donation_id
receiver_id
claim_time
status
```

## deliveries

```sql
id
claim_id
volunteer_id
pickup_time
delivery_time
status
```

## notifications

```sql
id
user_id
title
message
is_read
created_at
```

---

# API Design Standards

Base URL

```http
/api/v1
```

Examples

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/donations
POST   /api/v1/donations

GET    /api/v1/donations/{id}
PUT    /api/v1/donations/{id}
DELETE /api/v1/donations/{id}

POST   /api/v1/claims
GET    /api/v1/claims

POST   /api/v1/deliveries
```

---

# Frontend Architecture

```text
src

├── api
├── assets
├── components
├── context
├── hooks
├── layouts
├── pages
├── routes
├── services
├── types
├── utils
```

---

# Pages

## Public

- Home
- About
- Contact
- Login
- Register

## Donor

- Dashboard
- Create Donation
- My Donations
- Profile

## Receiver

- Dashboard
- Nearby Donations
- Claims
- Profile

## Volunteer

- Dashboard
- Assigned Deliveries
- History
- Profile

## Admin

- Dashboard
- User Management
- Donations
- Reports
- Analytics
- Settings

---

# Security Requirements

Mandatory:

- JWT Authentication
- Refresh Tokens
- BCrypt Password Encryption
- Role-Based Authorization
- Input Validation
- Global Exception Handling
- Rate Limiting
- Secure CORS Configuration
- SQL Injection Protection
- XSS Protection

---

# Functional Requirements

### FR-01

User registration and authentication.

### FR-02

Food donation creation.

### FR-03

Donation discovery based on location.

### FR-04

Donation claiming.

### FR-05

Volunteer assignment.

### FR-06

Food delivery tracking.

### FR-07

Notification management.

### FR-08

Impact analytics dashboard.

---

# Non-Functional Requirements

### Performance

API response time below 500ms.

### Scalability

Support thousands of users.

### Availability

99% uptime.

### Security

Secure authentication and authorization.

### Maintainability

Clean architecture and modular design.

---

# Development Roadmap

## Phase 1

Authentication & User Management

Modules:

- User
- Role
- Security
- JWT

---

## Phase 2

Donation Management

Modules:

- Donation
- Image Upload
- Search

---

## Phase 3

Claim Management

Modules:

- Claims
- Donation Status Tracking

---

## Phase 4

Volunteer Management

Modules:

- Delivery Assignment
- Delivery Tracking

---

## Phase 5

Notifications

Modules:

- Email
- In-App Notifications

---

## Phase 6

Location Services

Modules:

- Nearby Search
- Maps Integration

---

## Phase 7

Analytics

Modules:

- Dashboard
- Reports
- Impact Metrics

---

## Phase 8

Deployment

Modules:

- Docker
- CI/CD
- Production Deployment

---

# Future Enhancements

- Flutter Mobile Application
- AI Demand Prediction
- Smart Donation Matching
- Route Optimization
- QR Code Verification
- Real-Time Tracking
- WhatsApp Integration
- Multilingual Support
- Carbon Footprint Analytics
- Government Collaboration Portal

---

# Expected Impact

ForkUp Manna aims to become a scalable social-impact platform capable of:

- Reducing food wastage
- Feeding underprivileged communities
- Helping NGOs manage food donations
- Creating measurable social impact
- Building a sustainable food redistribution ecosystem

---

## Developed By

Johnson AJ

Final Year Computer Science Engineering Student

Project Name: ForkUp Manna

Mission:

"Every Meal Matters. Every Life Matters."
