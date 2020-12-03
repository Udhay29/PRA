import { SearchAgreementModule } from './search-agreement.module';

describe('SearchAgreementModule', () => {
  let searchAgreementModule: SearchAgreementModule;

  beforeEach(() => {
    searchAgreementModule = new SearchAgreementModule();
  });

  it('should create an instance', () => {
    expect(searchAgreementModule).toBeTruthy();
  });
});
