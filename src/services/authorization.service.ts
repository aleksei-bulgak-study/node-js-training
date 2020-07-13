import jwt from 'jsonwebtoken';
import { AuthRequest, AuthToken, InternalError, ErrorType, Person } from '../models';
import { PersonService } from './person';
import LoggerService from '../configs/logger';

export class AuthService {
  private static readonly EXPIRATION_TTL: string = '300s';
  private static readonly AUTH_TOKEN_PREFIX: string = 'Bearer';
  private readonly personService: PersonService;
  private readonly loggerService: LoggerService;
  public readonly secret: string;

  constructor(personService: PersonService, loggerService: LoggerService, secret: string) {
    this.personService = personService;
    this.loggerService = loggerService;
    this.secret = secret;
  }

  public async generateToken(credentials: AuthRequest): Promise<AuthToken> {
      const person = await this.personService.getByLogin(credentials.login);
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
      return this.buildToken(person);
  }

  public validateToken(token: string): void {
    let result;
    try {
      token = token.substring(AuthService.AUTH_TOKEN_PREFIX.length, token.length).trim();
      result = jwt.verify(token, this.secret);
    } catch (err) {
      this.loggerService.debug({ message: 'token verification failed', reason: err, token });
      throw new InternalError('Acces forbidden', ErrorType.FORBIDDEN);
    }
    if (!result) {
      throw new InternalError('empty token verification result');
    }
  }

  private buildToken(person: Person): AuthToken {
    return {
      token: jwt.sign({ id: person.id }, this.secret, { expiresIn: AuthService.EXPIRATION_TTL }),
    };
  }
}
