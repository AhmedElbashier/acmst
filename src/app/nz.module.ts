import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import {
  NzGridModule,
  NzSelectModule,
  NzAutocompleteModule,
  NzTableModule,
  NzFormModule,
  NzModalModule
} from "ng-zorro-antd";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzMessageService, NzMessageModule } from "ng-zorro-antd/message";
import { UploadFile, NzUploadModule } from "ng-zorro-antd/upload";
import { Observable, Observer } from "rxjs";
import { DataTablesModule } from "angular-datatables";
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    NzInputNumberModule,
    NzUploadModule,
    NzMessageModule,
    NzModalModule
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzSelectModule,
    NzInputNumberModule,
    NzAutocompleteModule,
    NzTableModule
  ]
})
export class NZModule {}
