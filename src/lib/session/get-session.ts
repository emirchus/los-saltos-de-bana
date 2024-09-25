'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { sessionOptions } from '@/lib/session';

import type { SessionData } from '@/lib/session';

export async function getSession() {
  return getIronSession<SessionData>(cookies() as never, sessionOptions);
}
