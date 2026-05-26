Example Google auth handler

This small example shows how to implement a minimal `/auth/google` endpoint
that verifies a Google ID token and returns an auth result for the frontend.

Usage:

1. Build and run the example server (requires Go 1.18+):

```bash
cd examples/backend/google_auth
go run main.go
```

2. The server listens on port 8080 by default. It exposes:

- `POST /auth/google` — accepts JSON `{ "id_token": "..." }` and returns
  JSON `{ "token": "...", "user": { id, name, email, role } }` on success.

Notes:
- This example uses the public `https://oauth2.googleapis.com/tokeninfo` endpoint
  to validate the ID token. In production, prefer Google's official libraries or
  validate tokens via your own OAuth2 library and issue your own server-signed
  session tokens.
- The example returns the received `id_token` back as `token` for simplicity.
  Replace that behavior with your own token issuance in real deployments.
