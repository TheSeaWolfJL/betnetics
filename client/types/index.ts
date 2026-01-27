import { Roles } from '@/shared/profileUpdateSchema';

export type UsersType = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
};

export type UserProfileType = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type SignInFormType = {
  username: string;
  password: string;
};

export type AdminFormType = {
  email: string;
  firstName: string;
  birthDate: string;
};

export type ProfileType = AdminFormType & {
  role: 'admin' | 'moderator' | 'user';
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export type PostsType = {
  posts: PostType[];
  total: number;
  skip: number;
  limit: number;
};
export type GetUsersType = {
  users: GetUserType[];
  total: number;
  skip: number;
  limit: number;
};

export type PostType = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: ReactionsType;
  views: number;
  userId: number;
};

export type ReactionsType = {
  likes: number;
  dislikes: number;
};

export type ColumnType = {
  key: string;
  label: string;
  width: string;
};

export type GetUserType = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: Roles;
};

export interface Hair {
  color: string;
  type: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address2;
}

export interface Address2 {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates2;
  country: string;
}

export interface Coordinates2 {
  lat: number;
  lng: number;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface PostCommentsType {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: User;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
}

export type SortStateType = { sortBy: string; direction: DirectionType };

export type DirectionType = 'asc' | 'desc';

export interface GetParams<TSortBy = string | number> {
  limit?: string;
  skip?: string;
  sortBy?: TSortBy[];
  order?: DirectionType;
}

export type PaginationChange =
  | { type: 'limit'; value: string }
  | { type: 'page'; value: number };
