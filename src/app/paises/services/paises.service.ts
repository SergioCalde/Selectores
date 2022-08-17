import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaisSmall } from '../interfaces/paises.interface';
import { Pais } from '../interfaces/pais.interface';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _baseUrl1: string = 'https://restcountries.com/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient) { }


  getPaisesPorRegion( region: string ): Observable<PaisSmall[]>{
    const url: string = `${ this._baseUrl }/region/${ region }?fields=cca3,name`;
    return this.http.get<PaisSmall[]>( url );
  }

  // getPaisPorCodigo( codigo: string ):Observable<Pais | null>{

  //   if ( !codigo ){
  //     return of(null)
  //   }

  //   const url: string = `${ this._baseUrl1 }/alpha/${ codigo }`;
  //   return this.http.get<Pais>(url);
  // }

  getPaisPorCodigo( codigo: string ):Observable<Pais[] | []>{

    if ( !codigo ){
      return of([])
    }

    const url: string = `${ this._baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais[]>(url);
  }

  getPaisPorCodigoSmall( codigo: string ):Observable<PaisSmall>{
    const url: string = `${ this._baseUrl }/alpha/${ codigo }?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders: string[] ):Observable<PaisSmall[]> {
    if( !borders ) {
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    } );

    return combineLatest( peticiones );

  }

}
