import { CommonService } from "./common.service";
import { User } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { Services } from "./extra.service";

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private msg: NzMessageService
  ) {}

  addUser(user: User) {
    var response: User;
    this.http.post<User>(this.common.user, user).subscribe(
      res => (response = res),
      error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
      () => {
        this.msg.success("تم حفظ البيانات بنجاح");
      }
    );
  }
  addService(service: Services) {
    var response: Services;
    this.http.post<Services>(this.common.services, service).subscribe(
      res => (response = res),
      error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
      () => {
        this.msg.success("تم حفظ البيانات بنجاح");
      }
    );
  }
  addTolls(toll: Toll) {
    var response: Toll;
    this.http.post<Toll>(this.common.toll, toll).subscribe(
      res => (response = res),
      error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
      () => {
        this.msg.success("تم حفظ البيانات بنجاح");
      }
    );
  }

  getUsers() {
    return this.http.get<User[]>(this.common.users);
  }
  getServices() {
    return this.http.get<Services[]>(this.common.services);
  }

  getTolls() {
    return this.http.get<Toll[]>(this.common.tolls);
  }

  editUser(user: User) {
    var response: User;
    this.http.put<User>(this.common.users + "/" + user.id, user).subscribe(
      res => (response = res),
      error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
      () => {
        this.msg.success("تم حفظ البيانات بنجاح");
      }
    );
  }
  editSerivces(service: Services)

{
  var response: Services
  this.http.put<Services>(this.common.services + "/" + service.id, service).subscribe(
    res => (response = res),
    error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
    () => {
      this.msg.success("تم حفظ البيانات بنجاح");
    }
  );

}

}


export interface Toll {
  id: number;
  year: string;
  amount: string;
  registration: string;
  LoanNumber: string;
  program: string;
  currency: string;
}
