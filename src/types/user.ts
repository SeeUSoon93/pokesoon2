export type AppUser = {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
};
