import { StandardCurrencyPipe } from './standard-currency.pipe';

describe('StandardCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new StandardCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
