import jwt from 'jsonwebtoken';
import { AuthRequest, AuthToken, InternalError, ErrorType, Person } from '../models';
import { PersonService } from './person';
import LoggerService from '../configs/logger';

export class AuthService {
  private readonly personService: PersonService;
  private readonly loggerService: LoggerService;
  public readonly secret: string;

  constructor(personService: PersonService, loggerService: LoggerService, secret: string) {
    this.personService = personService;
    this.loggerService = loggerService;
    this.secret = secret;
  }

  public generateToken(credentials: AuthRequest): Promise<AuthToken> {
    return this.personService
      .getByLogin(credentials.login)
      .catch((err) => {
        throw err;
      })
      .then((person) => {
        if (person.isDeleted) {
          throw new InternalError(
            'User with deleted status can not logged in',
            ErrorType.BAD_REQUEST
          );
        }
        if (person.password !== credentials.password) {
          throw new InternalError(
            'Invalid username or password was specified',
            ErrorType.BAD_REQUEST
          );
        }
        return person;
      })
      .then((person) => this.buildToken(person));
  }

  validateToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(token, this.secret);
        resolve();
      } catch (err) {
        reject(err);
      }
    })
      .then((result) => {
        if (!result) {
          throw new InternalError('empty token verification result');
        }
      })
      .catch((err) => {
        this.loggerService.debug({ message: 'token verification failed', reason: err, token });
        throw new InternalError('Acces forbidden', ErrorType.FORBIDDEN);
      });
  }

  private buildToken(person: Person): AuthToken {
    return { token: jwt.sign({ id: person.id }, this.secret, { expiresIn: 360 }) };
  }
}
