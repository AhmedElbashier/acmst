import { CommonService } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NzMessageService, NzUpdateHostClassService } from "ng-zorro-antd";
import { FreezeComponent } from '../pages/student/freeze/freeze.component';
import { ProceduresComponent } from '../pages/procedures/procedures.component';


export interface Extra {
id:any;
amount:any;
userId:any;
studantId:any;
PaymentType:any;
PaymentMethod:any;
StatmentDate:any;
StatmentNumber:any;
ReceiptNumer:any;
}
export interface Services {
id:any;
name:any;
  type:any;
  department:any;
  price:any;
  
  }

@Injectable({
  providedIn: 'root'
})
export class ExtraService {
  data: any;
  message;
  PaymentMethod;
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private msg: NzMessageService,
    private extraService : ExtraService,
  ) { }



  unfreezeStatement(id,amount)
  {
    
    this.http
      .post<Extra>(this.common.unfreeze, {id:id,amount:amount})
      .subscribe(
        res => this.message = res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success(this.message);
        }
      );
    return this.data;
  }

  cardReplacementStatement(id,amount)
  {
    this.http
      .post<Extra>(this.common.cardReplacement, {id:id,amount:amount})
      .subscribe(
        res => this.message = res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success(this.message);
          
        }
      );
    return this.data;
  }



  Payment(id,amount,request)
  {
    
    this.http
    .post<Extra>(this.common.extrapayments +"/add" ,{studantId:id,PaymentType:request,amount:amount,PaymentMethod:"نقدي",})
    .subscribe(
      res => this.message = res,
      error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
      () => {
        this.msg.success(this.message);
        
      }
    );
  return this.data;
    
  }

  printInvoice(id)
{
  
}
 
}