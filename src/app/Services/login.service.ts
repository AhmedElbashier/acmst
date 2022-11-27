import { Router } from "@angular/router";
import { CommonService, Role } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { User } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  tokenData = "";
  userInfo: User;
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private router: Router
  ) {}

  login(data) {
    this.http.post(this.common.AuthUrl, data).subscribe(
      token => {
        this.tokenData = token["token"];
        this.userInfo = token["user"];
      },
      error => console.log(error),
      () => {
        localStorage.setItem("token", this.tokenData);
        localStorage.setItem("user", JSON.stringify(this.userInfo));
        this.router.navigate(["main"]);
      }
    );
  }
}
