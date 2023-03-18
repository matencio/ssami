import { Component, Inject, OnInit } from '@angular/core';
//Web Speech API imports
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { defaultLanguage, languages } from '../../model/languages';
import { merge, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SpeechEvent } from '../../model/speech-event';
import { SpeechError } from '../../model/speech-error';
import { SpeechNotification } from '../../model/speech-notification';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-speech-dialog',
  templateUrl: './speech-dialog.component.html',
  styleUrls: ['./speech-dialog.component.css']
})
export class SpeechDialogComponent implements OnInit {
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage;
  totalTranscript?: string;

  result: string;
  isListening: boolean = false;
  showBanner: boolean = true;

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();

  constructor(
    public dialogRef: MatDialogRef<SpeechDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    public speechRecognizer: SpeechRecognitionService
  ) { }

  ngOnInit(): void {
    //Requiere usar HTTPS
    const webSpeechReady = this.speechRecognizer.initialize(this.currentLanguage);
    if (webSpeechReady) {
      this.initRecognition();
      this.transcript$.subscribe(r => this.result = r);
    }
  }

  saveDescription() {
    //Se envía al componente el resultado de la descripción
    this.dialogRef.close(this.result);
  }

  resetear() {
    this.result = "";
  }

  // ----------------------------------------------------------------------------------------------------
  // WEB SPEECH API METHODS
  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }
    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: string): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
    }
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.result = notification.content;
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(map((notification) => {
      if (notification.event === SpeechEvent.Start) {
        this.isListening = true;
      }
      return notification.event === SpeechEvent.Start;
    }));

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        //alert(JSON.stringify(data));
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed: 
            message = `Su navegador no está autorizado para acceder a su micrófono.
            Verifique que su navegador tenga acceso a su micrófono y vuelva a intentarlo.`;
            break;
          case SpeechError.NoSpeech:
            message = `No se ha detectado ningún habla. Por favor, inténtelo de nuevo.`;
            break;
          case SpeechError.AudioCapture:
            message = `El micrófono no está disponible. Por favor, verifique la conexión de su micrófono y vuelva a intentarlo.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  private processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      this.totalTranscript = this.totalTranscript
        ? `${this.totalTranscript}\n${message}`
        : notification.content;
    }
  }

}
