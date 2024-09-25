import type { SessionOptions } from 'iron-session';

export interface SessionData {
  token?: string;
  createdAt?: number;
}

export const sessionOptions: SessionOptions = {
  password: process.env.cookie as string,
  cookieName: 'auth',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    expires: new Date(Date.now() + 60 * 60 * 8 * 1000),
  },
};

declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}
