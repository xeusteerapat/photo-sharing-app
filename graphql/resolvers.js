import { randomUUID } from "crypto";

let photos = [];
export const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
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
  },
  Photo: {
    url: parent => {
      return `htttp://my-site-example.com/img/${parent.id}`;
    },
  },
};
