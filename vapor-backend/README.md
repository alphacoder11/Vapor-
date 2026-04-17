# Vapor Backend

Java servlet-based backend for the Vapor gaming platform with MongoDB integration.

## Features

- **RESTful API** with servlets for games, users, and orders
- **MongoDB** integration for data persistence
- **CORS** support for frontend integration
- **JSON** API responses
- **Sample data** initialization

## API Endpoints

### Games
- `GET /api/games` - Get all games (supports filtering)
- `GET /api/games/{id}` - Get specific game
- `POST /api/games` - Create new game
- `PUT /api/games/{id}` - Update game
- `DELETE /api/games/{id}` - Delete game

### Users
- `GET /api/users/{id}` - Get user profile
- `POST /api/users` - Register new user
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user

### Orders
- `GET /api/orders` - Get all orders (or filter by userId)
- `GET /api/orders/{id}` - Get specific order
- `POST /api/orders` - Create new order

## Query Parameters

### Games filtering:
- `genre` - Filter by game genre
- `featured=true` - Get featured games only
- `onSale=true` - Get games on sale only
- `search={term}` - Search in title and description

### Orders filtering:
- `userId={id}` - Get orders for specific user

## Setup

### Prerequisites
- Java 11 or higher
- Maven 3.6 or higher
- MongoDB instance

### Configuration

Set the MongoDB connection string via environment variable:
```bash
export MONGODB_URI="mongodb://localhost:27017"
```

Or use the default: `mongodb://localhost:27017`

### Running

#### Development (with embedded Tomcat)
```bash
cd vapor-backend
mvn tomcat7:run
```

The server will start on `http://localhost:8080/vapor`

#### Production deployment
```bash
mvn clean package
# Deploy the target/vapor-backend.war to your servlet container
```

## Database Collections

### games
```json
{
  "title": "Game Title",
  "description": "Game description",
  "price": 59.99,
  "discountPrice": 44.99,
  "genre": "RPG",
  "releaseDate": "2023-01-01",
  "developer": "Studio Name",
  "publisher": "Publisher Name",
  "imageUrl": "https://example.com/image.jpg",
  "rating": 4.5,
  "tags": ["Action", "RPG", "Open World"],
  "featured": true,
  "onSale": false
}
```

### users
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "hashed_password",
  "displayName": "Display Name",
  "vaporPoints": 1000,
  "ownedGames": ["gameId1", "gameId2"],
  "wishlist": ["gameId3"],
  "createdAt": "2023-01-01T00:00:00Z",
  "lastLogin": "2023-01-01T00:00:00Z"
}
```

### orders
```json
{
  "userId": "userId",
  "gameIds": ["gameId1", "gameId2"],
  "totalAmount": 89.98,
  "pointsEarned": 8998,
  "status": "completed",
  "orderDate": "2023-01-01T00:00:00Z",
  "paymentMethod": "credit_card"
}
```

## Sample Data

The application automatically populates the games collection with sample data on startup if the collection is empty.

## Frontend Integration

The backend is configured with CORS to allow requests from the React frontend. Make sure to update the frontend API calls to point to:
```
http://localhost:8080/vapor/api
```
