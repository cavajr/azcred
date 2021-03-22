import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { JwtHelperService } from "@auth0/angular-jwt";
import "rxjs/add/operator/toPromise";

import { environment } from "../../environments/environment";

import { Config } from "../core/model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  tokenUrl = `${environment.apiUrl}/auth/login`;

  jwtPayload: any;
  imagem = null;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.carregarToken();
  }

  buscarLogoPorCodigo(id: number): Promise<Config> {
    return this.http
      .get<any>(`${environment.apiUrl}` + "/config/1/logo")
      .toPromise()
      .then(response => response as Config);
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders().append(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    const body = `email=${usuario}&password=${senha}`;

    return this.http
      .post<any>(this.tokenUrl, body, { headers })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.token, response.imagem);
      })
      .catch(response => {
        if (response.status === 401) {
          if (response.error.error === "invalid_credentials") {
            return Promise.reject("Usuário ou senha inválida!");
          }
        }
        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    let url = `${environment.apiUrl}/auth/refresh`;

    const headers = new HttpHeaders().append(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    const body = "refresh_token=" + localStorage.getItem("token");

    return this.http
      .post<any>(url, body, { headers })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.token, response.imagem);
        return Promise.resolve(null);
      })
      .catch(response => {
        return Promise.resolve(null);
      });
  }

  isAdmin() {
    return this.jwtPayload.roles.includes("ADMINISTRADORES");
  }

  isCorretor() {
    return this.jwtPayload.user.acesso_externo === 1;
  }

  temPermissao(permissao: string) {
    if (this.isAdmin()) {
      return true;
    }
    return this.jwtPayload && this.jwtPayload.permissions.includes(permissao);
  }

  temQualquerPermissao(permissions) {
    for (const permission of permissions) {
      if (this.temPermissao(permission)) {
        return true;
      }
    }
    return false;
  }

  limparAccessToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("imagem");
    this.jwtPayload = null;
    this.imagem = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem("token");
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  private armazenarToken(token: string, imagem: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("imagem", JSON.stringify(imagem));

    this.imagem = imagem;
  }

  private carregarToken() {
    this.imagem = JSON.parse(localStorage.getItem("imagem"));
    const token = localStorage.getItem("token");
    if (token) {
      this.armazenarToken(token, this.imagem);
    }
  }
}
