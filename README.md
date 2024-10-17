# Assignmet

### Live Demo: https://merlin.quankento.art/

## Overview

This project is a [brief description of the application] built using **Node.js** and containerized with **Docker** for easy deployment. The application is deployed using **AWS** services such as **S3**, **CloudFront**, and **EC2**.

## Technology Stack

- **Node.js**: Backend runtime environment.
- **Docker**: Containerization for consistent environments.
- **AWS EC2**: For hosting the backend Node.js application.
- **Images Storage**: Cloudinary.

## Frontend

- **React + Vite**

## Deployment

- **AWS Route53**: To create record
- **AWS S3**: hold static file like built frontend folder
- **AWS CloudFront**: Content delivery network (CDN) for distributing content globally with low latency.

## Backend Structure

```bash
src
├── app.ts
├── config.ts
├── controllers/          # Handles request logic
│   ├── comment.ts
│   ├── photo.ts
│   └── user.ts
├── models/               # Database models
│   ├── comment.model.ts
│   ├── photo.model.ts
│   └── user.model.ts
├── routes/               # API routes
│   ├── comment.routes.ts
│   ├── photo.routes.ts
│   └── user.routes.ts
├── server.ts             # Server setup
├── services/             # Business logic services
│   ├── comment.service.ts
│   ├── photo.service.ts
│   └── user.service.ts
├── setupDatabase.ts      # Database configuration
└── shared/               # Shared utilities
    └── helpers/
        ├── cloudinary-upload.ts
        └── error-handler.ts
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Docker** installed on your local machine.
- **Cloudinary Account**: CLOUD_NAME, API_KEY, API_SECRET
- **Node.js** (version 18.20.4 or above) installed on your machine.

## Getting Started

## Backend

### 1. Clone the Repository

```bash
git clone https://github.com/quan0401/job-assignment-backend
cd job-assignment-backend
```

### 2. Install Dependencies and postgres using docker

Install the required Node.js packages:

```bash
npm install
docker-compose up -d
```

### 3. Run the Application Locally

You can run the application locally using Node.js:

```bash
npm run dev
```

The backend will be accessible at `http://localhost:5001`.

## Frontend

### 1. Clone the Repository

```bash
git clone https://github.com/quan0401/job-assignment-frontend
cd job-assignment-frontend
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 3. Run the Application Locally

You can run the application locally using Node.js:

```bash
npm run dev
```

The frontend will be accessible at `http://localhost:3001`.
