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



# Stage 2: Database Design

## Database Choice

For this system, I would use **PostgreSQL**.

Reasons:

* Notification data is structured.
* Relationships between students and notifications can be easily managed.
* PostgreSQL provides indexing and query optimization features.
* It handles large amounts of data efficiently.

---

# Database Tables

## 1. Students Table

This table stores basic student information.

| Column     | Type         | Description          |
| ---------- | ------------ | -------------------- |
| student_id | INTEGER      | Unique student ID    |
| name       | VARCHAR(100) | Student name         |
| email      | VARCHAR(100) | Student email        |
| branch     | VARCHAR(50)  | Student branch       |
| created_at | TIMESTAMP    | Record creation time |

### Schema

```sql
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Notifications Table

This table stores notification details.

| Column          | Type         | Description                |
| --------------- | ------------ | -------------------------- |
| notification_id | UUID         | Unique notification ID     |
| type            | VARCHAR(20)  | Placement, Result or Event |
| title           | VARCHAR(255) | Notification title         |
| message         | TEXT         | Notification content       |
| created_at      | TIMESTAMP    | Notification creation time |

### Schema

```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Student Notifications Table

A notification may be sent to many students, and each student can receive many notifications.

This table stores that mapping and read status.

| Column          | Type      | Description                     |
| --------------- | --------- | ------------------------------- |
| id              | SERIAL    | Unique row ID                   |
| student_id      | INTEGER   | Student ID                      |
| notification_id | UUID      | Notification ID                 |
| is_read         | BOOLEAN   | Read status                     |
| read_at         | TIMESTAMP | Time when notification was read |

### Schema

```sql
CREATE TABLE student_notifications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(student_id),
    notification_id UUID REFERENCES notifications(notification_id),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP
);
```

---

# Relationship Diagram

```text
Students
    |
    |
    v
Student_Notifications
    ^
    |
    |
Notifications
```

A student can receive many notifications.

A notification can be sent to many students.

---

# Common Queries

## Get All Notifications for a Student

```sql
SELECT n.notification_id,
       n.type,
       n.title,
       n.message,
       sn.is_read,
       n.created_at
FROM student_notifications sn
JOIN notifications n
ON sn.notification_id = n.notification_id
WHERE sn.student_id = 1042
ORDER BY n.created_at DESC;
```

---

## Get Unread Notifications

```sql
SELECT n.notification_id,
       n.title,
       n.type,
       n.created_at
FROM student_notifications sn
JOIN notifications n
ON sn.notification_id = n.notification_id
WHERE sn.student_id = 1042
AND sn.is_read = FALSE
ORDER BY n.created_at DESC;
```

---

## Mark Notification as Read

```sql
UPDATE student_notifications
SET is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE student_id = 1042
AND notification_id = 'notification-id';
```

---

## Count Unread Notifications

```sql
SELECT COUNT(*)
FROM student_notifications
WHERE student_id = 1042
AND is_read = FALSE;
```

---

# Scaling Considerations

As the number of students and notifications increases, the database size will also grow.

To maintain performance:

1. Create indexes on frequently queried columns.
2. Use pagination when fetching notifications.
3. Avoid returning large datasets in a single request.
4. Archive very old notifications if required.

Example indexes:

```sql
CREATE INDEX idx_student_notifications_student
ON student_notifications(student_id);

CREATE INDEX idx_student_notifications_read
ON student_notifications(is_read);

CREATE INDEX idx_notifications_created_at
ON notifications(created_at DESC);
```

---

# Why This Design?

I chose this design because it keeps notification information separate from student-specific information.

The notifications table stores notification content only once, while the student_notifications table stores which student received the notification and whether it has been read.

This reduces data duplication and makes the system easier to maintain.



# Stage 3: Query Optimization and Performance Analysis

## Given Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

---

## Why Can This Query Become Slow?

When the number of notifications is small, this query will work quickly.

However, in a real college notification system there may be thousands or even millions of notification records.

Without proper indexing, the database has to scan many rows to:

1. Find notifications belonging to student 1042.
2. Filter only unread notifications.
3. Sort the results by createdAt.

This increases query execution time as data grows.

---

## Indexing Strategy

To improve performance, I would create a composite index on the columns that are most frequently used in the query.

```sql
CREATE INDEX idx_notifications_student_read_created
ON student_notifications(student_id, is_read, notification_id);
```

For sorting by creation time, I would also use:

```sql
CREATE INDEX idx_notifications_created_at
ON notifications(created_at DESC);
```

These indexes help PostgreSQL locate matching rows faster instead of scanning the entire table.

---

## Optimized Query

