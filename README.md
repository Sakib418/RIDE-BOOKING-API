# Ride Management System API

## Project Overview
The **Ride Management System API** is a backend service built with **Node.js, Express, TypeScript, and MongoDB** that manages ride booking, driver and rider interactions, and ride lifecycle events. The system supports role-based actions for **Drivers, Riders, and Admins**, including ride creation, acceptance, cancellation, and completion.  

Key features:
- Ride lifecycle enforcement (REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED)
- Role-based access control (Driver, Rider, Admin)
- Driver approval management
- Rider ride cancellation
- Admin overrides for ride management
- Based on lat and lng of pickup and destination location automatic fare calculation

---

## Setup & Environment Instructions

### Prerequisites
- Node.js >= 20
- MongoDB >= 6.x
- npm or yarn
- Postman or API testing tool

# Setup & Installation

```bash
git clone https://github.com/<your-username>/ride-management-api.git
cd ride-management-api
npm install
# or
yarn install

### Setup environment variables
PORT=5000
DB_URL=mongodb+srv://UserName:Password@cluster0.aine5.mongodb.net/example-db?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES=30d

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=example@gmail.com
SUPER_ADMIN_PASSWORD=examplePassword

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=your_callback_url

# Express Session
EXPRESS_SESSION_SECRET=express-session

# Frontend URL
FRONTEND_URL=http://localhost:5173


## API Endpoints Summary and In project you can find postman api collection.
| Method | Endpoint        | Role   | Description                   |
| ------ | --------------- | ------ | ----------------------------- |
| POST   | /users/register | Public | Register a new user           |
| POST   | /auth/login     | Public | Login user and get JWT tokens |


### Admins
| Method | Endpoint              | Role  | Description                    |
| ------ | --------------------- | ----- | ------------------------------ |
| GET    | /users                | Admin | View all users                 |
| GET    | /drivers              | Admin | View all drivers               |
| GET    | /rides/me             | Admin | View all rides                 |
| PATCH  | /drivers/approve/\:id | Admin | Approve or suspend drivers     |
| PATCH  | /users/block/\:id     | Admin | Block or unblock user accounts |


### Drivers
| Method | Endpoint               | Role   | Description                                     |
| ------ | ---------------------- | ------ | ----------------------------------------------- |
| PATCH  | /rides/\:id/status     | Driver | Accept/reject ride requests, update ride status |
| GET    | /drivers/earnings/\:id | Driver | View earnings history                           |
| PATCH  | /drivers/status        | Driver | Set availability status                         |


### Rides
| Method | Endpoint           | Role  | Description                                                    |
| ------ | ------------------ | ----- | -------------------------------------------------------------- |
| POST   | /rides/request     | Rider | Request a ride with pickup & destination locations (lat & lng) |
| PATCH  | /rides/\:id/status | Rider | Cancel a ride                                                  |
| GET    | /rides/me          | Rider | View ride history                                              |
                      |


### Notes
- All requests require a valid **JWT token** in the `Authorization` header.  
- Ride lifecycle is strictly enforced:  

### Error Handling
The API uses consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400
}

- Node.js & Express — server framework
- TypeScript — static typing
- MongoDB & Mongoose — database and ODM
- JWT — authentication
- HTTP Status Codes — standardized responses

