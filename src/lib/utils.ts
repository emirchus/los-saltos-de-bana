import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { endOfWeek, startOfWeek } from 'date-fns';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(type: 'error' | 'success', path: string, message: string): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function getWeek() {
  const now = new Date();
  const start = startOfWeek(now);
  const end = endOfWeek(now);
  return {
    start,
    end,
  };
}
