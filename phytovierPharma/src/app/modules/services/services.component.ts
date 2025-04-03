import { Component } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioValido = 'admin';
  private contraseñaValida = '1234';

  login(username: string, password: string): boolean {
    if (username === this.usuarioValido && password === this.contraseñaValida) {
      localStorage.setItem('user', username); // Guardar sesión en localStorage
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('user'); // Eliminar sesión
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }
}


@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

}
