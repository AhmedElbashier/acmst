import { AuthService } from "./../../Services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "src/app/Services/login.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.login.login(this.validateForm.value);
    }
  }

  constructor(
    private fb: FormBuilder,
    private login: LoginService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.router.navigate(["main"]);
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
