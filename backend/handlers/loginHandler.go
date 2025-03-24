package handlers

import (
	"discord-server/queries"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gocql/gocql"
)

type LoginRequest struct {
	Username string 
	Password string
}

func HandleLogin(session *gocql.Session) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var loginRequest LoginRequest
		
		// Unmarshal the body into the user struct
		err = json.Unmarshal(body, &loginRequest)
		if err != nil {
			http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
			return
		}

		if loginRequest.Username == "" || loginRequest.Password == "" {
			if(loginRequest.Username == "") {
				http.Error(w, "Username is required for authentication", http.StatusBadRequest)
			}
			if(loginRequest.Password == "") {
				http.Error(w, "Password is required for authentication", http.StatusBadRequest)
			}
			return
		} 

		valid, err := queries.AuthenticateUser(session, loginRequest.Username, loginRequest.Password)
		if err != nil {
			json.NewEncoder(w).Encode(false)
			return
		}

		json.NewEncoder(w).Encode(valid)
	}
}
