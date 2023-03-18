import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CamasService {

  constructor(
    private http: HttpClient
  ) { }

  getCamas() {
    const url = `${environment.baseUrl}${environment.api}/camas`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  addPaciente(paciente) {
    const url = `${environment.baseUrl}${environment.api}/pacientes`;
    return this.http.post<any>(url, paciente, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('add'))
      );
  }

  editarPaciente(id, paciente) {
    const url = `${environment.baseUrl}${environment.api}/pacientes/`;
    return this.http.put<any>(url + id, paciente, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('add'))
      );
  }

  busquedaPordni(dni) {
    const url = `${environment.baseUrl}${environment.api}/pacientes/busquedaPordni/`;
    return this.http.get<any>(url + dni, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  addInternacion(internacion) {
    const url = `${environment.baseUrl}${environment.api}/internaciones`;
    return this.http.post<any>(url, internacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + internacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + internacion, HttpErrorResponse))
      );
  }

  getInternacionPaciente(idPaciente) {
    const url = `${environment.baseUrl}${environment.api}/internaciones/paciente/`;
    return this.http.get<any>(url + idPaciente, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  getEstudioComplementarios() {
    const url = `${environment.baseUrl}${environment.api}/tiposExamenComplementario`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  getSerologias() {
    const url = `${environment.baseUrl}${environment.api}/tiposExamenSerologia`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  evolucionar(evolucion) {
    const url = `${environment.baseUrl}${environment.api}/evoluciones`;
    return this.http.post<any>(url, evolucion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + evolucion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + evolucion, HttpErrorResponse))
      );
  }

  evolucionarInterpretacion(interpretacion){
    //addInterpretacion
    const url = `${environment.baseUrl}${environment.api}/interpretaciones`;
    return this.http.post<any>(url, interpretacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + interpretacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + interpretacion, HttpErrorResponse))
      );
  }

  getInterpretacionByEvolucionId(id) {
    const url = `${environment.baseUrl}${environment.api}/interpretaciones/evolucion/`;

    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }
 
  getExamenComplementarioByEvolucionId(id, examenTipo) {
    //localhost:5000/ssami/api/v1/examenesComplementarios/evolucion/43
    const url = `${environment.baseUrl}${environment.api}/examenesComplementarios/evolucion/`;
    //alert(url + (id + "/" + examenTipo))
    return this.http.get<any>(url + (id + "/" + examenTipo), httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  evolucionarEstudioComplementario(evolucion) {
    const url = `${environment.baseUrl}${environment.api}/examenesComplementarios`;
    return this.http.post<any>(url, evolucion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + evolucion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + evolucion, HttpErrorResponse))
      );
  }
  
  evolucionarImagen(evolucion) {
    //const url = `${environment.baseUrl}${environment.api}/imagenes`; varias
    const url = `${environment.baseUrl}${environment.api}/imagenes/varias`;
    return this.http.post<any>(url, evolucion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + evolucion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + evolucion, HttpErrorResponse))
      );
  }

  getImagenByEvolucionId(id) {
    const url = `${environment.baseUrl}${environment.api}/imagenes/evolucion/`;
    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }


  getEvoluciones(internacion, todas?) {
    var url = null;
    if (todas) {
      url = `${environment.baseUrl}${environment.api}/evoluciones/internacion/`;
    } else {
      url = `${environment.baseUrl}${environment.api}/evoluciones/ultimas/internacion/`;
    }
    return this.http.get<any>(url + internacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + internacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + internacion, HttpErrorResponse))
      );
  }

  darDeAlta(idInternacion) {
    const url = `${environment.baseUrl}${environment.api}/internaciones/alta/`;
    return this.http.put<any>(url + idInternacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + idInternacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + idInternacion, HttpErrorResponse))
      );
  }

  // ENUMS SECTION
  //---------------------------> /unidadDosis
  getUnidadDosis() {
    const url = `${environment.baseUrl}${environment.api}/unidadDosis`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }
  //---------------------------> /tipoVia
  getTipoVia() {
    const url = `${environment.baseUrl}${environment.api}/tipoVia`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getTipoVia'))
      );
  }
  //---------------------------> /tipoDosis
  getTipoDosis() {
    const url = `${environment.baseUrl}${environment.api}/tipoDosis`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getTipoDosis'))
      );
  }
  //---------------------------> /frecuencias
  getFrecuencias() {
    const url = `${environment.baseUrl}${environment.api}/frecuencias`;
    //"id": 2,
    //"nombre": "CUATRO",
    //"descripcion": "4"
    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getFrecuencias'))
      );
  }
  //---------------------------> /tipoMedicamento
  getTipoMedicamento() {
    const url = `${environment.baseUrl}${environment.api}/tipoMedicamento`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getTipoMedicamento'))
      );
  }


  // MEDICAMENTO SERVICES SECTION ---------------------------> /medicamento
  getMedicamentos() {
    const url = `${environment.baseUrl}${environment.api}/medicamento`;
    return this.http.get<any>(url, httpOptions)
    .pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError<any>('getMedicamentos'))
    );
  }

  getMedicamento(id) {
    const url = `${environment.baseUrl}${environment.api}/medicamento/`;
    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getMedicamento'))
      );
  }

  getMedicamentosByTipo(id) {
    const url = `${environment.baseUrl}${environment.api}/medicamento/tipo/`;
    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getMedicamentosByTipo'))
      );
  }

  getMedicamentoByDosisId(id) {
    const url = `${environment.baseUrl}${environment.api}/medicamento/dosis/`;
    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getMedicamentoByDosisId'))
      );
  }

  addMedicamento(medicamento) {
    const url = `${environment.baseUrl}${environment.api}/medicamento`;
    return this.http.post<any>(url, medicamento, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('addMedicamento'))
      );
  }

  editarMedicamento(id, medicamento) {
    const url = `${environment.baseUrl}${environment.api}/medicamento/`;
    return this.http.put<any>(url + id, medicamento, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('editarMedicamento'))
      );
  }

  eliminarMedicamento(id) {
    const url = `${environment.baseUrl}${environment.api}/medicamento/`;
    return this.http.delete<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('eliminarMedicamento'))
      );
  }

