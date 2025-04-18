import { Minute2hourPipe } from './minute2hour.pipe';

describe('Minute2hourPipe', () => {
  it('create an instance', () => {
    const pipe = new Minute2hourPipe();
    expect(pipe).toBeTruthy();
  });
});
