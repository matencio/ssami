import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-detail-dialog',
  templateUrl: './table-detail-dialog.component.html',
  styleUrls: ['./table-detail-dialog.component.css']
})
export class TableDetailDialogComponent implements OnInit {
  public _dataSource = new MatTableDataSource([]);
  public displayedColumns: string[];
  @Input() columns: TableColumn[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  @Input() set dataSource(data: any[]) {
    this.setDataSource(data);
  }

  constructor() {
   }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((tableColumn: TableColumn) => tableColumn.caption);
  }


  setDataSource(data: any) {
    this._dataSource = new MatTableDataSource<any>(data);
    //Translate Paginator
    this._dataSource.paginator = this.paginator;
    this._dataSource.paginator = this.paginator;
    this._dataSource.paginator._intl.itemsPerPageLabel = 'Cant. de elementos por página';
    this._dataSource.paginator._intl.previousPageLabel = 'Anterior';
    this._dataSource.paginator._intl.nextPageLabel = 'Siguiente';
    this._dataSource.paginator._intl.firstPageLabel = 'Primer Página';
    this._dataSource.paginator._intl.lastPageLabel = 'Última Página';
    this._dataSource.paginator._intl.getRangeLabel = (page, pageSize, length)  => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
  }

}

export interface TableColumn {
  caption: string;
  field: string;
  pipe: string;
}