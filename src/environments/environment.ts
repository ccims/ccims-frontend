const host = 'http://localhost:8080';
export const environment = {
  production: false,
  apiUrl: `${host}/api`,
  // url for public api endpoint offering signup
  signUpUrl: `${host}/api/public`,
  loginUrl: `${host}/login`,
  publicClientName: 'publicClient',
};
