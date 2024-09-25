import axios from 'axios';

import type { AxiosInstance } from 'axios';

const axiosClientSingleton = () => {
  return createClient({
    baseServerUrl: `${process.env.NODE_ENV === 'production' ? 'https://' : ''}${process.env.NEXT_PUBLIC_VERCEL_URL}/api`,
    baseUrl: `/api`,
  });
};

type AxiosClientSingleton = ReturnType<typeof axiosClientSingleton>;

const globalForAxios = globalThis as unknown as {
  axios: AxiosClientSingleton | undefined;
};

export const client: AxiosInstance = globalForAxios.axios ?? axiosClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForAxios.axios = client;

function createClient({ baseServerUrl, baseUrl }: { baseUrl: string; baseServerUrl: string }): AxiosInstance {
  const getUrl = () => {
    if (typeof window === 'undefined') return baseServerUrl;

    return baseUrl;
  };

  const client = axios.create({
    baseURL: getUrl(),
    timeout: 2147483647,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  client.interceptors.request.use(async config => {
    // TODO: Add token to request

    return config;
  });

  return client;
}

const createResources = (client: AxiosInstance) => {
  return {};
};

export const resources = createResources(client);
