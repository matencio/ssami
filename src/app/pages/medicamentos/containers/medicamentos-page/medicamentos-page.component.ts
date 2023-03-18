import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CamasService } from 'src/app/pages/camas/services/camas.service';
import { MedicamentosDialogComponent } from '../../components/medicamentos-dialog/medicamentos-dialog.component';

@Component({
  selector: 'app-medicamentos-page',
  templateUrl: './medicamentos-page.component.html',
  styleUrls: ['./medicamentos-page.component.scss']
})
export class MedicamentosPageComponent implements OnInit {
  public displayedColumns: string[] = ['nombre', 'tipo', 'actions']; //, 'dosisMaxima'
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  data: any;

  public isShowFilterInput = false;
  searchTerm = '';
  searchVisible = false;
  tipoList = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('search') searchElement: ElementRef;

  isLoading: boolean = false;

  pacienteFormGroup: FormGroup;
  @ViewChild('detalleDialog') detalleDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;

    this.dataSource = new MatTableDataSource<any>(this.data);
    //Translate Paginator
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Cant. de Medicamentos por página';
    this.dataSource.paginator._intl.previousPageLabel = 'Anterior';
    this.dataSource.paginator._intl.nextPageLabel = 'Siguiente';
    this.dataSource.paginator._intl.firstPageLabel = 'Primer Página';
    this.dataSource.paginator._intl.lastPageLabel = 'Última Página';
    this.dataSource.paginator._intl.getRangeLabel = (page, pageSize, length) => {
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

    this.getTipoMedicamento();

    this.buildGrid();
  }

  getTipoMedicamento() {
    this.services.getTipoMedicamento().subscribe(
      data => {
        if (data && data.tipoMedicamento) {
          this.tipoList = data.tipoMedicamento;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  getTipoMedicamentoDescripcion(id) {
    const tipoMedicamento = this.tipoList.find(u => u.id === id);
    return tipoMedicamento ? tipoMedicamento.descripcion : tipoMedicamento;
  }

  buildGrid() {
    this.services.getMedicamentos().subscribe(
      data => {
        if (data) {
          this.data = data.medicamentos;
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate =
            (data: any, filter: string) => {
              const filterValue = filter ? filter.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ''
              return (
                (data.nombre.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(filterValue) !== -1)
                  || (this.getTipoMedicamentoDescripcion(data.TipoMedicamentoId).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(filterValue) != -1)
                )
            }    
          setTimeout(() => { this.isLoading = false; }, 1000)
        }
      }, error => {
        console.error(error)
        this.isLoading = false;
      }
    );
  }

  createMedicamento() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";

    const dialogRef = this.dialog.open(MedicamentosDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && 'OK' === result) {
        this.isLoading = true;
        this.buildGrid();
        // this.toastr.error("Ocurrió un error al intentar obtener las Evoluciones")
      }
    });
  }

  editarMedicamento(medicamento) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";

    dialogConfig.data = {
      id: medicamento.id,
      isView: false
    };

    const dialogRef = this.dialog.open(MedicamentosDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && 'OK' === result) {
        this.isLoading = true;
        this.buildGrid();
        // this.toastr.error("Ocurrió un error al intentar obtener las Evoluciones")
      }
    });
  }

  verMedicamento(medicamento) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = {
      id: medicamento.id,
      isView: true
    };

    const dialogRef = this.dialog.open(MedicamentosDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && 'OK' === result) {
        //this.isLoading = true;
        //this.buildGrid();
        // this.toastr.error("Ocurrió un error al intentar obtener las Evoluciones")
      }
    });
  }

  // Search
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createFilter(): (data: any, filter: string) => boolean {
    var _this = this;
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      //var compareDate = moment();
      return (data.nombre.toString().toLowerCase().indexOf(searchTerms) !== -1
        || (data.tipoMedicamento.toString().toLowerCase().indexOf(searchTerms) !== -1)
      )
    }
    return filterFunction;
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource.filter = ""; //refresh filter

    if (this.isShowFilterInput) {
      setTimeout(()=>{
        this.searchElement.nativeElement.focus();
      },0); 
    }
  }

  handleSearch(r) {
    if (r.action === 'SEARCH') {
      this.searchTerm = r.query;
    }
  }

}
