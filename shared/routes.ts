import { z } from 'zod';
import { insertProblemSchema, insertDiscussionMessageSchema, insertFeedbackSchema, problems, userProfiles, discussionMessages, feedback } from './schema';

/** API version prefix. Use /api/v1 for all API routes. Health and webhooks remain unversioned. */
export const API_V1 = '/api/v1';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
};

export const api = {
  problems: {
    list: {
      method: 'GET' as const,
      path: `${API_V1}/problems` as const,
      responses: {
        200: z.object({
          problems: z.array(z.custom<typeof problems.$inferSelect>()),
          total: z.number(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: `${API_V1}/problems` as const,
      input: insertProblemSchema,
      responses: {
        201: z.custom<typeof problems.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden, // For expired subscriptions
      },
    },
    get: {
      method: 'GET' as const,
      path: `${API_V1}/problems/:id` as const,
      responses: {
        200: z.custom<typeof problems.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    listMessages: {
      method: 'GET' as const,
      path: `${API_V1}/problems/:id/messages` as const,
      responses: {
        200: z.array(z.custom<typeof discussionMessages.$inferSelect>()),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    sendMessage: {
      method: 'POST' as const,
      path: `${API_V1}/problems/:id/messages` as const,
      input: insertDiscussionMessageSchema,
      responses: {
        201: z.object({
          userMessage: z.custom<typeof discussionMessages.$inferSelect>(),
          aiMessage: z.custom<typeof discussionMessages.$inferSelect>(),
        }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  userProfiles: {
    get: {
      method: 'GET' as const,
      path: `${API_V1}/profile` as const,
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    submitReferral: {
      method: 'POST' as const,
      path: `${API_V1}/profile/referral` as const,
      input: z.object({ referralCode: z.string() }),
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    subscribe: {
      method: 'POST' as const,
      path: `${API_V1}/profile/subscribe` as const,
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  feedback: {
    submit: {
      method: 'POST' as const,
      path: `${API_V1}/feedback` as const,
      input: insertFeedbackSchema,
      responses: {
        201: z.custom<typeof feedback.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
