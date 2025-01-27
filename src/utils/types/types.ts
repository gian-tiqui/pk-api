import { User } from '@prisma/client';

type CreateBase = {
  message: string;
};

type UpdateBase = {
  message: string;
};

type RemoveBase = {
  message: string;
};

type CreateUser = CreateBase;

type FindUsers = {
  message: string;
  count: number;
  users: User[];
};

type FindUser = {
  message: string;
  user: User;
};

type UpdateUser = UpdateBase;

type RemoveUser = RemoveBase;

type Register = CreateBase;

type Login = {
  message: string;
  tokens: { accessToken: string; refreshToken: string };
};

type Refresh = {
  message: string;
  accessToken: string;
};

type Logout = {
  message: string;
};

type SignToken = Promise<string>;

type SignRefreshToken = Promise<string>;

export type {
  CreateUser,
  FindUsers,
  FindUser,
  UpdateUser,
  RemoveUser,
  Register,
  Login,
  Refresh,
  Logout,
  SignToken,
  SignRefreshToken,
};
