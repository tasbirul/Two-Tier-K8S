# Angular + .NET Hello World

A simple full-stack application with an **Angular** frontend and **.NET 8 Web API** backend.

## Project Structure

```
angular-dotnet/
├── api/          # .NET 8 Web API backend
│   ├── Program.cs
│   ├── api.csproj
│   └── Controllers/
│       └── HelloController.cs
├── client/       # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts
│   │   │   └── app.config.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── proxy.conf.json
│   └── angular.json
└── README.md
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node.js)

## Getting Started

### 1. Start the Backend API

```bash
cd api
dotnet run
```

The API will start on **http://localhost:5000**.

You can test it with:
```bash
curl http://localhost:5000/api/hello
# Response: {"message":"Hello from .NET!"}
```

### 2. Start the Frontend

In a new terminal:

```bash
cd client
npm start
```

The Angular app will start on **http://localhost:4200** and proxy API requests to the backend.

## API Endpoints

| Method | URL          | Description               |
|--------|-------------|---------------------------|
| GET    | `/api/hello` | Returns a hello message   |
