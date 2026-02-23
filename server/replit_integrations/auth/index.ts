export { setupAuth, isAuthenticated, getSession } from "./replitAuth";
export { authStorage, type IAuthStorage } from "./storage";
export { registerAuthRoutes } from "./routes";
export { isAdminUser, isAdmin, hasValidAdminSession, checkAdminCredentials, getDefaultAdminCredentials, setAdminCookie, clearAdminCookie } from "./adminAuth";
