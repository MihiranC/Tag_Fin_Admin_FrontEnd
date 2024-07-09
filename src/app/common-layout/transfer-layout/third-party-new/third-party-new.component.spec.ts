import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyNewComponent } from './third-party-new.component';

describe('ThirdPartyNewComponent', () => {
  let component: ThirdPartyNewComponent;
  let fixture: ComponentFixture<ThirdPartyNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
