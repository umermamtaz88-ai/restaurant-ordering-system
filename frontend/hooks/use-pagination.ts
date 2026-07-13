"use client";

import { useEffect, useState } from "react";

export function useSearch(initialValue = "", delay = 300) {
  const [search, setSearch] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), delay);
    return () => clearTimeout(timer);
  }, [search, delay]);

  return { search, setSearch, debouncedSearch };
}

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const resetPage = () => setPage(1);

  return { page, setPage, limit, setLimit, resetPage };
}
