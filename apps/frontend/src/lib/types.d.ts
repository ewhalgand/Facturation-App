export type userData = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};

export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  image?: string;
};

export type Errors = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
