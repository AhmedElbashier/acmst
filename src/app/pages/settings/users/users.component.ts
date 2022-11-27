import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Role, CommonService } from "src/app/Services/common.service";
import { Subject } from "rxjs";
import { User, AuthService } from "src/app/Services/auth.service";
import { SettingsService } from "src/app/Services/settings.service";
import { DataTableDirective } from "angular-datatables";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  userForm: FormGroup;
  roles: Role;
  dtOptions: any = {};
  dtTrigger: Subject<User> = new Subject();
  users: User[] = [];
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
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.roles = this.commen.roles;

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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  close() {
    this.userForm.controls["name"].patchValue("");
    this.userForm.controls["username"].patchValue("");
    this.userForm.controls["password"].patchValue("");
    this.roles = this.commen.roles;
    this.visible = false;
  }

  submitUsers() {
    const user: User = {
      id: this.userForm.controls["id"].value,
      name: this.userForm.controls["name"].value,
      username: this.userForm.controls["username"].value,
      password: this.userForm.controls["password"].value,
      role: this.roles,
      lastLogin: ""
    };
    if (!this.onEdit) {
      this.settings.addUser(user);
    } else {
      this.settings.editUser(user);
      this.onEdit = false;
    }
    this.close();
  }

  editUser(user: User) {
    this.userForm.patchValue(user);
    this.roles = user.role;
    console.log(this.roles);

    this.onEdit = true;
    this.visible = true;
  }
}
