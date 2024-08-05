const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = async ({
  topicData = [],
  userData = [],
  articleData = [],
  commentData = [],
  itemData = [],
  shoppingusersData = [],
}) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Drop tables with CASCADE
    await client.query(`DROP TABLE IF EXISTS comments CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS articles CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS topics CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS items CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS shopping_users CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS shopping_favourites CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS shopping_bag CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS shopping_reviews CASCADE;`);
    await client.query(
      `DROP TABLE IF EXISTS comments, articles, users, topics, items, shopping_users, shopping_favourites, shopping_bag, shopping_reviews CASCADE;`
    );

    console.log("Tables dropped successfully");

    // Create tables
    await client.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL
      );
    `);

    console.log("Topics table created");

    await client.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR,
        is_default BOOLEAN DEFAULT false NOT NULL
      );
    `);

    console.log("Users table created");

    await client.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );
    `);

    console.log("Articles table created");

    await client.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Comments table created");

    await client.query(`
      CREATE TABLE items (
        the_item_id SERIAL PRIMARY KEY,
        item_id VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color1 VARCHAR(50),
        color2 VARCHAR(50),
        size INT,
        type VARCHAR(50),
        style VARCHAR(50),
        price DECIMAL(10, 2),
        quantity INT,
        likes INT DEFAULT 0,
        in_basket INT DEFAULT 0,
        review_score DECIMAL(3, 2) DEFAULT 0,
        comment_count INT DEFAULT 0,
        images_url VARCHAR[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Items table created");

    await client.query(`
      CREATE TABLE shopping_users (
          user_id SERIAL PRIMARY KEY,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          nickname VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          mobile_phone VARCHAR(20),
          street VARCHAR(255),
          city VARCHAR(100),
          state VARCHAR(100),
          zipcode VARCHAR(20),
          country VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("shopping_users table created");

    await client.query(`
      CREATE TABLE shopping_favourites (
        user_id INT REFERENCES shopping_users(user_id),
        item_id INT REFERENCES items(the_item_id),
        PRIMARY KEY (user_id, item_id)
      );
    `);

    console.log("shopping_favourites created");

    await client.query(`
      CREATE TABLE shopping_bag (
        user_id INT REFERENCES shopping_users(user_id),
        item_id INT REFERENCES items(the_item_id),
        quantity INT NOT NULL,
        PRIMARY KEY (user_id, item_id)
      );
    `);

    console.log("shopping_bag table created");

    await client.query(`
      CREATE TABLE shopping_reviews (
        review_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES shopping_users(user_id),
        item_id INT REFERENCES items(the_item_id),
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("shopping_reviews table created");

    // Insert data
    const insertTopicsQueryStr = format(
      "INSERT INTO topics (slug, description) VALUES %L;",
      topicData.map(({ slug, description }) => [slug, description])
    );
    await client.query(insertTopicsQueryStr);

    const insertUsersQueryStr = format(
      "INSERT INTO users (username, name, avatar_url, is_default) VALUES %L;",
      userData.map(({ username, name, avatar_url, is_default = false }) => [
        username,
        name,
        avatar_url,
        is_default,
      ])
    );
    await client.query(insertUsersQueryStr);

    const formattedArticleData = articleData.map(convertTimestampToDate);
    const insertArticlesQueryStr = format(
      "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L;",
      formattedArticleData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => [title, topic, author, body, created_at, votes, article_img_url]
      )
    );
    const articleRows = (await client.query(insertArticlesQueryStr)).rows;

    const articleIdLookup = createRef(articleRows, "title", "article_id");
    const formattedCommentData = formatComments(commentData, articleIdLookup);
    const insertCommentsQueryStr = format(
      "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
      formattedCommentData.map(
        ({ body, author, article_id, votes, created_at }) => [
          body,
          author,
          article_id,
          votes,
          created_at,
        ]
      )
    );
    await client.query(insertCommentsQueryStr);

    const insertItemsQueryStr = format(
      "INSERT INTO items (item_id, name, description, color1, color2, size, type, style, price, quantity, likes, in_basket, review_score, comment_count, images_url, created_at, updated_at) VALUES %L;",
      itemData.map(
        ({
          item_id,
          name,
          description,
          color1,
          color2,
          size,
          type,
          style,
          price,
          quantity,
          likes,
          in_basket,
          review_score,
          comment_count,
          images_url,
          created_at,
          updated_at,
        }) => [
          item_id,
          name,
          description,
          color1,
          color2,
          size,
          type,
          style,
          price,
          quantity,
          likes,
          in_basket,
          review_score,
          comment_count,
          `{${images_url.join(",")}}`,
          created_at,
          updated_at,
        ]
      )
    );
    await client.query(insertItemsQueryStr);

    const insertShoppingUsersQueryStr = format(
      "INSERT INTO shopping_users (first_name, last_name, nickname, email, password, mobile_phone, street, city, state, zipCode, country) VALUES %L;",
      shoppingusersData.map(
        ({
          firstName,
          lastName,
          nickname,
          email,
          password,
          mobilePhone,
          street,
          city,
          state,
          zipCode,
          country,
        }) => [
          firstName,
          lastName,
          nickname,
          email,
          password,
          mobilePhone,
          street,
          city,
          state,
          zipCode,
          country,
        ]
      )
    );
    await client.query(insertShoppingUsersQueryStr);

    const insertFavouritesQueryStr = `
      INSERT INTO shopping_favourites (user_id, item_id) VALUES
      (1, 1), (1, 2), (1, 3),
      (2, 4), (2, 5), (2, 6),
      (3, 7), (3, 8), (3, 9),
      (4, 10), (4, 11), (4, 12),
      (5, 13), (5, 14), (5, 15),
      (6, 16), (6, 17), (6, 18),
      (7, 19), (7, 20), (7, 21),
      (8, 22), (8, 23), (8, 24);
    `;
    await client.query(insertFavouritesQueryStr);

    const insertShoppingBagQueryStr = `
      INSERT INTO shopping_bag (user_id, item_id, quantity) VALUES
      (1, 1, 2), (1, 2, 1), (1, 3, 3),
      (2, 4, 1), (2, 5, 2), (2, 6, 1),
      (3, 7, 3), (3, 8, 1), (3, 9, 2),
      (4, 10, 1), (4, 11, 3), (4, 12, 2),
      (5, 13, 1), (5, 14, 1), (5, 15, 3),
      (6, 16, 2), (6, 17, 1), (6, 18, 3),
      (7, 19, 1), (7, 20, 2), (7, 21, 3),
      (8, 22, 1), (8, 23, 3), (8, 24, 2);
    `;
    await client.query(insertShoppingBagQueryStr);

    const insertReviewsQueryStr = `
      INSERT INTO shopping_reviews (user_id, item_id, rating, review) VALUES
      (1, 1, 5, 'Outstanding quality!'), (1, 2, 4, 'Very good'), (1, 3, 3, 'Average'),
      (2, 4, 2, 'Not what I expected'), (2, 5, 5, 'Love it!'), (2, 6, 4, 'Pretty good'),
      (3, 7, 3, 'Just okay'), (3, 8, 5, 'Highly recommend'), (3, 9, 2, 'Not great'),
      (4, 10, 4, 'Good product'), (4, 11, 3, 'Fair'), (4, 12, 5, 'Excellent!'),
      (5, 13, 4, 'Very nice'), (5, 14, 2, 'Could be better'), (5, 15, 5, 'Perfect!'),
      (6, 16, 4, 'Really good'), (6, 17, 3, 'Okay product'), (6, 18, 5, 'Love it'),
      (7, 19, 5, 'Awesome'), (7, 20, 2, 'Not impressed'), (7, 21, 4, 'Good purchase'),
      (8, 22, 5, 'Amazing'), (8, 23, 4, 'Very good'), (8, 24, 3, 'Just okay');
    `;
    await client.query(insertReviewsQueryStr);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = seed;
