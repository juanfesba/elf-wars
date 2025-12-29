# Stage 1: Builder stage (for fetching, installing Go, and compiling)
FROM golang:1.25.5-alpine AS builder

WORKDIR /builder

# Install Go (example using apk, as alpine uses it - for simple cases)
# RUN apk add --no-cache go

# If you need git for cloning
RUN apk add --no-cache git

# Clone the repository (replace with your repo URL)
RUN git clone https://github.com/juanfesba/elf-wars.git .

# Verifying when debugging
# RUN ls -l /builder/app

WORKDIR /builder/app/backend

# Compile the Go code (replace main.go with your main file if different)
RUN go build -o /builder/elf-wars main.go

# Stage 2: Final image (smaller and only contains the binary)
FROM alpine:latest

WORKDIR /app

# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /builder/elf-wars /app/elf-wars

# Expose the port if your application uses one (e.g., for a web server).
EXPOSE 8080

# Run the executable
CMD ["./elf-wars"]