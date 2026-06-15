import { Component } from '@angular/core';
import { SidebarComponent } from "../utils/sidebar-component/sidebar-component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './home.html',
  standalone: true,
})
export class Home {}
