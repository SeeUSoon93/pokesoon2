export type AppUser = {
  id?: string;
  uid: string;
  email: string | null;
  name: string | null;
  image?: string | null;
  provider: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
