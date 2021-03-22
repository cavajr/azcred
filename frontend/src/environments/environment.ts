export const environment = {
  production: false,
  apiUrl: "http://localhost:8000/api",
  url: "http://localhost:8000",

  tokenWhitelistedDomains: ["localhost:8000"],
  tokenBlacklistedRoutes: ["localhost:8000/auth/"]
};
