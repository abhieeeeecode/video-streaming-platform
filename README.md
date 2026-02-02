## Video Streaming & Content Management Platform

A full-stack, role-based video streaming platform inspired by real-world creator studios and OTT CMS systems.
Built with scalability, security, and clean UX in mind.

 Supports Admin, Editor, and Viewer role
 Video upload, streaming, moderation, analytics, and soft delete
 Designed with a cinematic glassmorphism UI


 ## Live Links : 
 
->  Frontend (UI):  http://localhost:5173/
->  Backend  (API) : http://localhost:5000/


 ## working Video (LINK)  :  https://1drv.ms/f/c/3b5584b798763e13/IgDDvguu95IaQYTTVGGJ_camARzTpwlfivvoE9terv-l0XU?e=CQseKy
 



## What This Application Does

This platform allows creators and admins to upload, manage, moderate, and stream videos, while viewers can safely consume approved content.

It mimics real production platforms like:

YouTube Studio

Netflix CMS

OTT moderation dashboards



## User Roles & Permissions (RBAC)
1.Admin :

- Upload videos

- View all videos (safe, flagged, deleted)

- Approve / Reject videos

- Soft delete & restore videos

- View analytics

- Manage platform content

2.Editor :

- Upload videos

- View and manage only their own videos

- Cannot approve or reject content

- Waits for admin moderation

3.Viewer

- View only safe & approved videos

- No upload or management access



## Core Features

## Video Upload & Streaming

Secure video uploads using multer

Chunk-based video streaming with HTTP range requests

Real-time processing simulation (safe / flagged)

## Authentication & Security

JWT-based authentication

Role-based access control (RBAC)

Protected routes (frontend + backend)

Token stored securely in localStorage

## Analytics Dashboard

Total uploads

Safe vs flagged videos

Visual analytics charts

Real-time updates via polling

## UI / UX

Glassmorphism cards

Dark, cinematic theme

Smooth transitions & hover effects

Clean, modern creator-focused layout


## Tech Stack
## Frontend

React (Vite)

React Router

Axios

Custom Glassmorphism CSS

Recharts (Analytics)

## Framer Motion (animations – optional extension)

## Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (file uploads)

## Database

MongoDB

Mongoose schemas for Users & Videos



## Project Structure


video-streaming-platform/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProfileMenu.jsx
│   │   │   └── Analytics.jsx
│   │   ├── styles/
│   │   │   └── glass.css
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   ├── middleware/
│   │   ├── verifyToken.js
│   │   └── allowRoles.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md




## How the Application Works (Flow)

1️⃣ User logs in → JWT token issued
2️⃣ Role decoded from token
3️⃣ UI & API access controlled by role
4️⃣ Uploads stored locally + metadata in MongoDB
5️⃣ Videos processed → marked safe / flagged
6️⃣ Admin moderates content
7️⃣ Viewers see only safe videos
8️⃣ Deleted videos are hidden but restorable





## Sample Test Accounts :
-> Admin:
email: admin@test.com
password: 123456

-> Editor:
email: editor@test.com
password: 123456

-> Viewer:
email: viewer@test.com
password: 123456




## How to Run Locally :
## Backend
-> cd backend
-> npm install
-> npm run dev

## Frontend :
cd frontend
npm install
npm run dev


## Final Note

This project was built to learn real-world system design, not just UI.
It demonstrates:

-> Clean backend architecture

-> Secure role-based access

-> Scalable content moderation logic

-> Production-style frontend patterns

If you like this project, ⭐ the repo it motivates future improvements :)






