import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucionDialogComponent } from './evolucion-dialog.component';

describe('EvolucionDialogComponent', () => {
  let component: EvolucionDialogComponent;
  let fixture: ComponentFixture<EvolucionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolucionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolucionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
