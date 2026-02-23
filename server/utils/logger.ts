import pino from "pino";

const isProd = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL ?? (isProd ? "info" : "debug");

export const logger = pino({
  level: logLevel,
  base: {
    service: "bharatsolve-api",
    env: process.env.NODE_ENV ?? "development",
    version: process.env.npm_package_version ?? "1.0.0",
  },
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss",
          },
        },
      }),
});

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/** Create a child logger with bound context (e.g. requestId) */
export function child(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}
