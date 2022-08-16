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
  fronteras: string[] = [];

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
        }),
        switchMap( region =>  this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises = paises;
      });

      //Cuando cambia el país
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.fronteras = []
          this.miFormulario.get('frontera')?.reset('');
        } ),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) )
      )
      .subscribe( pais => {
          this.fronteras = pais?.borders || [];
        });
  }

  guardar(){
    console.log(this.miFormulario.value);
  }


}
