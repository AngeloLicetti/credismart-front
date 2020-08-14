import { TestBed, inject } from '@angular/core/testing';

import { AuthenticateHttpService } from './authenticate-http.service';

describe('AuthenticateHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticateHttpService]
    });
  });

  it('should be created', inject([AuthenticateHttpService], (service: AuthenticateHttpService) => {
    expect(service).toBeTruthy();
  }));
});
