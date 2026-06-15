import { Component } from '@angular/core';
import { RouterOutlet,ActivatedRoute } from '@angular/router';
import { ProveedorListar } from './proveedor-listar/proveedor-listar';

@Component({
  selector: 'app-proveedorcomponent',
  imports: [RouterOutlet,ProveedorListar],
  templateUrl: './proveedorcomponent.html',
  styleUrl: './proveedorcomponent.css',
})
export class Proveedorcomponent {
    constructor(public route:ActivatedRoute){}
}
