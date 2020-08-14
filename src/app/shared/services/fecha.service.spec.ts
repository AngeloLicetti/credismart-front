import { TestBed, inject } from '@angular/core/testing';

import { FechaService } from './fecha.service';

describe('FechaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FechaService]
    });
  });

  it('should be created', inject([FechaService], (service: FechaService) => {
    expect(service).toBeTruthy();
  }));
});
