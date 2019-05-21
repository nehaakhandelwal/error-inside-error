import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// all the validators will be a function and return the value that the type of file is valid or not

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
   const file = control.value as File;
   const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
  //  const frObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
          const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray( 0, 4 );
          let header = '';
          let isValid = false;
          for ( let i = 0; i < arr.length; i++ ) {
            header += arr[i].toString(16);
          }
          switch (header) {
            case '89504e47':
              isValid = true;
              break;
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
            case 'ffd8ffe8':
              isValid = true;
              break;
            default:
              isValid = false; // or you can use blob.type as a fallback
              break;
          }
          if (isValid) {
            observer.next(null);
          } else {
            observer.next({invalidMimeType: true});
          }
          observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
   });
   return frObs;
};
// error code is wrapped by a promise or an observable => promise and observable are object which define the type of return of the function
// the [] around key don't indicate it as an array, they just indicate that it's a dynamic property name with type
// string and value can be anything (any)

