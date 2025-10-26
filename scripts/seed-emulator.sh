#!/bin/bash

# Import sample data to Firestore emulator
firebase emulators:exec --only firestore '
  curl -X POST "http://localhost:8080/emulator/v1/projects/competition-registration-e8597/databases/(default)/documents/competitions" \
  -H "Content-Type: application/json" \
  -d "{
    \"fields\": {
      \"name\": {\"stringValue\": \"Math Olympiad 2025\"},
      \"date\": {\"stringValue\": \"2025-03-15\"},
      \"location\": {\"stringValue\": \"Roosevelt High School\"},
      \"description\": {\"stringValue\": \"Annual math olympiad for all grade levels. Test your problem-solving skills!\"},
      \"registrationFee\": {\"doubleValue\": 25.00},
      \"createdAt\": {\"timestampValue\": \"2025-01-01T00:00:00Z\"}
    }
  }"

  curl -X POST "http://localhost:8080/emulator/v1/projects/competition-registration-e8597/databases/(default)/documents/competitions" \
  -H "Content-Type: application/json" \
  -d "{
    \"fields\": {
      \"name\": {\"stringValue\": \"Elementary Math Challenge\"},
      \"date\": {\"stringValue\": \"2025-04-10\"},
      \"location\": {\"stringValue\": \"Lincoln Elementary\"},
      \"description\": {\"stringValue\": \"Fun math competition designed for elementary school students.\"},
      \"registrationFee\": {\"doubleValue\": 15.00},
      \"createdAt\": {\"timestampValue\": \"2025-01-01T00:00:00Z\"}
    }
  }"
'