// DOSIS MEDICAMENTO SERVICES SECTION ---------------------------> /dosisMedicamento
getDosisMedicamentos() {
  const url = `${environment.baseUrl}${environment.api}/dosisMedicamento`;
  return this.http.get<any>(url, httpOptions)
  .pipe(
    tap((response: any) => {
    }),
    catchError(this.handleError<any>('getDosisMedicamentos'))
  );
}

  getDosisMedicamento(id) {
    const url = `${environment.baseUrl}${environment.api}/dosisMedicamento`;
    return this.http.get<any>(url + id, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('getDosisMedicamento'))
      );
  }



addDosisMedicamento(dosisMedicamento) {
  const url = `${environment.baseUrl}${environment.api}/dosisMedicamento`;
  return this.http.post<any>(url, dosisMedicamento, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('addDosisMedicamento'))
    );
}

editarDosisMedicamento(id, dosisMedicamento) {
  const url = `${environment.baseUrl}${environment.api}/dosisMedicamento/`;
  return this.http.put<any>(url + id, dosisMedicamento, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('editarDosisMedicamento'))
    );
}

eliminarDosisMedicamento(id) {
  const url = `${environment.baseUrl}${environment.api}/dosisMedicamento/`;
  return this.http.delete<any>(url + id, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('eliminarDosisMedicamento'))
    );
}

// INDICACION MEDICA SERVICES SECTION ---------------------------> /indicacionMedica
geIndicacionesMedicas() {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica`;
  return this.http.get<any>(url, httpOptions)
  .pipe(
    tap((response: any) => {
    }),
    catchError(this.handleError<any>('geIndicacionesMedicas'))
  );
}

geIndicacionMedica(id) {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica/`;
  return this.http.get<any>(url + id, httpOptions)
    .pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError<any>('geIndicacionMedica'))
    );
}

getIndicacionesMedicsaByInternacion(id) {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica/internacion/`;
  return this.http.get<any>(url + id, httpOptions)
    .pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError<any>('getIndicacionesMedicsaByInternacion'))
    );
}

addIndicacionMedica(medicamento) {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica`;
  return this.http.post<any>(url, medicamento, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('addIndicacionMedica'))
    );
}

editarIndicacionMedica(id, medicamento) {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica/`;
  return this.http.put<any>(url + id, medicamento, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('editarIndicacionMedica'))
    );
}

eliminarIndicacionMedica(id) {
  const url = `${environment.baseUrl}${environment.api}/indicacionMedica/`;
  return this.http.delete<any>(url + id, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
        }
      }),
      catchError(this.handleError<any>('eliminarIndicacionMedica'))
    );
}

  private log(message: string) {

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log('${operation} failed: ${error.message}');

      return of(result as T);
    };
  }
}
