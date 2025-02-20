import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';

describe('TradeController (e2e)', () => {
  let app: INestApplication<App>;
  const mockAggTradesResponse = [
    {
      a: 190297594,
      p: '0.00668900',
      q: '0.16500000',
      f: 269149168,
      l: 269149168,
      T: 1740065653609,
      m: true,
      M: true,
    },
    {
      a: 190297595,
      p: '0.00669000',
      q: '0.02000000',
      f: 269149169,
      l: 269149169,
      T: 1740065670056,
      m: false,
      M: true,
    },
    {
      a: 190297596,
      p: '0.00669000',
      q: '0.32300000',
      f: 269149170,
      l: 269149170,
      T: 1740065675512,
      m: false,
      M: true,
    },
  ];
  const mockAggTradesError = {
    code: -1121,
    msg: 'Invalid symbol.',
  };
  const mockAnalyzeResponse = {
    totalTrades: 3,
    priceDecreasedTotalTimes: 0,
    priceIncreasedTotalTimes: 1,
    maxIncreasedBy: 0.0000010000000000001327,
    maxDecreasedBy: 0,
    tradeWithLowestPrice: {
      tradeId: 190297594,
      price: '0.00668900',
      quantity: '0.16500000',
      firstTradeId: 269149168,
      lastTradeId: 269149168,
      timestamp: 1740065653609,
      isMaker: true,
      isBestPriceMatch: true,
    },
    tradeWithHighestPrice: {
      tradeId: 190297595,
      price: '0.00669000',
      quantity: '0.02000000',
      firstTradeId: 269149169,
      lastTradeId: 269149169,
      timestamp: 1740065670056,
      isMaker: false,
      isBestPriceMatch: true,
    },
  };

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

    it('successes', async () => {
      nock('https://api.binance.com')
        .get('/api/v3/aggTrades')
        .query({
          symbol: 'BNBBTC',
          startTime: 1740060576444,
          endTime: 1740060616692,
          limit: 500,
        })
        .reply(200, mockAggTradesResponse);

      return request(app.getHttpServer())
        .post('/trades/analyze')
        .send({
          symbol: 'BNBBTC',
          startTime: 1740060576444,
          endTime: 1740060616692,
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect(mockAnalyzeResponse);
    });

    it('returns error when binance API is not responding', async () => {
      nock('https://api.binance.com')
        .get('/api/v3/aggTrades')
        .query({
          symbol: 'BNBBTC',
          startTime: 1740060576444,
          endTime: 1740060616692,
          limit: 500,
        })
        .reply(400, mockAggTradesError);

      return request(app.getHttpServer())
        .post('/trades/analyze')
        .send({
          symbol: 'BNBBTC',
          startTime: 1740060576444,
          endTime: 1740060616692,
        })
        .set('Accept', 'application/json')
        .expect(502)
        .expect({
          statusCode: 502,
          message: 'Could not retrieve historic trades',
        });
    });
  });
});
