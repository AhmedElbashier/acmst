import { TestBed } from '@angular/core/testing';

import { StudantService } from './studant.service';

describe('StudantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudantService = TestBed.get(StudantService);
    expect(service).toBeTruthy();
  });
});
