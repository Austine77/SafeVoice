export function validatePortalLogin(expectedUsername, expectedPassword, username, password) {
  return username === expectedUsername && password === expectedPassword;
}
