package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/gocql/gocql"
	"github.com/rs/cors"
)

type GetUserResponse struct {
	Username string `json:"username"`
	Age      int    `json:"age"`
}

func getUsersHandler(session *gocql.Session) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		users, err := getAllUsers(session)
		if err != nil {
			http.Error(w, "Failed to get users", http.StatusInternalServerError)
			return
		}

		response := make([]GetUserResponse, 0, len(users))

		for _, user := range users {
			userMap := GetUserResponse{
				Username: user.username,
				Age:      user.age,
			}
			response = append(response, userMap)
		}

		json.NewEncoder(w).Encode(response)
	}
}

type PostUserRequest struct {
	Username string `json:"username"`
	Age      int    `json:"age"`
}

func postUserHandler(session *gocql.Session) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		fmt.Println("Received POST request")

		// Read the request body
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// Declare a variable of type User to hold the unmarshalled data
		var userRequest PostUserRequest

		// Unmarshal the body into the user struct
		err = json.Unmarshal(body, &userRequest)
		if err != nil {
			http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
			return
		}

		if userRequest.Username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
		} else if userRequest.Age <= 0 {
			http.Error(w, "Age must be greater than 0", http.StatusBadRequest)
			return
		}

		// Create a new user
		user := User{
			id:       gocql.TimeUUID(),
			username: userRequest.Username,
			age:      userRequest.Age,
		}

		// Insert the user into the database
		_, err = insertUser(session, user)
		if err != nil {
			http.Error(w, "Failed to insert user", http.StatusInternalServerError)
			return
		}

	}
}

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
	r.Get("/api/users", getUsersHandler(session))

	// Define the POST route
	r.Post("/api/user", postUserHandler(session))

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
