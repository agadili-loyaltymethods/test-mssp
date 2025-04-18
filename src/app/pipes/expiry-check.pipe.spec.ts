import { ExpiryCheckPipe } from './expiry-check.pipe';

describe('ExpiryCheckPipe', () => {
  it('create an instance', () => {
    const pipe = new ExpiryCheckPipe();
    expect(pipe).toBeTruthy();
  });
});
