const supertest = require("supertest");
const fs = require("fs");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET Tests", () => {
  describe("GET Bad Path Tests", () => {
    test("should return a Status Code : 404 when invalid path given", () => {
      return supertest(app).get("/api/semih8").expect(404);
    });
  });
  describe("GET ALL Endpoints", () => {
    test("should return a Status Code : 200", () => {
      return supertest(app).get("/api").expect(200);
    });
    test("should return a non-empty object", () => {
      return supertest(app)
        .get("/api")
        .then((response) => {
          expect(response.body).toBeInstanceOf(Object);
          expect(Object.keys(response.body).length).toBeGreaterThan(0);
        });
    });
    test("should include a specific endpoint", () => {
      return supertest(app)
        .get("/api")
        .then((response) => {
          expect(response.body).toHaveProperty("GET /api/articles");
        });
    });
    test("should match received endpoints with endpoints.json", () => {
      const endpointsPath = "./endpoints.json";
      const expectedEndpoints = JSON.parse(
        fs.readFileSync(endpointsPath, "utf-8")
      );
      return supertest(app)
        .get("/api")
        .then((response) => {
          expect(response.body).toEqual(expectedEndpoints);
        });
    });
  });
  describe("GET ALL Topics", () => {
    test("should return a Status Code : 200", () => {
      return supertest(app).get("/api/topics").expect(200);
    });
    test("should return all topics with the correct structure", () => {
      return supertest(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
    test("should have all 3 topics", () => {
      return supertest(app)
        .get("/api/topics")
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
        });
    });
  });
  describe("GET ALL Comments", () => {
    test("should return a Status Code : 200", () => {
      return supertest(app).get("/api/comments").expect(200);
    });
    test("should return all comments with the correct structure", () => {
      return supertest(app)
        .get("/api/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
          });
        });
    });
    test("should return all comments in descending order", () => {
      return supertest(app)
        .get("/api/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("should have all 18 comments", () => {
      return supertest(app)
        .get("/api/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(18);
        });
    });
  });
  describe("GET Articles Tests", () => {
    describe("GET Articles By ID", () => {
      test("should return a Status Code: 200 for a successful request", () => {
        return supertest(app).get("/api/articles/5").expect(200);
      });
      test("should return a Status Code: 404 for a non-existent (article_id)", () => {
        return supertest(app)
          .get("/api/articles/888")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Article Not Found");
          });
      });
      test("should return a Status Code: 400 if passed (article_id) is not a number", () => {
        return supertest(app)
          .get("/api/articles/semih8")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe(
              "Invalid (article_id) Format. Must Be a Number."
            );
          });
      });
      test("should return the specified article with the correct structure", () => {
        return supertest(app)
          .get("/api/articles/8")
          .expect(200)
          .then((response) => {
            const article = response.body[0];
            expect(article.article_id).toBe(8);
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("body");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
      });
    });
    describe("GET Articles In Descending Order By Date", () => {
      test("should return all articles in descending order", () => {
        return supertest(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            const articles = response.body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("should NOT have (body) property but should have the correct structure", () => {
        return supertest(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            const articles = response.body;
            expect(articles.length === 13).toBe(true);
            articles.forEach((article) => {
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });
    });
    describe("GET Articles By Queries", () => {
      describe("GET Articles In Order By Sort Querie", () => {
        test("should return article(s) by specified (sorting querie) with correct structure", () => {
          return supertest(app)
            .get("/api/articles")
            .query({ sort_by: "article_id", order: "asc" })
            .expect(200)
            .then((response) => {
              const sortedArticles = response.body;
              expect(response.body.length).toBe(13);
              sortedArticles.forEach((sortedArticle) => {
                expect(sortedArticle).toHaveProperty("title");
                expect(sortedArticle).toHaveProperty("created_at");
                expect(sortedArticle).toHaveProperty("author");
                expect(sortedArticle).toHaveProperty("article_id");
                expect(sortedArticle).toHaveProperty("topic");
                expect(sortedArticle).toHaveProperty("votes");
                expect(sortedArticle).toHaveProperty("comment_count");
                expect(sortedArticle).toHaveProperty("article_img_url");
              });
            });
        });
      });
      describe("GET Articles By Topic Query", () => {
        test("should return article(s) by specified (topic) with correct structure", () => {
          return supertest(app)
            .get("/api/articles")
            .query({ topic: "cats" })
            .expect(200)
            .then((response) => {
              const theOnlyArticle = response.body[0];
              expect(response.body.length).toBe(1);
              expect(theOnlyArticle.topic).toEqual("cats");
              expect(theOnlyArticle.title).toEqual(
                "UNCOVERED: catspiracy to bring down democracy"
              );
              expect(theOnlyArticle.author).toEqual("rogersop");
              expect(theOnlyArticle.body).toEqual(
                "Bastet walks amongst us, and the cats are taking arms!"
              );
              expect(theOnlyArticle.article_img_url).toEqual(
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
              );
              expect(theOnlyArticle).toHaveProperty("created_at");
            });
        });
        test("should return a Status Code: 404 if the specified (topic) does not exist", () => {
          return supertest(app)
            .get("/api/articles")
            .query({ topic: "semih8" })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("(topic) does not exist.");
            });
        });
        test("should return a Status Code: 200 and an empty array when no article for the existing topic", () => {
          return supertest(app)
            .get("/api/articles")
            .query({ topic: "paper" })
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual([]);
            });
        });
      });
    });
  });
  describe("GET Comments By Article ID", () => {
    test("should return all comments for a specific (article_id) with correct structure", () => {
      return supertest(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body;
          expect(comments.length === 2).toBe(true);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
          });
        });
    });
    test("should return a Status Code: 400 for a non-existent (article_id)", () => {
      return supertest(app)
        .get("/api/articles/888/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
    test("should return a Status Code: 200 and an empty array for an (article_id) with no comments yet", () => {
      return supertest(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([]);
        });
    });
    test("should return a Status Code: 400 if passed (article_id) is not a number", () => {
      return supertest(app)
        .get("/api/articles/semih8/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid (article_id) Format. Must Be a Number."
          );
        });
    });
  });
  describe("GET Users", () => {
    test("should return a Status Code : 200", () => {
      return supertest(app).get("/api/users").expect(200);
    });
    test("should have all 4 users", () => {
      return supertest(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users.length).toBe(4);
        });
    });
    test("should return all users with the correct structure", () => {
      return supertest(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          response.body.users.forEach((users) => {
            expect(users).toHaveProperty("username");
            expect(users).toHaveProperty("name");
            expect(users).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
describe("POST Tests", () => {
  describe("POST Comments By Article ID", () => {
    test("should return a Status Code: 201 and add a comment to the specified article", () => {
      const newComment = {
        username: "lurker",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const comment = response.body;
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment.author).toBe(newComment.username);
          expect(comment.body).toBe(newComment.body);
          expect(comment.article_id).toBe(5);
        });
    });
    test("should return a Status Code: 400 if (body) key is missing", () => {
      const userNameOnly = {
        username: "lurker",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(userNameOnly)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(username) and (body) are required fields."
          );
        });
    });
    test("should return a Status Code: 400 if (username) key is missing", () => {
      const bodyOnly = {
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(bodyOnly)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(username) and (body) are required fields."
          );
        });
    });
    test("should return a Status Code: 404 if (username) key given but does not exist", () => {
      const invalidUsername = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(invalidUsername)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("(username) does not exist.");
        });
    });
    test("should return a Status Code: 404 if the (article_id) does not exist", () => {
      const newComment = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
    test("should return a Status Code: 400 if given (article_id) is not a number", () => {
      const newComment = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/semih8/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid (article_id) Format. Must Be a Number."
          );
        });
    });
  });
});
describe("PATCH Tests", () => {
  describe("PATCH Votes By Article ID", () => {
    test("should return a Status Code: 200 and add PATCH the specified article", () => {
      const newVote = {
        inc_votes: 18,
      };
      return supertest(app)
        .patch("/api/articles/5")
        .send(newVote)
        .expect(200)
        .then((response) => {
          const article = response.body[0];
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article.votes).toBe(18);
          expect(article.article_id).toBe(5);
        });
    });
    test("should return a Status Code: 400 if there is no (inc_votes) key.", () => {
      const RandomInfo1 = {
        randomInfo: "I did not fall down. I did attack the floor, though.",
      };
      return supertest(app)
        .patch("/api/articles/5/")
        .send(RandomInfo1)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(inc_votes) is required and should be the only key."
          );
        });
    });
    test("should return a Status Code: 200 and ignore if there are more keys with (inc_votes)", () => {
      const RandomInfo2 = {
        inc_votes: 7,
        randomInfo:
          "Chocolate does not ask any questions. Chocolate simply understands.",
      };
      return supertest(app)
        .patch("/api/articles/5/")
        .send(RandomInfo2)
        .expect(200)
        .then((response) => {
          const article = response.body[0];
          expect(article.article_id).toBe(5);
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article.votes).toBe(7);
          expect(article).toHaveProperty("article_img_url");
        });
    });
    test("should return a Status Code: 404 if the specified (article_id) does not exist", () => {
      const validValue = {
        inc_votes: 7,
      };
      return supertest(app)
        .patch("/api/articles/999/")
        .send(validValue)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
    test("should return a Status Code: 400 if given (article_id) is not a number", () => {
      const validValue = {
        inc_votes: 7,
      };
      return supertest(app)
        .patch("/api/articles/semih8/")
        .send(validValue)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid (article_id) Format. Must Be a Number."
          );
        });
    });
  });
  describe("PATCH Default User By Username", () => {
    test("should set a user as the default, updating is_default to true", () => {
      const usernameToBeDefault = "lurker";
      return supertest(app)
        .patch(`/api/users/${usernameToBeDefault}/makeDefault`)
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).toBe(usernameToBeDefault);
          expect(body.user.is_default).toBe(true);
        });
    });
  
    test("should be only one user is set as default at any time", async () => {
      await supertest(app)
        .patch(`/api/users/lurker/makeDefault`)
        .expect(200);
  
      await supertest(app)
        .patch(`/api/users/rogersop/makeDefault`)
        .expect(200);
  
      const { body } = await supertest(app).get("/api/users").expect(200);
      const defaultUsers = body.users.filter(user => user.is_default);
  
      expect(defaultUsers.length).toBe(1);
      expect(defaultUsers[0].username).toBe("rogersop");
    });
  
    test("should return a Status Code: 404 if a non-existent user", () => {
      const nonExistentUsername = "ghostUser";
      return supertest(app)
        .patch(`/api/users/${nonExistentUsername}/makeDefault`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
  });
});
describe("DELETE Tests", () => {
  describe("DELETE Comments By Comment ID", () => {
    test("should return a Status Code: 204 and DELETE the specified comment", () => {
      return supertest(app)
        .delete("/api/comments/5")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
    test("should return a Status Code: 404 for a non-existent (comment_id)", () => {
      return supertest(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Comment ID");
        });
    });
    test("should return a Status Code: 400 when an invalid (comment_id) format given", () => {
      return supertest(app)
        .delete("/api/comments/semih8")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid (comment_id) Format. Must Be a Number."
          );
        });
    });
  });
});
