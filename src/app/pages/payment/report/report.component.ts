import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subscription, Subject } from "rxjs";
import { Transactions, PaymentService } from "src/app/Services/payment.service";
import { FormBuilder } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { ReportsService } from "src/app/Services/reports.service";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "src/app/Services/common.service";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"]
})
export class ReportComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  range: any[] = [];
  program: any = "الكل";
  currency: any = "الكل";
  method: any = "الكل";
  private timerSubscription: Subscription;
  private postsSubscription: Subscription;
  data: any;
  dtOptions: any = {};
  dtTrigger: Subject<Transactions> = new Subject();

  transactions: Transactions[];
  constructor(
    private fb: FormBuilder,
    private payment: PaymentService,
    private message: NzMessageService,
    private reports: ReportsService,
    private http: HttpClient,
    private common: CommonService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isAllowed("installment");

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
      buttons: ["excel"]
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.payment.getTransactions().subscribe(
      transactions => (this.data = transactions),
      error => console.log(error),
      () => {
        this.transactions = this.data;
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
  getData() {
    this.payment
      .getTransactionsFilter(
        this.range,
        this.program,
        this.currency,
        this.method
      )
      .subscribe(
        transactions => (this.data = transactions),
        error => console.log(error),
        () => {
          this.transactions = this.data["trans"];
          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.isDtInitialized = true;
            this.dtTrigger.next();
          }
          window.open(this.data["url"], "popup", "width=680,height=500");
        }
      );
  }
}
