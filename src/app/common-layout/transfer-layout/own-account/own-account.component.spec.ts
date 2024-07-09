import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAccountComponent } from './own-account.component';

describe('OwnAccountComponent', () => {
  let component: OwnAccountComponent;
  let fixture: ComponentFixture<OwnAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
