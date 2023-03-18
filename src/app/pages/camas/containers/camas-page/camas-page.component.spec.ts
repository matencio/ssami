import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamasPageComponent } from './camas-page.component';

describe('CamasPageComponent', () => {
  let component: CamasPageComponent;
  let fixture: ComponentFixture<CamasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamasPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
