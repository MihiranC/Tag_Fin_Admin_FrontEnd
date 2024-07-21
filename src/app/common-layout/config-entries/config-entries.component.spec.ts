import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEntriesComponent } from './config-entries.component';

describe('ConfigEntriesComponent', () => {
  let component: ConfigEntriesComponent;
  let fixture: ComponentFixture<ConfigEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
