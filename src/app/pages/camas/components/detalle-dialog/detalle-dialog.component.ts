import { Component, EventEmitter, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CamasService } from '../../services/camas.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { EvolucionDialogComponent } from '../evolucion-dialog/evolucion-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ContainerDetailDialogComponent } from '../container-detail-dialog/container-detail-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { TestImages } from '../evolucion-dialog/testImages';

@Component({
  selector: 'app-detalle-dialog',
  templateUrl: './detalle-dialog.component.html',
  styleUrls: ['./detalle-dialog.component.css']
})
export class DetalleDialogComponent implements OnInit {
  panelOpenState = false;
  loadingEvoluciones = false;
  displayedColumns: string[] = ['fecha', 'detalles'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  onEvolucionar = new EventEmitter();

  myData = [];
  myColumns = [];
  title: string;
  isShowTodas: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DetalleDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>([]); 
      this.dataSource.paginator = this.paginator;

      this.loadingEvoluciones = true;

      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.getEvoluciones(this.data.Paciente.Internacions[0].id, this.isShowTodas)
    }, 100);
  }

  evolucionarNO() {
    //for test
    this.onEvolucionar.emit(this.data);
  }

  showTableDetail() {
    //verDetalles(element) 
  }

  mostrarTodas() {
    this.isShowTodas = !this.isShowTodas; 
    this.getEvoluciones(this.data.Paciente.Internacions[0].id, this.isShowTodas);
  }

  getEvoluciones(internacionId, isShowTodas) {
    //console.log("INTERN: " + internacionId + ", MOSTRAR TODAS?: " + isShowTodas);
    this.services.getEvoluciones(internacionId, isShowTodas).subscribe(
      data => {
        //console.log(JSON.stringify(data));
        if (data && data.evoluciones) {
          this.dataSource = new MatTableDataSource<any>(data.evoluciones); 
          this.dataSource.paginator = this.paginator;
          //this.onEvolucionar.emit(this.data);
          //this.dataSource.
        }

        setTimeout(() => { this.loadingEvoluciones = false; }, 1200);
        //this.loadingEvoluciones = false;
      },
      error => {
        console.error(error);
        this.loadingEvoluciones = false;
        this.toastr.error("Ocurrió un error al intentar obtener las Evoluciones")
      }
    );

  }

  evolucionar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "75vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = this.data;

    const dialogRef = this.dialog.open(EvolucionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result)
      if (result && 'OK_EVOL' === result) {
        this.loadingEvoluciones = true;

        this.services.getEvoluciones(this.data.Paciente.Internacions[0].id, this.isShowTodas).subscribe(
          data => {
           // console.log(JSON.stringify(data))
            if (data && data.evoluciones) {
              this.dataSource = new MatTableDataSource<any>(data.evoluciones); 
              this.dataSource.paginator = this.paginator;
              this.onEvolucionar.emit(this.data);
            }
            setTimeout(() => { this.loadingEvoluciones = false; }, 1200);
          },
          error => {
            this.loadingEvoluciones = false;
            this.toastr.error("Ocurrió un error al intentar obtener las Evoluciones")
          }
        );
      }

    });
  }

  getColumns():  any[] {
    return [
      //PCR
      { caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'Resultado PCR', field: 'resultadoPCR' },
      { caption: 'Tomar Valor', field: 'tomarValor' },
      
      //Serología
      /*{ caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'Tipo', field: 'tipo' },
      { caption: 'Otro', field: 'otro' },

      //Quimica
      { caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'Tipo', field: 'tipo' },
      { caption: 'Otro', field: 'otro' },

      //Hemograma
      { caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'Glóbulos Rojos', field: 'globulosRojos' },
      { caption: 'Glóbulos Blancos', field: 'globulosBlancos' },
      { caption: 'HTO', field: 'hto' },
      { caption: 'HB', field: 'hb' },
      { caption: 'Tomar Valor', field: 'tomarValor' },

      //Coagulograma
      { caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'P?', field: 'p' },
      { caption: 'KPTT?', field: 'kptt' },
      { caption: 'Plaquetas', field: 'plaquetas' },
      { caption: 'Tomar Valor', field: 'tomarValor' },*/
    ];

  };

  getDataSource(): any[] {
    return [
      { name: 'Felipe', mail: 'felipe@gmai.com' },
      { name: 'Cecilia', mail: 'cecilia@gmail.com' }
    ];
  }

  openDetail(data) {
    //alert(element);
    //acá abrir un popup con la grilla abstracta
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = data; //this.data;

    const dialogRef = this.dialog.open(ContainerDetailDialogComponent, dialogConfig);
  }

  verDetalles(element, tipo, examenTipo?) {
    var title = null;
    //console.log("ID: " + JSON.stringify(element.id));
    //console.log("tipo: " + JSON.stringify(tipo));
    //console.log("examenTipo: " + JSON.stringify(examenTipo));
    if (tipo == 1 && !examenTipo) {
      //alert("SOY INTERPRETACION")
      title = "Interpretación"
      //inter
      this.services.getInterpretacionByEvolucionId(element.id).subscribe(data => {
        //console.log("Interpreación POR EVOLUCION ID: " + JSON.stringify(data));
        this.myData = data.interpretaciones;
        this.myData.forEach(e => {
          e.updatedAt = moment(e.updatedAt).format('DD/MM/YYYY HH:mm:ss'); 
        });
        this.myColumns = [
          //PCR
          { caption: 'Fecha y Hora', field: 'updatedAt' }, //| date: "dd/MM/yyyy"
          { caption: 'Descripción', field: 'descripcion' }];

        const data_ = {
          title: title,
          isImage: false,
          myData: this.myData,
          myColumns: this.myColumns
        }

        this.openDetail(data_);

      }, error => { 
        console.error(error);
      });
    } else if (tipo == 2 && examenTipo) {
      title = "Estudio Complementario"
      //alert("SOY ESTUDIO!!! y examen tipo " + examenTipo)
      //estudio compl
      //console.log(JSON.stringify(elementid) + " y DATA: " + JSON.stringify(this.data))
      if (examenTipo && examenTipo == 1) { //examenTipo == "PCR"
        //PCR
        this.services.getExamenComplementarioByEvolucionId(element.id, examenTipo).subscribe(data => {
          //console.log("Estudio Complementario POR EVOLUCION ID: " + JSON.stringify(data));
          this.myData = data.examenes;
          this.myData.forEach(d => {
            d.fecha = moment(d.fecha).format('DD/MM/YYYY');
            if (d.ExamenPcrs && d.ExamenPcrs[0]) {
              d.resultadoPCR = d.ExamenPcrs[0].valor;
              d.tomarValor = d.ExamenPcrs[0].resultado ? 'Positivo' : 'Negativo';
              //d.interpretacion = d.ExamenPcrs[0].interpretacion;
              //d.descripcion = d.ExamenPcrs[0].descripcion;
            }
          });
    
          this.myColumns = [
            //PCR
          { caption: 'Fecha', field: 'fecha' },
          { caption: 'Origen', field: 'origen' },
          { caption: 'Resultado PCR', field: 'resultadoPCR' },
          { caption: 'Interpretación', field: 'tomarValor' }]
          //{ caption: 'Interpretación', field: 'interpretacion' },
          //{ caption: 'Descripción', field: 'descripcion' }]

          const data_ = {
            title: title,
            isImage: false,
            myData: this.myData,
            myColumns: this.myColumns
          }
    
          this.openDetail(data_);
    
        }, error => {});
        } else if (examenTipo && examenTipo == 2) { //examenTipo == "SEROLOGIA"
        //Serologia
        //alert("SOY Serologia!!!");
        this.services.getExamenComplementarioByEvolucionId(element.id, examenTipo).subscribe(data => {
          //alert("Estudio Complementario POR EVOLUCION ID: " + JSON.stringify(data));
          this.myData = data.examenes;

          this.myData.forEach( d => {
            d.fecha = moment(d.fecha).format('DD/MM/YYYY');
            //d.tipo = d.ExamenSerologia[0].TipoSerologiumId;
            //alert(JSON.stringify(d.ExamenSerologia))
            d.tipo = d.ExamenSerologia[0].TipoSerologium.nombre;
            d.otro = d.ExamenSerologia[0].otros;
          });
    
          this.myColumns = [
            { caption: 'Fecha', field: 'fecha' },
            { caption: 'Origen', field: 'origen' },
            { caption: 'Tipo', field: 'tipo' },
            { caption: 'Otro', field: 'otro' }
          ]
    
          const data_ = {
            title: title,
            isImage: false,
            myData: this.myData,
            myColumns: this.myColumns
          }
    
          this.openDetail(data_);
    
        }, error => {});
      } else {
        //nose
      }
    } else if (tipo == 3 && !examenTipo) {
      //IMAGEN
      //console.log("ES IMAGEN!!!")
      var files = [];
      this.services.getImagenByEvolucionId(element.id).subscribe(data => {
        //console.log(JSON.stringify(data))
        if (data.imagenes && data.imagenes.length > 0) {
          var num = 0;
          data.imagenes.forEach(img => {
            num = num + 1;
            var file = {
              title: 'imagen' + num,
              name: 'imagen' + num,
              fecha: img.createdAt,
              url: img.imagen
            }
            files.push(file);
          });

          title = "Imágenes";
          const data_ = {
            title: title,
            isImage: true,
            files: files
          }

          this.openDetail(data_);
        }
      }, error => { console.error(error) });

    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayAge(birth) {
    birth = moment(birth);
    var target = moment();
    let months = moment().diff(birth, 'months', true)
    let birthSpan = { year: Math.floor(months / 12), month: Math.floor(months) % 12, day: Math.round((months % 1) * target.daysInMonth()) }
    if (birthSpan.year < 1 && birthSpan.month < 1) {
      return birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 1) {
      return birthSpan.month + ' meses' + (birthSpan.month > 1 ? 's ' : ' ') + birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 2) {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
    } else {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's' : '')
    }
  }

  daysTo(fecha) {
    fecha = moment(fecha);
    return moment().diff(fecha, 'days') + ' días';
  }

}
