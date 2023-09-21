import { Request, Response, Server } from '../type';
import { Options } from './options';
import { HTTP_INTERCEPTORS } from './constants';
import http from 'node:http';
import https from 'node:https';

export class ProxyServer {
  private options: Options;
  private server!: Server;
  httpProxyCallback!: (req: Request, res: Response) => void;

  constructor(options: Options) {
    this.options = options;
  }

  create() {
    this.httpProxyCallback = this.createProxyCallback();
  }

  listen(port: string | number, hostname?: string) {
    const _port = Number(port);
    const { ssl } = this.options.get();
    const _httpProxyCallback = (req: Request, res: Response) => {
      this.httpProxyCallback(req, res);
    };
    this.server = ssl
      ? https.createServer(ssl, _httpProxyCallback)
      : http.createServer(_httpProxyCallback);

    this.server.listen(_port, hostname);

    return this;
  }

  close(cb: (err?: Error) => void) {
    this.server?.close(err => {
      cb(err);
    });
  }

  createProxyCallback() {
    const options = this.options.get();
    const server = this.server;
    return function (req: Request, res: Response) {
      console.log(req, res, HTTP_INTERCEPTORS);
      HTTP_INTERCEPTORS.forEach(interceptor => {
        interceptor(req, res, options, server);
      });
    };
  }
}
