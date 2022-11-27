import { AuthService } from "./../../../Services/auth.service";
import { map } from "rxjs/operators";
import { CommonService } from "./../../../Services/common.service";
import { HttpClient } from "@angular/common/http";
import { ReportsService } from "./../../../Services/reports.service";
import {
  Payment,
  PaymentService,
  Transactions
} from "./../../../Services/payment.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Studant, StudantService } from "src/app/Services/studant.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject, Subscription, Observable, timer } from "rxjs";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-installment",
  templateUrl: "./installment.component.html",
  styleUrls: ["./installment.component.css"]
})
export class InstallmentComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  private timerSubscription: Subscription;
  private postsSubscription: Subscription;

  validateForm: FormGroup;
  installment;
  StudantsData: Studant[];
  options: { label: string; value: string }[];
  studant: Studant;
  payments: Payment[];
  paymen: Payment[];
  transactions: Transactions[];
  transaction: Transactions[];
  data;
  years: number[] = [];
  selectedYear = 2019;
  account: any = {};
  visible = false;
  visibleCheck = false;
  messege;

  dtOptions: any = {};
  dtTrigger: Subject<Studant> = new Subject();
  isStringNumber(str) {
    var parsed = parseFloat(str);
    var casted = +str;
    return parsed === casted && !isNaN(parsed) && !isNaN(casted);
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  constructor(
    private fb: FormBuilder,
    private payment: PaymentService,
    private studantService: StudantService,
    private message: NzMessageService,
    private reports: ReportsService,
    private http: HttpClient,
    private common: CommonService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isAllowed("installment");

    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      PaymentTo: ["acmst", [Validators.required]],
      PaymentFrom: [null, [Validators.required]],
      PaymentType: ["installment", [Validators.required]],
      PaymentMethod: [null, [Validators.required]],
      BankName: [null],
      BankAccount: [null],
      BankBranch: [null],
      StatmentNumber: [null],
      StatmentDate: [null, [Validators.required]],
      userId: ["1", [Validators.required]],
      StudentId: [null, [Validators.required]],
      Notes: [null]
    });
    this.getData();

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
            this.open();
          }
        }
      ]
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
  }

  getData() {
    this.studantService.getStudantsBasics().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
      }
    );

    this.payment.getPayments().subscribe(
      payments => (this.data = payments),
      error => console.log(error),
      () => {
        this.payments = this.data;
      }
    );

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

  submitForm() {
    this.installment = {
      StudentId: this.validateForm.controls["StudentId"].value,
      Notes: this.validateForm.controls["Notes"].value,
      LoanNumber: "",
      PaymentId: "",
      checked: "",
      checkedBy: ""
    };
    this.payment
      .Installment(this.validateForm.value, this.installment)
      .subscribe(
        res => (this.messege = res.toString()),
        error => {
          this.common.msg.error("حدث خطاء");
          this.getAcccountData();
        },
        () => {
          if (this.messege == "الدفعية اقل من الرسوم المستحقة")
            this.common.msg.error(this.messege);
          else if (this.messege == "الدفعية اكثر من الرسوم المستحقة")
            this.common.msg.error(this.messege);
          else if (this.messege == "تم دفع الرسوم مسبقا")
            this.common.msg.info(this.messege);
          else this.common.msg.success(this.messege);
          this.getAcccountData();
        }
      );
    this.getData();
    this.closeCheck();
    // this.close();
    // this.validateForm.reset();
  }

  createBasicMessage(): void {
    this.message.success("Test Message", {
      nzDuration: 10000
    });
  }

  isHidden() {
    if (this.validateForm.controls["PaymentMethod"].value == "بنكي")
      return true;
    return false;
  }
  onChange(value: string): void {
    if (!value) {
      this.options = [];
    } else {
      this.options = this.StudantsData.map(studant => ({
        label:
          studant.collegeNumber +
          " | " +
          studant.arabicFullName.split(", ").join(""),
        value: studant.id
      }));

      this.options = this.options.filter(studant =>
        studant.label.includes(value)
      );
    }
    this.studant = this.StudantsData.filter(
      studant => studant.id == this.validateForm.controls["StudentId"].value
    )[0];

    this.validateForm.controls["PaymentFrom"].setValue(this.studant.id);
    // this.paymen = this.payments.filter(
    //   payment => this.studant.id == payment.PaymentFrom
    // );
    // this.paymen.map(
    //   payment =>
    //     (payment.PaymentType = payment.PaymentType.replace("loan", "القسط")
    //       .replace(".", " ")
    //       .replace("1", "الاول")
    //       .replace("2", "الثاني")
    //       .replace("3", "الثالث")
    //       .replace("4", "الرابع"))
    // );
    // if (this.transactions)
    //   this.transaction = this.transactions.filter(
    //     trans => trans.studantId == this.studant.id
    //   );
  }

  getAcccountData() {
    this.http
      .get(
        this.common.APIEndPoint +
          "/stdaccount/account/" +
          this.validateForm.controls["StudentId"].value
      )
      .subscribe(
        res => (this.account = res),
        error => this.getAcccountData(),
        () => {
          this.paymen = this.account.payments;
          this.transaction = this.account.transactions;
          this.paymen.map(
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
          // this.subscribeToData();
        }
      );

    this.http
      .get<number[]>(
        this.common.APIEndPoint +
          "/installment/" +
          this.validateForm.controls["StudentId"].value +
          "/years"
      )
      .subscribe(res => (this.years = res));
  }

  private subscribeToData(): void {
    this.timerSubscription = timer(5000).subscribe(() =>
      this.getAcccountData()
    );
  }

  printInvoice(id) {
    this.reports.getReport(id, "invoice");
  }

  printTransaction(id) {
    this.reports.getReport(id, "transaction");
  }

  printStatment(id) {
    console.log(this.selectedYear);

    this.reports.getReport(id, "statment", this.selectedYear);
  }

  check(): void {
    this.visibleCheck = true;
  }
  closeCheck() {
    this.visibleCheck = false;
  }
}
