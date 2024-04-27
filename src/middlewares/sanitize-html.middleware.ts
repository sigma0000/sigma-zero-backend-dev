import type { NextFunction, Request, Response } from 'express';
import sanitize from 'sanitize-html';

export function sanitizeMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  request.body = sanitizeHtml(request.body);
  request.query = sanitizeHtml(request.query);
  request.params = sanitizeHtml(request.params);

  next();
}

export const sanitizeHtml = <T extends string | Record<string, unknown>>(
  object: T,
): T => {
  if (typeof object === 'bigint') {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(sanitizeHtml) as unknown as T;
  }

  if (typeof object === 'string') {
    return doSanitize(object) as unknown as T;
  }

  const { withouBigint, bigIntFields } = Object.entries(object).reduce(
    (acc, [key, value]) => {
      if (typeof value !== 'bigint') {
        acc.withouBigint[key] = value;
        return acc;
      }
      acc.bigIntFields[key] = value;
      return acc;
    },
    {
      bigIntFields: {} as Record<string, unknown>,
      withouBigint: {} as Record<string, unknown>,
    },
  );
  const data = JSON.parse(JSON.stringify(withouBigint));

  Object.keys(object).forEach((field) => {
    if (typeof data[field] === 'string') {
      data[field] = doSanitize(data[field]);
    } else if (Array.isArray(data[field])) {
      data[field] = data[field].map(sanitizeHtml);
    } else if (isObject(data[field])) {
      data[field] = sanitizeHtml(data[field]);
    }
  });

  return { ...data, ...bigIntFields };
};

const doSanitize = (value: string) =>
  sanitize(value, {
    allowedTags: [],
    allowedAttributes: {},
    nonTextTags: ['script', 'textarea', 'noscript', 'style'],
    allowedSchemesByTag: {
      img: ['data', ...sanitize.defaults.allowedSchemes],
    },
  });

const isObject = (object: unknown) =>
  object === Object(object) && typeof object !== 'function';
