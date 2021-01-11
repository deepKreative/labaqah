import { TestBed } from '@angular/core/testing';

import { CustService } from './cust.service';

describe('CustService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustService = TestBed.get(CustService);
    expect(service).toBeTruthy();
  });
});
