import { randomUUID } from "crypto";
import { authorizeWithGithub } from "../libs/auth.js";

export const resolvers = {
  Query: {
    totalPhotos: async (_, __, { db }) => {
      return await db.collection("photos").estimatedDocumentCount();
    },
    allPhotos: async (_, __, { db }) => {
      return await db.collection("photos").find().toArray();
    },
    totalUsers: async (_, __, { db }) => {
      return await db.collection("users").estimatedDocumentCount();
    },
    allUsers: async (_, __, { db }) => {
      return await db.collection("users").find().toArray();
    },
  },
  Mutation: {
    postPhoto(_, args) {
      const newPhoto = {
        id: randomUUID(),
        ...args.input,
      };

      photos.push(newPhoto);

      return newPhoto;
    },
    githubAuth: async (_, { code }, { db }) => {
      const { message, access_token, avatar_url, login, name } =
        await authorizeWithGithub({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        });

      if (message) {
        throw new Error(message);
      }

      const lastUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      await db.collection("users").replaceOne(
        {
          githubLogin: login,
        },
        lastUserInfo,
        { upsert: true }
      );

      const users = await db
        .collection("users")
        .find({
          githubLogin: login,
        })
        .toArray();

      const [user] = users;

      return {
        user,
        token: access_token,
      };
    },
  },
  Photo: {
    url: parent => {
      return `htttp://my-site-example.com/img/${parent.id}`;
    },
  },
};
