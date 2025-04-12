
# 22POULTRY API Documentation

This document provides details on the available API endpoints for the 22POULTRY platform.

## Authentication

22POULTRY uses Supabase for authentication, which provides JWTs for secure API access.

### Signup

```
POST https://xtdukbzdbzbemyqaifhp.supabase.co/auth/v1/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Login

```
POST https://xtdukbzdbzbemyqaifhp.supabase.co/auth/v1/token?grant_type=password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Logout

```
POST https://xtdukbzdbzbemyqaifhp.supabase.co/auth/v1/logout
```

## User Profiles

### Get Current User Profile

```
GET https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/profiles?user_id=eq.{user_id}&select=*
```

### Update User Profile

```
PATCH https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/profiles?user_id=eq.{user_id}
```

**Request Body:**
```json
{
  "username": "newusername",
  "bio": "Updated bio information"
}
```

## File Uploads

### Upload Profile Image

```
POST https://xtdukbzdbzbemyqaifhp.supabase.co/storage/v1/object/avatars/{user_id}-{filename}
```

## Contact Form

### Submit Contact Form

```
POST https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/profiles
```

**Request Body:**
```json
{
  "username": "Contact Name",
  "bio": "Subject: Message content"
}
```

## Notifications

### Get User Notifications

```
GET https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/notifications?user_id=eq.{user_id}&select=*
```

### Mark Notifications as Read

```
PATCH https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/notifications?user_id=eq.{user_id}&id=in.({notification_ids})
```

**Request Body:**
```json
{
  "read": true
}
```

## Messages

### Get User Messages

```
GET https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/messages?user_id=eq.{user_id}&select=*
```

### Mark Messages as Read

```
PATCH https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/messages?user_id=eq.{user_id}&id=in.({message_ids})
```

**Request Body:**
```json
{
  "read": true
}
```

## Search

### Search Across Multiple Tables

```
GET https://xtdukbzdbzbemyqaifhp.supabase.co/rest/v1/rpc/search_all
```

**Request Body:**
```json
{
  "query_text": "search query"
}
```

## Security Considerations

- All API requests must include the appropriate JWT token in the `Authorization` header
- Row-Level Security (RLS) policies ensure users can only access their own data
- File uploads are restricted by size (2MB max) and type (images only)
