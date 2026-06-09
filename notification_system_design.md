# Stage 1: API Design

## Introduction

The purpose of this notification system is to send important updates to students. These notifications can be related to placements, exam results, events, workshops, internships, and other college activities.

Students should be able to view notifications, check unread notifications, and mark them as read.

---

## Main Features

The notification system should support the following operations:

1. View all notifications.
2. View only unread notifications.
3. View a particular notification.
4. Mark a notification as read.
5. Mark all notifications as read.
6. Check notification summary.
7. Receive notifications in real time.

---

## API Endpoints

### 1. Get All Notifications

**Endpoint**

```http
GET /api/notifications
```

**Headers**

```http
Authorization: Bearer <token>
```

**Query Parameters**

```text
page=1
limit=20
```

**Response**

```json
{
  "notifications": [
    {
      "id": "n101",
      "type": "Placement",
      "title": "Microsoft Hiring Drive",
      "message": "Applications are now open.",
      "isRead": false,
      "createdAt": "2026-06-09T09:00:00Z"
    }
  ]
}
```

---

### 2. Get Unread Notifications

**Endpoint**

```http
GET /api/notifications/unread
```

**Headers**

```http
Authorization: Bearer <token>
```

**Response**

```json
{
  "count": 5,
  "notifications": [
    {
      "id": "n102",
      "type": "Result",
      "title": "Semester Result Published",
      "isRead": false
    }
  ]
}
```

---

### 3. Get Notification By ID

**Endpoint**

```http
GET /api/notifications/:id
```

**Example**

```http
GET /api/notifications/n101
```

**Response**

```json
{
  "id": "n101",
  "type": "Placement",
  "title": "Microsoft Hiring Drive",
  "message": "Applications are now open.",
  "isRead": false,
  "createdAt": "2026-06-09T09:00:00Z"
}
```

---

### 4. Mark Notification as Read

**Endpoint**

```http
PATCH /api/notifications/:id/read
```

**Response**

```json
{
  "message": "Notification marked as read"
}
```

---

### 5. Mark All Notifications as Read

**Endpoint**

```http
PATCH /api/notifications/read-all
```

**Response**

```json
{
  "message": "All notifications marked as read"
}
```

---

### 6. Notification Summary

This API provides a quick summary of notification counts.

**Endpoint**

```http
GET /api/notifications/summary
```

**Response**

```json
{
  "totalNotifications": 120,
  "unreadNotifications": 12,
  "readNotifications": 108
}
```

---

## Notification Structure

Each notification will have the following fields:

| Field     | Description                |
| --------- | -------------------------- |
| id        | Unique notification ID     |
| studentId | ID of the student          |
| type      | Placement, Result or Event |
| title     | Notification title         |
| message   | Detailed message           |
| isRead    | Read status                |
| createdAt | Notification creation time |

Example:

```json
{
  "id": "n101",
  "studentId": 1042,
  "type": "Placement",
  "title": "Microsoft Hiring Drive",
  "message": "Applications are now open.",
  "isRead": false,
  "createdAt": "2026-06-09T09:00:00Z"
}
```

---

## Notification Categories

| Type      | Description                                     |
| --------- | ----------------------------------------------- |
| Placement | Job drives, internships and recruitment updates |
| Result    | Semester results and academic updates           |
| Event     | Workshops, seminars and college events          |

---

## Status Codes

| Status Code | Meaning                        |
| ----------- | ------------------------------ |
| 200         | Request completed successfully |
| 201         | New resource created           |
| 400         | Invalid request                |
| 401         | Unauthorized user              |
| 404         | Resource not found             |
| 500         | Internal server error          |

---

## Real-Time Notifications

For real-time updates, I would use **Server-Sent Events (SSE)**.

SSE is a good choice because the server only needs to send notifications to students. It is simpler than WebSockets and works well for this use case.

**Endpoint**

```http
GET /api/notifications/stream
```

Example event:

```text
data: {
  "id": "n501",
  "type": "Placement",
  "title": "Google Hiring Drive",
  "message": "Applications are now open."
}
```

### Advantages

* Easy to implement
* Works over normal HTTP
* Good for notification systems
* Lightweight compared to WebSockets

### Limitation

* Communication is one-way (server to client only)

---

## Assumptions

1. Students are already authenticated.
2. Every notification belongs to a student.
3. Notifications are stored in a database.
4. Notifications can be marked as read or unread.
5. Real-time updates are delivered using SSE.


