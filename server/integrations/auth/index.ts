export { setupAuth, isAuthenticated, getSession } from "./auth";
export { authStorage, type IAuthStorage } from "./storage";
export { registerAuthRoutes } from "./routes";
export { isAdminUser, isAdmin, hasValidAdminSession, checkAdminCredentials, getDefaultAdminCredentials, setAdminCookie, clearAdminCookie } from "./adminAuth";
