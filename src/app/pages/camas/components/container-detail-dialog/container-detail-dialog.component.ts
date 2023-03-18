import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CamasService } from '../../services/camas.service';

@Component({
  selector: 'app-container-detail-dialog',
  templateUrl: './container-detail-dialog.component.html',
  styleUrls: ['./container-detail-dialog.component.css']
})
export class ContainerDetailDialogComponent implements OnInit {
  myData = [];
  myColumns = [];
  title: string;
  loadingFiles: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContainerDetailDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    //private fb: FormBuilder,
    //breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    //private _snackBar: MatSnackBar,
    private services: CamasService
  ) { }

  ngOnInit(): void {
  }

  getColumns():  any[] {
    return [
      //PCR
      { caption: 'Fecha', field: 'fecha' },
      { caption: 'Origen', field: 'origen' },
      { caption: 'Resultado PCR', field: 'resultadoPCR' },
      { caption: 'Tomar Valor', field: 'tomarValor' },
      
      //Serología
      { caption: 'Fecha', field: 'fecha' },
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
      { caption: 'Tomar Valor', field: 'tomarValor' },
    ];

  };

  getDataSource(): any[] {
    return [
      { name: 'Felipe', mail: 'felipe@gmai.com' },
      { name: 'Cecilia', mail: 'cecilia@gmail.com' }
    ];
  }

  clickOn(id) {
    document.getElementById(id).click();
  }

  verDetalles(element) {
    console.log(JSON.stringify(element) + " y DATA: " + JSON.stringify(this.data))
    this.services.evolucionarEstudioComplementario(element.id).subscribe(data => {
      console.log("ESTUxxxxxDIO POR EVOLUCION ID: " + JSON.stringify(data));
      this.myData = data.examenes;

    }, error => {});


    this.title = 'ALGUNA COSA';
    //this.myData = this.getDataSource();
    this.myColumns = this.getColumns();

    this.data.myData = this.myData;
    this.data.myColumns = this.myColumns;

    console.log(JSON.stringify(element));

    console.log(JSON.stringify(element));
    //pasarle data = title (Ver X) , column[], values[]

    /*const data = {
      title: 'ALGUNA COSA',
      myData: myData,
      myColumns: myColumns
    }*/

    //alert(element);
    //acá abrir un popup con la grilla abstracta
    /*const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "75vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = data; //this.data;*/

    //const dialogRef = this.dialog.open(this.verDetalle, dialogConfig);

    //dialogRef.afterClosed().subscribe((result) => {});

    /*console.log(cama);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cama;*/
    /*dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "75vw";
    dialogConfig.maxHeight = "98vh";*/
    /*const dialogRef = this.dialog.open(this.darDeAltaDialog, dialogConfig);*/

    /*dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll();
      if (result && result.length > 0) {
        console.log("ALTA ID: " + result);
        //
        //router.put("/alta/:id",altaInternacion);
        //alert('SERVICIO DAR DE BAJA');
      } else {
        //no cierro
      }
    });*/

  }

}
