package main

import (
	"context"
	"discord-server/handlers"
	"discord-server/structs"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
)

type User structs.User

func main() {
	session := createCassandraSession()

	// Create a new router instance using Chi
	r := chi.NewRouter()

	// CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type"},
	})
	r.Use(c.Handler)

	// Define the route using Chi
	r.Post("/api/login", handlers.HandleLogin(session))

	// Create an HTTP server
	server := &http.Server{
		Addr:    ":8080", // Port where the server will listen
		Handler: r,
	}

	// Set up a channel to listen for system signals
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	// Start the server in a goroutine
	go func() {
		fmt.Println("Starting server on :8080...")
		server.ListenAndServe()
	}()

	// Wait for a signal to terminate the server
	<-signalChan

	fmt.Println("Gracefully shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	fmt.Println("Closing Cassandra session...")
	session.Close()

	if err := server.Shutdown(shutdownCtx); err != nil {
		fmt.Println("Server shutdown error:", err)
	}

	fmt.Println("Server gracefully stopped")
}
