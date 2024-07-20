import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountCategoriesComponent } from './sub-account-categories.component';

describe('SubAccountCategoriesComponent', () => {
  let component: SubAccountCategoriesComponent;
  let fixture: ComponentFixture<SubAccountCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAccountCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAccountCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
