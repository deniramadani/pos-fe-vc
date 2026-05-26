package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// Simple example backend endpoint that verifies a Google ID token using
// Google's tokeninfo endpoint and returns a minimal auth result JSON.
// This is intended as an example only — in production verify tokens using
// Google's libraries and issue your own server-side session tokens.

type tokenRequest struct {
	IDToken string `json:"id_token"`
}

type googleTokenInfo struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Sub   string `json:"sub"`
}

type user struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type authResult struct {
	Token string `json:"token"`
	User  user   `json:"user"`
}

func authGoogleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var tr tokenRequest
	if err := json.NewDecoder(r.Body).Decode(&tr); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "invalid request: %v", err)
		return
	}

	if tr.IDToken == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "id_token is required")
		return
	}

	// Verify token with Google's tokeninfo endpoint
	tokenInfoURL := "https://oauth2.googleapis.com/tokeninfo?id_token=" + tr.IDToken
	resp, err := http.Get(tokenInfoURL)
	if err != nil {
		log.Printf("tokeninfo request failed: %v", err)
		w.WriteHeader(http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("tokeninfo error: %s", string(body))
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "invalid id_token")
		return
	}

	var info googleTokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		log.Printf("tokeninfo decode failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// For demonstration we return the received ID token as the server token.
	// Replace this with creation of a signed server JWT/session token in real use.
	userID := 0
	if info.Sub != "" {
		userID = int(info.Sub[len(info.Sub)-9:][0]) // cheap deterministic non-meaningful id
	}

	out := authResult{
		Token: tr.IDToken,
		User: user{
			ID:    userID,
			Name:  info.Name,
			Email: info.Email,
			Role:  "cashier",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(out)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/auth/google", authGoogleHandler)
	log.Printf("Example auth server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
