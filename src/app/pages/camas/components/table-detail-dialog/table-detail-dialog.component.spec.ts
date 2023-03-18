import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetailDialogComponent } from './table-detail-dialog.component';

describe('TableDetailDialogComponent', () => {
  let component: TableDetailDialogComponent;
  let fixture: ComponentFixture<TableDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
