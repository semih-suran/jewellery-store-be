# Jewellery Shop API - Backend Project

## Hosted Version

Access the live NC News platform via the following links:

- **Netlify Web Page**: [NC News on Netlify](https://main--nc-news-semih.netlify.app/)
- **Onrender Database**: [NC News API on Onrender](https://thenews-lhhv.onrender.com/api/)

## Project Overview

The NC News API is a robust web API designed to manage various aspects of a content platform. It provides a comprehensive set of endpoints for handling topics, articles, comments, and user data. Key features include the ability to retrieve information about topics, articles, and users, post comments to articles, update article votes, and delete comments. This project aims to deliver a flexible and functional API to facilitate seamless content management operations.

## Features

### Core Endpoints

- **Get All Endpoints**: Retrieve a JSON representation of all available endpoints in the API.
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

## Setup

### Minimum Versions

- Node.js: v12.0.0 or higher
- PostgreSQL: v11.0.0 or higher

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/semih-suran/theNews.git
   ```

2. **Environment Variables**

   Create `.env.development` and `.env.test` files in the root directory and add the necessary environment variables for your development and test databases.

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
