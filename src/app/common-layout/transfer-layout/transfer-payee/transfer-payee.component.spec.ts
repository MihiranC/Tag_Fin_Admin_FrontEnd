import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPayeeComponent } from './transfer-payee.component';

describe('TransferPayeeComponent', () => {
  let component: TransferPayeeComponent;
  let fixture: ComponentFixture<TransferPayeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPayeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferPayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
