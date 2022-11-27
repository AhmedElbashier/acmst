import { CommonService } from "src/app/Services/common.service";
import { AuthService } from "./../../Services/auth.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { StudantService, Studant } from "src/app/Services/studant.service";
import { NzModalService } from "ng-zorro-antd";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-exams",
  templateUrl: "./exams.component.html",
  styleUrls: ["./exams.component.css"]
})
export class ExamsComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  validateForm: FormGroup;
  StudantsData: Studant[];
  data;
  selected: { id: number }[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Studant> = new Subject();
  message = "";
  constructor(
    private fb: FormBuilder,
    private studantService: StudantService,
    private modalService: NzModalService,
    private auth: AuthService,
    private common: CommonService
  ) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  ngOnInit(): void {
    this.auth.isAllowed("exams");

    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]]
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
      }
    };
    this.getData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getData() {
    this.studantService.getStudantsBasics().subscribe(
      Studants => (this.data = Studants),
      error => this.getData(),
      () => {
        this.StudantsData = this.data;
        this.StudantsData = this.StudantsData.filter(
          studant => studant.status != "غير مسجل"
        );
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
  }

  action(type, id = null) {
    this.selected = [];

    var studant = this.StudantsData.filter(studant => studant.id == id)[0];
    this.modalService.confirm({
      nzTitle: "<i>هل انت متاكد؟</i>",
      nzContent:
        "<b>الرجاء التاكد من الطالب قبل المتابعة</b><br/><b>" +
        studant.arabicFullName +
        "</b>",
      nzOnOk: () => {
        if (type == 1) {
          this.selected.push({ id });
          this.studantService.passExam(this.selected).subscribe(
            res => (this.message = res.toString()),
            error => this.common.msg.error("حدث خطاء اثناء حفظ البيانات"),
            () => {
              this.common.msg.success(this.message);
              this.getData();
            }
          );
        } else if (type == 2) {
          this.selected.push({ id });
          this.studantService.repeatYear(this.selected).subscribe(
            res => (this.message = res.toString()),
            error => this.common.msg.error("حدث خطاء اثناء حفظ البيانات"),
            () => {
              this.common.msg.success(this.message);
              this.getData();
            }
          );
        }
      }
    });
  }
}
