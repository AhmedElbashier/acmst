import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-freeze",
  templateUrl: "./freeze.component.html",
  styleUrls: ["./freeze.component.css"]
})
export class FreezeComponent implements OnInit {
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
