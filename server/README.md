# Seafood Marketplace Backend Server

A RESTful API server built with Node.js, Express, TypeScript, and MongoDB for the Seafood Marketplace management system.

## Features

- RESTful API endpoints for product management
- MongoDB database integration
- TypeScript support
- Hot reloading during development
- CORS enabled
- Environment variable configuration
- Error handling
- Pagination and search functionality

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Development Tools**: 
  - ts-node-dev (for development)
  - TypeScript
  - npm

## Project Structure

```
server/
├── src/
│   ├── models/         # Database models
│   │   └── Product.ts  # Product schema
│   ├── routes/         # API routes
│   │   └── products.ts # Product routes
│   └── index.ts        # Server entry point
├── .env                # Environment variables
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## API Endpoints

### Products

- `GET /api/products` - Get all products (with pagination and search)
  - Query parameters:
    - `page` (default: 1)
    - `pageSize` (default: 10)
    - `search` (optional)

- `GET /api/products/:id` - Get a single product by ID

- `POST /api/products` - Create a new product
  - Request body:
    ```json
    {
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "category": "Fish" | "Shellfish" | "Other"
    }
    ```

- `PUT /api/products/:id` - Update a product
  - Request body: Same as POST, but all fields are optional

- `DELETE /api/products/:id` - Delete a product

- `GET /api/products/search` - Search products
  - Query parameter: `q` (search term)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd seafood-marketplace-backend-react-ts
   ```

2. Install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/seafood-marketplace
   ```

4. Start MongoDB:
   ```bash
   # Using Homebrew on macOS
   brew services start mongodb-community
   ```

## Development

To start the development server with hot reloading:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

## Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses include a message and details:

```json
{
  "message": "Error message",
  "error": "Error details"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 