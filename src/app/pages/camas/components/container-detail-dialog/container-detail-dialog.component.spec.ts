import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDetailDialogComponent } from './container-detail-dialog.component';

describe('ContainerDetailDialogComponent', () => {
  let component: ContainerDetailDialogComponent;
  let fixture: ComponentFixture<ContainerDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
