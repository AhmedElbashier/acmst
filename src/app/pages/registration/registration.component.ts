import { InformationComponent } from "./../student/information/information.component";
import { AuthService } from "./../../Services/auth.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { StudantService, Studant } from "src/app/Services/studant.service";
import { CommonService } from "src/app/Services/common.service";
import { NzMessageService } from "ng-zorro-antd/message";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  studant: any;
  academicStand: any;
  StudantsData: Studant[];
  data;
  Hidden: boolean = true;
  collegeNumber;
  inputValue: string;
  options: { label: string; value: string }[];
  dtOptions: any = {};
  dtTrigger: Subject<Studant> = new Subject();
  selected: { id: number }[] = [];
  message = "";

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor(
    private studantService: StudantService,
    private auth: AuthService,
    private modalService: NzModalService,
    private common: CommonService
  ) {}

  async ngOnInit() {
    this.auth.isAllowed("registration");

    this.studantService.getStudantsBasics("reg").subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
        this.StudantsData = this.StudantsData.filter(
          studant => studant.status != "غير معتمد"
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
      
      ]
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  submitForm() {
    this.studantService.registration(
      this.academicStand,
      this.studant,
      this.collegeNumber
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
  }

  isHidden() {
    if (this.academicStand == "newAcceptance") return true;
    this.collegeNumber = "";
    return false;
  }

  showStudent(id: number) {
    const modal = this.modalService.create({
      nzContent: InformationComponent,
      nzWidth: "800",
      nzComponentParams: {
        studentId: id
      },
      nzFooter: [
        {
          label: "طباعة",
          onClick: componentInstance => {}
        }
      ]
    });
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
