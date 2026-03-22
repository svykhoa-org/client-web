import type { Searcher, Sorter } from '../types/query.types';

export const buildSorterParams = <T>(sorter: Sorter<T>) => {
  return Object.keys(sorter).reduce((acc, key) => {
    const sortKey = `${key}[sort]`;
    return {
      ...acc,
      [sortKey]: sorter[key as keyof T],
    };
  }, {});
};

export const buildSearcherParams = <T>(searcher: Searcher<T>) => {
  return Object.keys(searcher).reduce((acc, key) => {
    const { op, value } = searcher[key as keyof T] || {};
    if (op && value !== undefined) {
      const searchKey = `${key}[${op}]`;
      return {
        ...acc,
        [searchKey]: Array.isArray(value) ? value.join(',') : value,
      };
    }
    return acc;
  }, {});
};
