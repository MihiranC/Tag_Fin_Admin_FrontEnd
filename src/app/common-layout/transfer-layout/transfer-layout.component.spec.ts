import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLayoutComponent } from './transfer-layout.component';

describe('TransferLayoutComponent', () => {
  let component: TransferLayoutComponent;
  let fixture: ComponentFixture<TransferLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
