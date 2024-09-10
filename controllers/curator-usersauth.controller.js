const { OAuth2Client } = require("google-auth-library");
const {
  createUser,
  findUserByEmail,
} = require("../models/curator-usersauth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const curatorRegisterUser = (req, res, next) => {
  const user = req.body;
  createUser(user)
    .then((createdUser) => {
      res.status(201).json({ user: createdUser });
    })
    .catch(next);
};

const curatorLoginUser = (req, res, next) => {
  const { email, password } = req.body;

  findUserByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
          {
            userId: user.user_id,
            email: user.email,
            nickname: user.nickname,
            picture: user.picture,
          },
          jwtSecret,
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const curatorGoogleLogin = async (req, res, next) => {
  const { tokenId } = req.body.tokenId.tokenId;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      given_name: first_name,
      family_name: last_name,
      email,
      sub: googleId,
      picture: googlePicture,
    } = payload;

    findUserByEmail(email)
      .then((user) => {
        if (user) {
          const token = jwt.sign(
            {
              userId: user.user_id,
              email: user.email,
              nickname: user.nickname,
              picture: user.picture,
            },
            jwtSecret,
            { expiresIn: "1h" }
          );

          res.status(200).json({ message: "Login successful", token });
        } else {
          const newUser = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: googleId,
            picture: googlePicture,
            nickname: payload.name || `${first_name} ${last_name}`,
          };

          createUser(newUser)
            .then((createdUser) => {
              const token = jwt.sign(
                {
                  userId: createdUser.user_id,
                  email: createdUser.email,
                  nickname: createdUser.nickname,
                  picture: createdUser.picture,
                },
                jwtSecret,
                { expiresIn: "1h" }
              );

              res
                .status(201)
                .json({ message: "Registration and login successful", token });
            })
            .catch(next);
        }
      })
      .catch(next);
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Google login failed" });
  }
};

module.exports = {
  curatorRegisterUser,
  curatorLoginUser,
  curatorGoogleLogin,
};
