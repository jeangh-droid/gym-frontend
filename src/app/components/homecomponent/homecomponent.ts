import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homecomponent',
  imports: [CommonModule],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent {
  integrantes = [
    { nombre: 'Abel Leon', foto: 'fotos/foto1.jpg' },
    { nombre: 'Joel Barrios', foto: 'fotos/foto2.jpg' },
    { nombre: 'Jesus Lopez', foto: 'fotos/foto3.jpg' },
    { nombre: 'Jostin Galarza', foto: 'fotos/foto4.jpg' },
    { nombre: 'Jean Quispe', foto: 'fotos/foto5.jpg' },
  ];
}