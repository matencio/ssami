import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamasDialogComponent } from './camas-dialog.component';

describe('CamasDialogComponent', () => {
  let component: CamasDialogComponent;
  let fixture: ComponentFixture<CamasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamasDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
