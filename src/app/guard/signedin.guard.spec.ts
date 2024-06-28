import { TestBed } from '@angular/core/testing';

import { SignedinGuard } from './signedin.guard';

describe('SignedinGuard', () => {
  let guard: SignedinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SignedinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
