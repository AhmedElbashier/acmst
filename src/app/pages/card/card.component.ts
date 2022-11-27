import { Component, OnInit } from "@angular/core";
import { Studant, StudantService } from "src/app/Services/studant.service";
import { NzMessageService } from "ng-zorro-antd";
import { ReportsService } from "src/app/Services/reports.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  visible: boolean;
  mapOfCheckedId: { [key: string]: boolean } = {};
  selected: { id: number }[] = [];
  StudantsData: Studant[];
  options: { label: string; value: string }[];
  studant: Studant;
  StudentId;
  data;
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
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
    private reports: ReportsService
  ) {}

  ngOnInit() {
    this.studantService.getStudantsBasics().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => (this.StudantsData = this.data)
    );
  }

  onChange(value: string): void {
    if (!value) {
      this.options = [];
    } else {
      this.options = this.StudantsData.map(studant => ({
        label: studant.collegeNumber + " | " + studant.arabicFullName,
        value: studant.id
      }));

      this.options = this.options.filter(studant =>
        studant.label.includes(value)
      );
    }
    this.studant = this.StudantsData.filter(
      studant => studant.id == this.StudentId
    )[0];
  }
  printCard(id = 0) {
    if (id == 0) {
      this.reports.getReport(this.StudentId, "card");
    } else {
      this.reports.getReport(id, "card");
    }
  }
}
