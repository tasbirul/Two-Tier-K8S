# Stage 1: Build the Angular frontend
FROM node:22-alpine AS client-build

WORKDIR /app/client

# Layer 1: Install dependencies (cached unless package files change)
COPY client/package.json client/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Layer 2: Copy source and build
COPY client/ ./
RUN npx ng build --configuration=production


# Stage 2: Restore .NET dependencies (separate layer for caching)
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS dotnet-restore

WORKDIR /app/api

# Layer 1: Restore NuGet packages (cached unless .csproj changes)
COPY api/api.csproj ./
RUN dotnet restore


# Stage 3: Build and publish the .NET API
FROM dotnet-restore AS dotnet-build

# Layer 2: Copy source and publish
COPY api/ ./
RUN dotnet publish -c Release -o /app/publish --no-restore


# Stage 4: Final minimal runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final

# Security: run as non-root user
RUN addgroup -g 1000 appgroup && adduser -u 1000 -S appuser -G appgroup

WORKDIR /app

# Copy published .NET app
COPY --from=dotnet-build /app/publish ./

# Copy Angular static files into wwwroot
COPY --from=client-build /app/client/dist/client/browser ./wwwroot/

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true

ENTRYPOINT ["dotnet", "api.dll"]
