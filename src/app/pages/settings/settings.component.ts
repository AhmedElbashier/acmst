import { AuthService } from "./../../Services/auth.service";
import { SettingsService, Toll } from "./../../Services/settings.service";
import { Role, CommonService } from "./../../Services/common.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy
} from "@angular/core";
import { Studant, StudantService } from "src/app/Services/studant.service";
import { NzMessageService, NzInputDirective } from "ng-zorro-antd";
import { ReportsService } from "src/app/Services/reports.service";
import {
  FormGroup,
  FormBuilder,
  RequiredValidator,
  Validators
} from "@angular/forms";
import { User } from "src/app/Services/auth.service";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  validateForm: any;
  userForm: FormGroup;
  roles: Role;
  visible = false;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  toll: Toll;
  dtOptions: any = {};
  dtTrigger: Subject<User> = new Subject();
  dtTollsTrigger: Subject<Toll> = new Subject();
  users: User[] = [];
  tolls: Toll[] = [];

  submitForm(): void {
    console.log(this.validateForm.value);
  }

  constructor(
    private fb: FormBuilder,
    private commen: CommonService,
    private settings: SettingsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAllowed("settings");

    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.roles = this.commen.roles;
    this.toll = {
      id: 0,
      year: "2020",
      amount: "0",
      registration: "0",
      LoanNumber: "2",
      program: "برنامج الطب والجراحة",
      currency: "جنيه"
    };

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
    this.dtTollsTrigger.unsubscribe();
  }

  getData() {
    this.settings.getUsers().subscribe(
      res => (this.users = res),
      error => error,
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
    this.settings.getTolls().subscribe(
      res => (this.tolls = res),
      error => error,
      () => {
        this.dtTollsTrigger.next();
      }
    );
  }

  open(): void {
    this.visible = true;
  }

  open1(): void {
    this.visible1 = true;
  }

  open2(): void {
    this.visible2 = true;
  }

  open3(): void {
    this.visible3 = true;
  }

  close(): void {
    this.visible = false;
  }

  close1(): void {
    this.visible1 = false;
  }

  close2(): void {
    this.visible2 = false;
  }

  close3(): void {
    this.visible3 = false;
  }
}
