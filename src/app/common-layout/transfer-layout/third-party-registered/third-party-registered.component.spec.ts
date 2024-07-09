import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyRegisteredComponent } from './third-party-registered.component';

describe('ThirdPartyRegisteredComponent', () => {
  let component: ThirdPartyRegisteredComponent;
  let fixture: ComponentFixture<ThirdPartyRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyRegisteredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
