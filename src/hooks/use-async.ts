import { useCallback, useState } from 'react';

export default function useAsync() {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const mutateAsync = useCallback(async (callback: Function) => {
    setLoading(true);
    try {
      return await callback();
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, mutateAsync };
}
