import { Router } from "@angular/router";
import { User, getUser } from "./../../Services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  user: User;
  isCollapsed: boolean = false;
  constructor(private router: Router) {}

  ngOnInit() {
    this.user = getUser();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
  setCollapsed(value: boolean) {
    this.isCollapsed = value;
  }
}
