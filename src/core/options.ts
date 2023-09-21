import type { IOptions, IRequiredOptions } from '../type';
import { throwError } from '../utils';
import url from 'node:url';

export class Options {
  private baseOptions!: IOptions;
  private options!: IOptions | IRequiredOptions;

  constructor(options: IOptions) {
    this.validate(options);
    this.init(options);
  }

  validate(options: IOptions) {
    const { target } = options;

    if (!target) {
      throwError('Non compliant target');
    }
  }

  init(options: IOptions) {
    this.baseOptions = options;
    const { target = '', prepend = true, xForwarded = false, ssl } = options;

    this.options = {
      target: url.parse(target),
      prepend,
      xForwarded,
      ssl,
    } as IRequiredOptions;
  }

  set<T extends keyof IOptions>(key: T, value: IOptions[T]) {
    this.options[key] = value;
  }

  get() {
    return this.options as IRequiredOptions;
  }

  getBase() {
    return this.baseOptions;
  }
}
