import { AuthService } from "./../../../Services/auth.service";
import { map } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd/message";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Studant, StudantService } from "src/app/Services/studant.service";
import { Data } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: "app-accepted",
  templateUrl: "./accepted.component.html",
  styleUrls: ["./accepted.component.css"]
})
export class AcceptedComponent implements OnInit {
  StudantsData: Studant[];
  DisplayData: Studant[];
  studant;
  data;
  mapOfCheckedId: { [key: string]: boolean } = {};
  selected: { id: number }[] = [];
  table;
  Selection(): Boolean {
    if (
      this.StudantsData &&
      this.StudantsData.filter(item => this.mapOfCheckedId[item.id]).length > 0
    )
      return true;

    return false;
  }

  checkAll(value: boolean): void {
    this.StudantsData.forEach(item => {
      this.mapOfCheckedId[item.id] = value;
      this.selected.push({ id: item.id });
    });
  }

  constructor(
    private studantService: StudantService,
    private message: NzMessageService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isAllowed("approval");

    this.studantService.getStudantsBasics().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
        this.StudantsData = this.StudantsData.filter(
          studant => studant.status == "غير معتمد"
        );
        this.DisplayData = this.StudantsData;
      }
    );
  }

  action(id = null) {
    if (id == null) {
      this.studantService.accepted(this.selected).subscribe(
        Studants => Studants,
        error => console.log(error),
        () => {
          this.message.success("تم اعتماد الطلاب بنجاح", {
            nzDuration: 1000
          });
        }
      );
    } else {
      this.selected.push({ id });
      this.studantService.accepted(this.selected).subscribe(
        Studants => Studants,
        error => console.log(error),
        () => {
          this.message.success("تم اعتماد الطالب بنجاح", {
            nzDuration: 5000
          });
        }
      );
    }
    this.studantService.getStudantsBasics().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
        this.StudantsData = this.StudantsData.filter(
          studant => studant.status == "غير معتمد"
        );
      }
    );
  }

  search(value) {
    this.DisplayData = this.StudantsData.filter(std => {
      std.arabicFullName.includes(value);
      std.collegeNumber.toString().includes(value);
    });
  }
}
