import pck from '../package.json';

const NAME = pck.name;
const VERSION = pck.version;

const IS_SSL = /^https|wss/;

export const throwError = (msg: string) => {
  throw new Error(`[${NAME} ${VERSION}] ${msg}`);
};

export const checkEncryptedConnection = (req: any) => {
  const { connection } = req;
  return Boolean(connection.encrypted || connection.pair);
};

export const getPort = (req: any): string => {
  const host = req.headers.host ? req.headers.host.match(/:(\d+)/) : null;

  return host ? host[1] : checkEncryptedConnection(req) ? '443' : '80';
};

export const setupRequest = () => {}
