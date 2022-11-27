import { CommonService } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ReportsService {
  constructor(private http: HttpClient, private common: CommonService) {}

  getReport(id, type, year = 0) {
    var url;
    console.log(id + " " + type + " " + year);

    this.http
      .post(this.common.reports, {
        id,
        type,
        year
      })
      .subscribe(
        res => (url = res),
        error => console.log(error),
        () => {
          window.open(url, "popup", "width=680,height=500");
        }
      );
  }
}
