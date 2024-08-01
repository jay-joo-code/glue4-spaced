const updateUrlWithSearchParam = (url: URL, key: string, value: string | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }

  return url.toString();
};

export default updateUrlWithSearchParam;
