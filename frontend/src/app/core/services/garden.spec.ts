import { TestBed } from '@angular/core/testing';

import { Garden } from './garden';

describe('Garden', () => {
  let service: Garden;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Garden);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
