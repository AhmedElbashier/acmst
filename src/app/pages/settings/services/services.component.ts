import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Role, CommonService } from "src/app/Services/common.service";
import { Subject } from "rxjs";
import { User, AuthService } from "src/app/Services/auth.service";
import { SettingsService } from "src/app/Services/settings.service";
import { DataTableDirective } from "angular-datatables";
import { ThrowStmt } from "@angular/compiler";
import { Services } from "src/app/Services/extra.service";
@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.css"]
})
export class ServicesComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  userForm: FormGroup;
  roles: Role;
  dtOptions: any = {};
  dtTrigger: Subject<Services> = new Subject();
  services: Services[] = [];
  visible: boolean = false;
  onEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commen: CommonService,
    private settings: SettingsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isAllowed("settings");

    this.userForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      department: [null, [Validators.required]],
      type: [null, [Validators.required]],
      price:[null], 
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
        {
          text: "اضافة",
          key: "1",
          action: () => {
            this.visible = true;
          }
        }
      ]
    };

    this.settings.getServices().subscribe(
      res => (this.services = res),
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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  close() {
    // this.userForm.controls["name"].patchValue("");
    // this.userForm.controls["username"].patchValue("");
    // this.userForm.controls["password"].patchValue("");
    // this.roles = this.commen.roles;
    this.visible = false;
  }

  submitServices() {
    const service: Services = {
      id: this.userForm.controls["id"].value,
      name: this.userForm.controls["name"].value,
      type: this.userForm.controls["type"].value,
      department: this.userForm.controls["department"].value,
      price: this.userForm.controls["price"].value
  
    };
    if (!this.onEdit) {
      this.settings.addService(service);
    } else {
      this.settings.editSerivces(service);
      this.onEdit = false;
    }
    this.close();
  }

  editService(service: Services) {
    this.userForm.patchValue(service);

    this.onEdit = true;
    this.visible = true;
  }
}
