import { CommonService } from "src/app/Services/common.service";
import {
  Payment,
  PaymentService,
  Scolarship
} from "./../../../Services/payment.service";
import { AuthService } from "./../../../Services/auth.service";
import { StudantService, Studant } from "./../../../Services/studant.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: "app-scolarship",
  templateUrl: "./scolarship.component.html",
  styleUrls: ["./scolarship.component.css"]
})
export class ScolarshipComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  studantId;
  scolarship;
  scolarshipType;
  StudantsData: Studant[];
  options: { label: string; value: string }[];
  Studant: Studant;
  visible = false;
  data;
  scolarships: Scolarship[];
  validateForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<Studant> = new Subject();

  isEditing: boolean = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  constructor(
    private studant: StudantService,
    private fb: FormBuilder,
    private auth: AuthService,
    private payment: PaymentService,
    private common: CommonService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.auth.isAllowed("scolarship");

    this.validateForm = this.fb.group({
      studantId: [null, [Validators.required]],
      brotherId: ["0", [Validators.required]],
      scolarship: ["0", [Validators.required]],
      scolarshipType: ["", [Validators.required]]
    });

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [15, 25, 50, 100],
      pageLength: 15,
      language: {
        emptyTable: "ليست هناك بيانات متاحة في الجدول",
        loadingRecords: "جارٍ التحميل...",
        processing: "جارٍ التحميل...",
        lengthMenu: "أظهر _MENU_ مدخلات",
        zeroRecords: "لم يعثر على أية سجلات",
        info: "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
        infoEmpty: "يعرض 0 إلى 0 من أصل 0 سجل",
        infoFiltered: "(منتقاة من مجموع _MAX_ مُدخل)",
        infoPostFix: "",
        search: "ابحث:",
        url: "",
        paginate: {
          first: "الأول",
          previous: "السابق",
          next: "التالي",
          last: "الأخير"
        },
        aria: {
          sortAscending: ": تفعيل لترتيب العمود تصاعدياً",
          sortDescending: ": تفعيل لترتيب العمود تنازلياً"
        }
      },
      dom: "Bfrtip",
      buttons: [
        "excel",
        {
          text: "اضافة",
          key: "1",
          action: () => {
            this.open();
          }
        }
      ]
    };
    this.getData();
    this.getData(true);
  }

  getData(type: boolean = false) {
    if (!type) {
      this.payment.getScolarship().subscribe(
        res => (this.scolarships = res),
        error => this.getData(),
        () => {
          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.isDtInitialized = true;
            this.dtTrigger.next();
          }
        }
      );
    } else {
      this.studant.getStudantsBasics().subscribe(
        Studants => (this.data = Studants),
        error => this.getData(true),
        () => {
          this.StudantsData = this.data;
        }
      );
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  submit() {
    this.studant
      .scolarship(
        this.validateForm.controls["studantId"].value,
        this.validateForm.controls["brotherId"].value,
        this.validateForm.controls["scolarship"].value,
        this.validateForm.controls["scolarshipType"].value
      )
      .subscribe(
        res => res,
        error => this.common.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.common.msg.success("تم حفظ البيانات بنجاح");
          this.getData();
        }
      );
    this.close();
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

    this.Studant = this.StudantsData.filter(
      studant => studant.id == this.validateForm.controls["studantId"].value
    )[0];
  }

  editScolarship(data: Scolarship) {
    var scolarship = 100 - data.scolarship * 100;
    this.validateForm.patchValue({
      studantId: data.id,
      scolarshipType: data.scolarshipType,
      scolarship: scolarship
    });
    this.open();
  }

  removeScolarship(data: Scolarship) {
    this.modalService.confirm({
      nzTitle: "<i>هل انت متاكد؟</i>",
      nzContent: "<b>الرجاء التاكيد</b>",
      nzOnOk: () => {
        this.studant.removeScolarship(data.id).subscribe(
          res => res,
          error => this.common.msg.error("حدث خطاء اثناء حفظ البيانات"),
          () => {
            this.common.msg.success("تم حفظ البيانات بنجاح");
            this.getData();
          }
        );
      }
    });
  }
}
