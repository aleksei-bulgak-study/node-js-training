import { Router } from 'express';

export default interface RouterWrapper {
  readonly router: Router;
  readonly path: string;

  isSecured(): boolean;
}
