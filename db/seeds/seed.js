const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(`DROP TABLE IF EXISTS comments;`);
    await client.query(`DROP TABLE IF EXISTS articles;`);
    await client.query(`DROP TABLE IF EXISTS users;`);
    await client.query(`DROP TABLE IF EXISTS topics;`);

    await client.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR,
        is_default BOOLEAN DEFAULT false NOT NULL
      );
    `);

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

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = seed;
