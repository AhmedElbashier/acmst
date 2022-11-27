
import { InformationComponent } from "./../student/information/information.component";
import { AuthService } from "./../../Services/auth.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { CommonService } from "src/app/Services/common.service";
import { HttpClient } from "@angular/common/http";
import {ReportsService} from '../../Services/reports.service';
import {
  Payment,
  PaymentService,
  Transactions
} from "../../Services/payment.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { DataTableDirective } from "angular-datatables";
import { NzModalService } from "ng-zorro-antd";
import { Studant, StudantService } from "src/app/Services/studant.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject, Subscription, Observable, timer } from "rxjs";


@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.css']
})
export class ProceduresComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  studant: any;
  student:any;
  academicStand: any;
  StudantsData: Studant[];
  transactions: Transactions[];
  transaction: Transactions[];
  data;
  Hidden: boolean = true;
  collegeNumber;
  inputValue: string;
  options: { label: string; value: string }[];
  dtOptions: any = {};
  dtTrigger: Subject<Studant> = new Subject();
  selected: { id: number }[] = [];
  validateForm: FormGroup;
  request;
  program;
  account: any = {};
  payments: Payment[];
  paymen: Payment[];

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor( private studantService: StudantService,
    private auth: AuthService,
    private modalService: NzModalService,
    private payment: PaymentService,
    private message: NzMessageService,
    private reports: ReportsService,
    private http: HttpClient,
    private fb: FormBuilder,
    private common: CommonService) { }

  async ngOnInit() {
    this.auth.isAllowed("registration");
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
        
        {
          text: "اجراءات طالب",
          key: "1",
          action: () => {
            this.open();
          }
        }
        
      ]
    };

    
  
  }
  submitForm() {
    // this.getData();
  }

  onChange(value: string): void {
    console.log(value);
    
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
  
      
    
    // this.validateForm.controls["PaymentFrom"].setValue(this.studant.id);
  }
  
searchcomplete()
{
  
  this.student = this.StudantsData.filter(
    studant => studant.id == this.studant)[0];
    // console.log(this.student);
    this.getAcccountData();
    

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

  getAcccountData() {
    this.http
      .get(
        this.common.APIEndPoint +
          "/stdaccount/account/" +
           this.studant,
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
  }

  isHidden()
  {
    if(this.request=='transfare') 
    return true;
    return false;
  }
  
  // printOrder() {
  //   console.log(this.request);
  //   this.reports.getReport(this.student.id, this.request);
  // }

  SubmitProcedure()
  {

    switch(this.request)
    {
      case "freeze":
      this.studantService.freeze(this.student.id);
    
      break;
    
      case "resign":
        
        this.studantService.resign(this.student.id);
      break;
    
    }
  }

}

