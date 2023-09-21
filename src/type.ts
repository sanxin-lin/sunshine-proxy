import http from 'node:http';
import { UrlWithStringQuery } from 'node:url';

export type Request = http.IncomingMessage;
export type Response = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};
export type HttpProxyCallback = Parameters<typeof http.createServer>[0];

export type Server = ReturnType<typeof http.createServer>;

export const enum Proto {
  Https = 'https',
  Http = 'http',
  Websockets = 'ws',
}

export const enum RequestType {
  Http = 0,
  Websockets = 1,
}

export const enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  OPTIONS = 'OPTIONS',
}

export interface IOptions {
  target?: string;
  prepend?: boolean;
  xForwarded?: boolean;
  ssl?: {
    [key: string]: any;
  };
}

export type IRequiredOptions = Required<Omit<IOptions, 'target'>> & { target: UrlWithStringQuery };

export type HttpInterceptors = (
  req: Request,
  res: Response,
  options: IRequiredOptions,
  server: Server,
) => void;

export type HttpInterceptorsMap = Record<string, HttpInterceptors>;
