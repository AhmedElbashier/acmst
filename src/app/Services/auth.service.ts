import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Role } from "./common.service";
import { Router } from "@angular/router";
export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  lastLogin: string;
  role: Role;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService, private router: Router) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }

  public isAllowed(page) {
    const user: User = JSON.parse(localStorage.getItem("user"));
    const role: Role = user.role;
    if (!role[page]) this.router.navigate(["main"]);
  }
}

export function tokenGetter() {
  return localStorage.getItem("token");
}

export function getUser() {
  const userInfo: User = JSON.parse(localStorage.getItem("user"));
  return userInfo;
}
