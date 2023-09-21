import { RequestMethod, Proto, Request, Response, HttpInterceptorsMap } from '../type';
import type { IRequiredOptions } from '../type';
import { checkEncryptedConnection, getPort } from '../utils';
import http from 'node:http';
import https from 'node:https';

export const REQUEST_TYPES = ['http', 'ws'];

const X_FORWARDED_PREFIX = 'x-forwarded-';

export const HTTP_INTERCEPTORS_MAP: HttpInterceptorsMap = {
  // DELETE 请求时 content-length 置零
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lengthToZeroWhenDelete(req, res, options, server) {
    const { method, headers } = req;
    const isDelete = [RequestMethod.DELETE, RequestMethod.OPTIONS].includes(
      String(method).toUpperCase() as RequestMethod,
    );
    const isHasLength = headers['content-length'];
    if (isDelete && !isHasLength) {
      req.headers['content-length'] = '0';
      delete req.headers['transfer-encoding'];
    }
  },
  // 负载均衡或代理时，记录原始ip
  // 例子：第一个原始ip，后面的是每次代理的ip
  // X-Forwarded-For: 203.0.113.195, 70.41.3.18, 150.172.238.178
  // 原始请求协议
  // X-Forwarded-Proto: https
  // 原始请求端口号
  // X-Forwarded-Port: 8080
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addXForwarded(req, res, options, server) {
    const { xForwarded } = options;

    if (!xForwarded) return;

    const { connection, headers, socket } = req;

    const isEncrypted = checkEncryptedConnection(req);

    const xForwardedMap: Record<string, any> = {
      for: connection.remoteAddress || socket.remoteAddress,
      port: getPort(req),
      proto: isEncrypted ? Proto.Https : Proto.Http,
    };

    Object.keys(xForwardedMap).forEach(key => {
      const _key = `${X_FORWARDED_PREFIX}${key}`;
      const currentXForwardedHeader = headers[_key] ? `${headers[_key]},` : '';
      req.headers[_key] = `${currentXForwardedHeader}${xForwardedMap[key]}`;
    });
  },
  request(req, res, options, server) {
    const { target } = options;
    server.emit('start', req, res, target);

    const proxyReq = target.protocol === 'https' ? https : http;
  },
};

export const HTTP_INTERCEPTORS = Object.keys(HTTP_INTERCEPTORS_MAP).map(key => {
  return HTTP_INTERCEPTORS_MAP[key];
});

export const WS_INTERCEPTORS_MAP: Record<string, any> = {
  // DELETE 请求时 content-length 置零
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lengthToZeroWhenDelete(req: Request, res: Response, options: IRequiredOptions) {
    const { method, headers } = req;
    const isDelete = [RequestMethod.DELETE, RequestMethod.OPTIONS].includes(
      String(method).toUpperCase() as RequestMethod,
    );
    const isHasLength = headers['content-length'];
    if (isDelete && !isHasLength) {
      req.headers['content-length'] = '0';
      delete req.headers['transfer-encoding'];
    }
  },
  // 负载均衡或代理时，记录原始ip
  // 例子：第一个原始ip，后面的是每次代理的ip
  // X-Forwarded-For: 203.0.113.195, 70.41.3.18, 150.172.238.178
  // 原始请求协议
  // X-Forwarded-Proto: https
  // 原始请求端口号
  // X-Forwarded-Port: 8080
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addXForwarded(req: Request, res: Response, options: IRequiredOptions) {
    const { xForwarded } = options;

    if (!xForwarded) return;

    const { connection, headers, socket } = req;

    const isEncrypted = checkEncryptedConnection(req);

    const xForwardedMap: Record<string, any> = {
      for: connection.remoteAddress || socket.remoteAddress,
      port: getPort(req),
      proto: isEncrypted ? Proto.Https : Proto.Http,
    };

    Object.keys(xForwardedMap).forEach(key => {
      const _key = `${X_FORWARDED_PREFIX}${key}`;
      const currentXForwardedHeader = headers[_key] ? `${headers[_key]},` : '';
      req.headers[_key] = `${currentXForwardedHeader}${xForwardedMap[key]}`;
    });
  },
};

export const WS_INTERCEPTORS = Object.keys(HTTP_INTERCEPTORS_MAP).map(key => {
  return WS_INTERCEPTORS_MAP[key];
});
