type Create = {
  message: string;
};

type FindMany = {
  message: string;
  count: number;
  [key: string]: any;
};

type FindOne = {
  message: string;
  [key: string]: any;
};

type UpdateById = {
  message: string;
};

type RemoveById = {
  message: string;
};

type RetrieveById = {
  message: string;
};

type Register = Create;

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
  Register,
  Login,
  Refresh,
  Logout,
  SignToken,
  SignRefreshToken,
  Create,
  FindMany,
  FindOne,
  UpdateById,
  RemoveById,
  RetrieveById,
};
