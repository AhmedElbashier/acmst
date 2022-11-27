import { NzMessageService } from "ng-zorro-antd";
import { CommonService } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Payment {
  id: any;
  amount: any;
  PaymentTo: any;
  PaymentFrom: any;
  PaymentType: any;
  PaymentMethod: any;
  PaymentDate: any;
  StatmentDate: any;
  StatmentNumber: any;
  userId: any;
}
interface StudantInstallment {
  StudentId: any;
  InvoiceNumber: any;
  PaymentId: any;
  checked: any;
  checkedBy: any;
  Notes: any;
}

export interface Transactions {
  id: any;
  amount: any;
  leftover: any;
  payments: any;
  userId: any;
  studantId: any;
  created_at: any;
  updated_at: any;
}

export interface Scolarship {
  id: any;
  arabicFullName: any;
  applyDate: any;
  program: any;
  collegeNumber: any;
  status: any;
  stdYear: any;
  currency: any;
  academicStand: any;
  scolarship: any;
  scolarshipType: any;
}

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  data: { Payment: Payment; StudantInstallment: StudantInstallment };
  messege = "";
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private msg: NzMessageService
  ) {}

  Installment(payment: Payment, studantInstallment: StudantInstallment) {
    this.data = {
      Payment: payment,
      StudantInstallment: studantInstallment
    };
    return this.http.post(this.common.installment, this.data);
  }

  getPayments(year: any = null): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.common.installment);
  }

  getTransactions(year: any = null): Observable<Transactions[]> {
    return this.http.get<Transactions[]>(this.common.transactions);
  }

  getTransactionsFilter(
    date: any[],
    program,
    currency,
    method
  ): Observable<Transactions[]> {
    return this.http.post<Transactions[]>(
      this.common.transactions + "/report",
      { date, program, currency, method }
    );
  }

  getScolarship(): Observable<Scolarship[]> {
    return this.http.get<Scolarship[]>(this.common.Scolarship);
  }
}
