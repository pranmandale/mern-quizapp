# Quiz Application Backend API

## Overview
This is the backend API for the Quiz Application, which provides user authentication, quiz creation, quiz attempts, and leaderboard features.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication Endpoints

### Register User
**Endpoint:** `POST /users/register`

**Request Body:**
```json
{
    "fullName": "John Doe",
    "email": "johndoe@gmail.com",
    "username": "john123",
    "password": "securepassword"
}
```

### Login User
**Endpoint:** `POST /users/login`

**Request Body:**
```json
{
    "username": "john123",
    "password": "securepassword"
}
```

### Get Current User
**Endpoint:** `GET /users/current-user`

### Change Password
**Endpoint:** `POST /users/change-password`

**Request Body:**
```json
{
    "oldPassword": "oldpassword",
    "newPassword": "newpassword"
}
```

### Update Account
**Endpoint:** `PATCH /users/update-account`

**Request Body:**
```json
{
    "fullName": "John Updated"
}
```

### Refresh Token
**Endpoint:** `POST /users/refresh-token`

### Get Quiz History
**Endpoint:** `GET /users/quiz-history`

### Logout
**Endpoint:** `POST /users/logout`

---

## Quiz Endpoints

### Create Quiz
**Endpoint:** `POST /quizzes/create`

**Request Body:**
```json
{
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge",
    "timeLimit": 30,
    "questions": [
        {
            "questionText": "What is JavaScript?",
            "options": [
                "A programming language",
                "A markup language",
                "A styling language",
                "A database"
            ],
            "correctAnswerIndex": 0,
            "explanation": "JavaScript is a programming language"
        }
    ]
}
```

### Submit Quiz
**Endpoint:** `GET /quizzes/{quizId}/attempt`

**Request Body:**
```json
{
    "answers": [
        {
            "questionId": "6739868fa6a9e12773db176d",
            "selectedOptionIndex": 0
        }
    ]
}
```

### Get My Quizzes
**Endpoint:** `GET /quizzes/my-quizzes`

### Get Quiz by ID
**Endpoint:** `GET /quizzes/{quizId}`

### Update Quiz
**Endpoint:** `PATCH /quizzes/{quizId}/update`

**Request Body:**
```json
{
    "title": "Updated JavaScript Basics",
    "description": "Updated description",
    "timeLimit": 45,
    "questions": [
        {
            "questionText": "What is JavaScript?",
            "options": [
                "A programming language",
                "A markup language",
                "A styling language",
                "A database"
            ],
            "correctAnswerIndex": 0,
            "explanation": "JavaScript is a programming language"
        }
    ]
}
```

### Get Leaderboard
**Endpoint:** `GET /quizzes/{quizId}/leaderboard`

### Get User Quiz Attempts
**Endpoint:** `GET /quizzes/user/attempts`

### Delete Quiz
**Endpoint:** `DELETE /quizzes/{quizId}/delete`

### Get Quiz Result
**Endpoint:** `GET /quizzes/attempt/{attemptId}/results`

---

## Notes
- Replace `{quizId}` and `{attemptId}` with actual values.
- The API uses token-based authentication for protected routes.

## License
This project is licensed under the MIT License.

