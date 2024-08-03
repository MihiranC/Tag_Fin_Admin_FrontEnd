import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalGenerateComponent } from './cal-generate.component';

describe('CalGenerateComponent', () => {
  let component: CalGenerateComponent;
  let fixture: ComponentFixture<CalGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
