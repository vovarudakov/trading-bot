import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/trades/analyze (POST)', () => {
    describe('incorrect payload', () => {
      it('symbol is missing', async () => {
        return request(app.getHttpServer())
          .post('/trades/analyze')
          .send({
            startTime: 1740060576444,
            endTime: 1740060616692,
          })
          .set('Accept', 'application/json')
          .expect(400)
          .expect({
            message: ['symbol must be a string'],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('time in wrong format', async () => {
        return request(app.getHttpServer())
          .post('/trades/analyze')
          .send({
            symbol: 'BNBBTC',
            startTime: '2018-01-01',
            endTime: '2018-01-01',
          })
          .set('Accept', 'application/json')
          .expect(400)
          .expect({
            message: [
              'startTime must be a number conforming to the specified constraints',
              'endTime must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
    });
  });
});
