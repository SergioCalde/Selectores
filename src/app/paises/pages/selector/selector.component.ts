import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap, of } from 'rxjs';

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { Pais, Name } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  // Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;


  constructor(  private fb: FormBuilder,
                private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // Cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {

    //     this.paisesService.getPaisesPorRegion( region )
    //       .subscribe(
    //         paises => {
    //           this.paises = paises;
    //         }
    //       );

    //   });
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) =>  {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region =>  this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      });

      //Cuando cambia el país
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        } ),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
        switchMap( pais => this.paisesService.getPaisesPorCodigos( pais[0]?.borders! ))
      )
      .subscribe( paises => {
        // if(pais.length > 0){
        //   // this.fronteras = pais[0].borders || [];

        // }
        this.fronteras = paises;
        this.cargando = false;
        });
  }

  guardar(){
    console.log(this.miFormulario.value);
  }


}