```sql
SELECT n.notification_id,
       n.type,
       n.title,
       n.message,
       n.created_at
FROM student_notifications sn
JOIN notifications n
ON sn.notification_id = n.notification_id
WHERE sn.student_id = 1042
AND sn.is_read = FALSE
ORDER BY n.created_at DESC;
```

This query is better because:

* Only required columns are selected.
* Unnecessary data is not transferred.
* Indexed columns are used in filtering.
* Sorting becomes faster.

---

## Query to Fetch Placement Notifications from the Last 7 Days

```sql
SELECT *
FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## Index for Placement Query

```sql
CREATE INDEX idx_notifications_type_created
ON notifications(type, created_at DESC);
```

This index helps because:

* The database can quickly find Placement notifications.
* Sorting by date becomes faster.
* Less data needs to be scanned.

---

## Why Not Index Every Column?

Although indexes improve read performance, creating indexes on every column is not a good idea.

Problems:

1. More storage space is required.
2. Insert operations become slower.
3. Update operations become slower.
4. Delete operations become slower.
5. Extra indexes increase database maintenance overhead.

Because of this, indexes should only be created on columns that are frequently used in:

* WHERE clauses
* JOIN conditions
* ORDER BY clauses

---

## Performance Improvement Summary

| Technique                       | Benefit                    |
| ------------------------------- | -------------------------- |
| Composite Index                 | Faster filtering           |
| CreatedAt Index                 | Faster sorting             |
| Selecting Required Columns Only | Less data transfer         |
| Pagination                      | Prevents large result sets |
| Proper Joins                    | Better query execution     |

---

## Conclusion

The main performance issue with the original query is that it may scan a large number of rows and perform sorting operations repeatedly. By creating suitable indexes and selecting only the required columns, query execution becomes faster and the system can handle a larger number of notifications efficiently.



# Stage 4: Scaling Unread Notification Retrieval

## Problem Statement

As the college grows, the number of students and notifications will increase significantly.

A student may receive thousands of notifications over time. If the application tries to load all unread notifications at once, it can lead to:

* Slow API response time
* Increased database load
* Higher memory usage
* Poor user experience

Therefore, the system should be designed to handle large volumes of notification data efficiently.

---

## Solution 1: Pagination

Instead of returning all unread notifications in a single request, notifications should be fetched in smaller batches.

Example:

```http
GET /api/notifications/unread?page=1&limit=20
```

Response:

```json
{
  "page": 1,
  "limit": 20,
  "totalUnread": 350,
  "notifications": [...]
}
```

Benefits:

* Faster response time
* Lower memory consumption
* Better user experience
* Easier to scale

---

## Solution 2: Database Indexing

Unread notifications are frequently accessed.

Creating an index on these columns improves query performance:

```sql
CREATE INDEX idx_student_unread
ON student_notifications(student_id, is_read);
```

Benefits:

* Faster filtering
* Reduced database scans
* Better performance with large datasets

---

## Solution 3: Caching Frequently Accessed Data

Unread notification counts are requested very often.

Instead of querying the database every time, the count can be stored in Redis.

Example:

```text
Redis Key:
unread_count:1042

Value:
12
```

Workflow:

1. User opens dashboard.
2. Application checks Redis.
3. If value exists, return it immediately.
4. Otherwise fetch from database and update Redis.

Benefits:

* Faster responses
* Reduced database load
* Better scalability

---

## Solution 4: Lazy Loading

Notifications should not be loaded all at once.

Initially:

```text
Load first 20 notifications
```

When the user scrolls:

```text
Load next 20 notifications
```

Benefits:

* Faster page loading
* Better frontend performance
* Reduced network usage

---

## Solution 5: Archiving Old Notifications

Very old notifications are rarely accessed.

For example:

```text
Notifications older than 1 year
```

can be moved to an archive table.

Example:

```sql
notifications_archive
```

Benefits:

* Smaller active tables
* Faster queries
* Better database performance

---

## Recommended Architecture

For this notification system, I would use:

1. PostgreSQL for storing notifications.
2. Indexing on student_id and is_read.
3. Pagination for fetching data.
4. Redis for unread notification count caching.
5. Lazy loading on the frontend.

This combination provides good performance while keeping the implementation simple.

---

## Trade-offs

| Approach     | Advantage               | Limitation                             |
| ------------ | ----------------------- | -------------------------------------- |
| Pagination   | Fast responses          | Multiple requests required             |
| Indexing     | Faster queries          | Extra storage needed                   |
| Redis Cache  | Very fast reads         | Cache must be updated correctly        |
| Lazy Loading | Better user experience  | Additional frontend logic              |
| Archiving    | Smaller active database | Archived data becomes harder to access |

---

## Conclusion

To support a large number of students and notifications, the system should avoid loading all unread notifications at once. Using pagination, indexing, caching, and lazy loading can significantly improve performance and allow the application to scale efficiently as the number of users grows.
