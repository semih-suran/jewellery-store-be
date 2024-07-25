# Portfolio API - Backend Project

Welcome to my project!

This project is a work-in-progress e-commerce website for a jewellery store. It aims to provide users with a seamless shopping experience for purchasing earrings, rings, necklaces, and bracelets.

## Figma Design

Check out the Figma Design of the Jewellery Store: [Link will be updated!](https://jewellery-store-semih.netlify.app/)

## Live Page on Netlify

Check out the live demo of the Jewellery Store: [Jewellery Store Live Page](https://jewellery-store-semih.netlify.app/)

## Backend on Render

Check out the Endpoints of the Jewellery Store: [Jewellery Store Endpoints](https://jewellery-store-be.onrender.com/api)

## Tech Stack

- React
- React Router
- Axios (for API requests)
- Tailwind CSS (for styling)
- JavaScript

## Authentication

- OAuth 2.0: Utilized for authentication, providing secure access to the application using OAuth 2.0 protocol.

- JWT (JSON Web Tokens): Used for secure transmission of information between parties, often employed for user authentication.

## Features

- Browse and purchase a variety of jewellery items.
- Filter items by category (earrings, rings, necklaces, bracelets).
- View detailed information about each item.
- Add items to the shopping cart.
- Checkout securely with various payment options.

### Core Endpoints

- **Get All Endpoints**: Retrieve a JSON representation of all available endpoints in the API.
- get("/api/")
- **GET All Items**: Retrieves an array of all available items.
- **Topics**: Access a list of available topics.
- **Articles**: Retrieve articles using Last In, First Out (LIFO) order, sorted by specified criteria.
- **Comments**: Fetch comments for articles using LIFO order.
- **Users**: Retrieve information about all users.

### Additional Functionality

- **Article Filtering**: Filter articles based on topic query and sort order query.
- **Comment Posting**: Post comments to specific articles.
- **Vote Management**: Update the vote count for articles.
- **Comment Deletion**: Delete specific comments.

- get("/api/items/", getAllItems);
- get("/api/items/:item_id", getItemById);
- get("/api/items/type/:type", getItemsByType);
- get("/api/items/style/:style", getItemsByStyle);
- get("/api/items/size/:size", getItemsBySize);
- get("/api/items/color1/:color1", getItemsByColor1);
- get("/api/items/color2/:color2", getItemsByColor2);
- get("/api/shoppingusers", getAllShoppingUsers);
- get("/api/shoppingusers/:user_id", getShoppingUserById);

- patch("/api/items/:item_id/review_score", patchReviewScore);
- patch("/api/items/:item_id/quantity", patchQuantity);
- patch("/api/items/:item_id/likes", patchLikes);
- patch("/api/items/:item_id/in_basket", patchInBasket);
- patch("/api/shoppingusers/:user_id/address", patchShoppingUserAddress);
- patch("/api/shoppingusers/:user_id/nickname", patchShoppingUserNickname);

- post("/api/shoppingusers", postShoppingUser);



## Setup

### Minimum Versions

- Node.js: v12.0.0 or higher
- PostgreSQL: v11.0.0 or higher

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/semih-suran/jewellery-store-be.git
   ```

2. **Environment Variables**

   Create `.env.development` (PGDATABASE=), `.env.test` (PGDATABASE=) and `.env.production` (DATABASE_URL=) files in the root directory and add the necessary environment variables for your development and test databases.

3. **Install Dependencies**

   ```bash
   npm install
   npm install --save pg express dotenv
   npm install --save-dev husky jest jest-extended jest-sorted pg-format supertest
   ```

   Add the following configuration to your `package.json`:

   ```json
   "jest": {
     "setupFilesAfterEnv": [
       "jest-sorted",
       "jest-extended/all"
     ]
   }
   ```

4. **Seed Database**

   ```bash
   npm run setup-dbs
   npm run seed
   npm run seed-prod
   ```

5. **Run Tests**

   ```bash
   npm test
   ```

6. **Start the Development Server**

   ```bash
   npm start
   ```

   The API will be accessible locally at the specified port (default: http://localhost:8080).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
