const protectedRouteRedirectUrl = (url: URL, message: string = 'Sign in to view this page') => {
  const redirectTo = `${url.pathname}${url.search}`;
  return `/login?redirectTo=${redirectTo}&message=${message}`;
};

export default protectedRouteRedirectUrl;
