import { Router } from 'express';

interface RouterWrapper {
  readonly router: Router;
  readonly path: string;
}

export default RouterWrapper;
