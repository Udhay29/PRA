import { ReturnInitialsFromNamePipe } from './return-initials-from-name.pipe';

describe('ReturnInitialsFromNamePipe', () => {
  let pipe: ReturnInitialsFromNamePipe;

  beforeEach(() => {
    pipe = new ReturnInitialsFromNamePipe();
  });

  it('transforms X to Y', () => {
    const value: any = 'Ramesh Ulaganathan';
    const args: string[] = [];

    expect(pipe.transform(value, args)).toEqual('RU');
  });
});
