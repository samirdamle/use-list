import { useMemo } from 'react';

interface UseListResult<T> {
  items: T[];
  columns: string[];
  isEmpty: boolean;
}

const useList = <T extends object>(items: T[] = []): UseListResult<T> => {
  const columns = useMemo(() => {
    if (items.length === 0) return [];
    return Object.keys(items[0]);
  }, [items]);

  return {
    items,
    columns,
    isEmpty: items.length === 0,
  };
};

export default useList;