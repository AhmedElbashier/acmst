import { ReportsService } from "./../../../Services/reports.service";
import { CommonService } from "src/app/Services/common.service";
import { HttpClient } from "@angular/common/http";
import { Payment, Transactions } from "./../../../Services/payment.service";
import { StudantService } from "src/app/Services/studant.service";
import { Studant } from "src/app/Services/studant.service";
import { Component, OnInit, Input } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-information",
  templateUrl: "./information.component.html",
  styleUrls: ["./information.component.css"]
})
export class InformationComponent implements OnInit {
  @Input() studentId: number = 1;
  visible: boolean;
  private studantData: Studant;
  private payments: Payment[];
  private transactions: Transactions[];
  private dtOptions: any;
  private account: any = {};
  private years: number[] = [];
  private loadData: boolean = false;

  constructor(
    private studentService: StudantService,
    private http: HttpClient,
    private common: CommonService,
    private report: ReportsService
  ) {}

  ngOnInit() {
    this.studentService
      .getStudant(this.studentId)
      .subscribe(res => (this.studantData = res));
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
        },
        
      dom: "Bfrtip",
      buttons: [
        {
          text: "اضافة",
          key: "1",
          action: () => {
            this.open();
          }
        }
      ]
    }
  };
      
  
    this.getAcccountData();
  }

  getAcccountData() {
    this.http
      .get(this.common.APIEndPoint + "/stdaccount/account/" + this.studentId)
      .subscribe(
        res => (this.account = res),
        error => this.getAcccountData(),
        () => {
          this.payments = this.account.payments;
          this.transactions = this.account.transactions;
          this.payments.map(
            payment =>
              (payment.PaymentType = payment.PaymentType.replace(
                "loan",
                "القسط"
              )
                .replace(".", " ")
                .replace("1", "الاول")
                .replace("2", "الثاني")
                .replace("3", "الثالث")
                .replace("4", "الرابع"))
          );
          this.loadData = true;
        }
      );

    this.http
      .get<number[]>(
        this.common.APIEndPoint + "/installment/" + this.studentId + "/years"
      )
      .subscribe(res => (this.years = res));
  }

  registrationForm() {
    this.report.getReport(this.studentId, "registration");
  }
  
  open(): void {
    this.visible = true;
  }
}
