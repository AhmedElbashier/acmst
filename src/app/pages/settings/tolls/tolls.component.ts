import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AuthService } from "src/app/Services/auth.service";
import { SettingsService, Toll } from "src/app/Services/settings.service";

@Component({
  selector: "app-tolls",
  templateUrl: "./tolls.component.html",
  styleUrls: ["./tolls.component.css"]
})
export class TollsComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  dtOptions: any = {};
  dtTrigger: Subject<Toll> = new Subject();
  tolls: Toll[] = [];
  toll: Toll;
  visible: boolean = false;

  constructor(private settings: SettingsService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.isAllowed("settings");

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

    this.settings.getTolls().subscribe(
      res => (this.tolls = res),
      error => error,
      () => {
        this.dtTrigger.next();
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  submitTolls() {
    this.settings.addTolls(this.toll);
  }
}
