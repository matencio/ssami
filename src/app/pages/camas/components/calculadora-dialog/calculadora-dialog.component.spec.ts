import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraDialogComponent } from './calculadora-dialog.component';

describe('CalculadoraDialogComponent', () => {
  let component: CalculadoraDialogComponent;
  let fixture: ComponentFixture<CalculadoraDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculadoraDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
