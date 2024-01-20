export const getToken = () => {
  // Retrieve the token from local storage or your state management library
  const token = sessionStorage.getItem(import.meta.env.VITE_OPS_COOKIE_NAME);
  return token;
};