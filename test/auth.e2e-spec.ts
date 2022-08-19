import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'hannah.doe@mail.com',
  password: '1234',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '123' })
      .expect(401, {
        statusCode: 401,
        message: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - nonexistent login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'max.adams@mail.com' })
      .expect(401, {
        statusCode: 401,
        message: 'There is no user with such email',
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
