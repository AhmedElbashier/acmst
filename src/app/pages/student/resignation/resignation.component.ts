import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-resignation",
  templateUrl: "./resignation.component.html",
  styleUrls: ["./resignation.component.css"]
})
export class ResignationComponent implements OnInit {
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor() {}

  ngOnInit() {}
}
