# Community Platform (Micro Frontends + Microservices)

Full-stack assignment project for Software Engineering Technology.

This solution implements:
- Micro Frontends using React, Vite, and Module Federation
- Microservices using Express, Apollo Server, and GraphQL
- MongoDB persistence for users, community posts, and help requests
- JWT-based authentication with password hashing

## 1) Project Structure

- host-app: Shell application that composes remote frontends
- auth-frontend: Authentication micro frontend (signup, login, logout)
- community-frontend: Community micro frontend (news, discussions, help requests)
- auth-service: Authentication GraphQL microservice
- community-service: Community GraphQL microservice

## 2) Tech Stack

Frontend:
- React 18
- Vite 5
- @originjs/vite-plugin-federation
- Apollo Client

Backend:
- Node.js + Express
- Apollo Server 4
- GraphQL
- Mongoose
- bcryptjs
- jsonwebtoken

Database:
- MongoDB Atlas (or local MongoDB)

## 3) Architecture Overview

1. Host app runs at port 3000 and dynamically loads:
   - auth frontend from port 3001
   - community frontend from port 3002
2. Auth frontend communicates with auth-service (port 4001)
3. Community frontend communicates with community-service (port 4002)
4. Both services use JWT for protected operations

## 4) Ports

- Host App: 3000
- Auth Frontend: 3001
- Community Frontend: 3002
- Auth Service: 4001
- Community Service: 4002

## 5) Environment Variables

Create these files locally (already ignored by git):
- auth-service/.env
- community-service/.env

Template for auth-service/.env

    PORT=4001
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_long_random_secret_min_32_chars
    JWT_EXPIRES_IN=24h

Template for community-service/.env

    PORT=4002
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=same_secret_as_auth_service

Important:
- JWT_SECRET must be identical in both services.
- Do not commit real secrets.

## 6) Install Dependencies

From each folder, run npm install:
- auth-service
- community-service
- auth-frontend
- community-frontend
- host-app

## 7) Run the Project

Use separate terminals.

A) Start backend services

Terminal 1:

    cd auth-service
    npm run dev

Terminal 2:

    cd community-service
    npm run dev

B) Build and preview frontends for federation

Terminal 3:

    cd auth-frontend
    npm run build
    npm run preview

Terminal 4:

    cd community-frontend
    npm run build
    npm run preview

Terminal 5:

    cd host-app
    set VITE_PREVIEW=true
    npm run build
    npm run preview

Then open:
- http://localhost:3000

## 8) GraphQL APIs

Auth Service endpoint:
- http://localhost:4001/graphql

Auth operations:
- signup(username, email, password, role)
- login(email, password)
- logout
- me

Community Service endpoint:
- http://localhost:4002/graphql

Community operations:
- posts(category)
- post(id)
- helpRequests(resolved)
- helpRequest(id)
- createPost(title, content, category)
- updatePost(id, title, content, aiSummary)
- deletePost(id)
- createHelpRequest(description, location)
- resolveHelpRequest(id)
- volunteerForRequest(id)

## 9) Assignment Coverage Checklist

Exercise 1 requirements status:

Backend Development:
- User Authentication Microservice: Completed
- MongoDB User schema: Completed
- signup/login/logout GraphQL mutations: Completed
- Secure password hashing: Completed
- Community Engagement Microservice: Completed
- CommunityPost and HelpRequest schemas: Completed
- Queries and mutations for interactions: Completed

Initial Frontend Development:
- Authentication Micro Frontend: Completed
- Community Engagement Micro Frontend: Completed
- Apollo Client integration: Completed
- Functional components + hooks: Completed

Integration:
- Vite Module Federation host/remotes: Completed

UI/UX:
- Styled and user-friendly pages with custom CSS: Completed

## 10) Demo Script (For Class Presentation)

Recommended short flow:
1. Open host app at http://localhost:3000
2. Sign up with a new role and log in
3. Show community tabs: News, Discussions, Help Requests
4. Create one news post
5. Create one discussion post
6. Create one help request
7. Volunteer on an open request from another account (optional)
8. Resolve your own help request
9. Log out and show protected behavior
10. Briefly explain architecture and GraphQL service split

## 11) Notes

- CORS package is intentionally not used. Services apply manual Access-Control headers.
- If remoteEntry path errors appear, rebuild remotes and host, then restart previews.
- If old UI text appears, clear browser cache (Ctrl + F5).

## 12) GitHub

Repository:
- https://github.com/varunvora05/Community-platform

Push updates:

    git add .
    git commit -m "Update project documentation"
    git push
