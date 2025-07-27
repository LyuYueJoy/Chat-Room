# Connect Space

Connect Space is a social platform that allows users to register, send friend requests, get randomly matched, and chat in real-time using WebSocket technology.

## Features

- User registration and login with cookie authentication
- Send, accept, and reject friend requests
- Friend list management
- Random user matching for instant chat
- Real-time messaging via WebSocket
- Responsive UI built with Next.js and Material-UI

## Technology Stack

- Frontend: Next.js, React, TypeScript, Material-UI
- Backend: .NET Core Web API
- Real-time Communication: WebSocket
- Database: Entity Framework Core with SQL Server 
- Authentication: Cookie-based

## Getting Started

### Prerequisites

- Node.js
- .NET SDK 
- SQL Server database

### Installation & Running

1. **Backend**

````bash
cd backend
dotnet restore
dotnet build
dotnet run
````

2. **Frontend**

````bash
cd frontend
npm install
npm run dev
````