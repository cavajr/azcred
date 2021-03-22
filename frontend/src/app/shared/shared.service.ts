import { Injectable } from "@angular/core";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "./../seguranca/sistema-http";
import { environment } from "./../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  tiposUrl: string;
  corretoresUrl: string;
  bancospgUrl: string;
  bancosUrl: string;
  conveniosUrl: string;
  contasUrl: string;
  sistemasUrl: string;

  constructor(public http: SistemaHttp) {
    this.tiposUrl = `${environment.apiUrl}/tipos`;
    this.corretoresUrl = `${environment.apiUrl}/corretores`;
    this.bancospgUrl = `${environment.apiUrl}/bancospg`;
    this.bancosUrl = `${environment.apiUrl}/bancos`;
    this.conveniosUrl = `${environment.apiUrl}/convenios`;
    this.contasUrl = `${environment.apiUrl}/contas`;
    this.sistemasUrl = `${environment.apiUrl}/sistemas`;
  }

  listarTipos() {
    return this.http
      .get<any>(`${this.tiposUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarCorretores() {
    return this.http
      .get<any>(`${this.corretoresUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarBancospg() {
    return this.http
      .get<any>(`${this.bancospgUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarBancos() {
    return this.http
      .get<any>(`${this.bancosUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarConvenios() {
    return this.http
      .get<any>(`${this.conveniosUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarContas() {
    return this.http
      .get<any>(`${this.contasUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarSistemas() {
    return this.http
      .get<any>(`${this.sistemasUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
