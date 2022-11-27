import { CommonService } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NzMessageService, NzUpdateHostClassService } from "ng-zorro-antd";
import { FreezeComponent } from '../pages/student/freeze/freeze.component';
import { ProceduresComponent } from '../pages/procedures/procedures.component';

export interface Studant {
  id: any;
  arabicFullName: any;
  englishFullName: any;
  gender: any;
  emailAddress: any;
  pvType: any;
  pvNumber: any;
  religion: any;
  birthCountry: any;
  birthday: any;
  address: any;
  nationality: any;
  phoneNumber1: any;
  phoneNumber2: any;
  residencynumber: any;
  residencyExpire: any;
  parentName: any;
  parentPhoneNumber1: any;
  parentPhoneNumber2: any;
  relation: any;
  applyDate: any;
  CertType: any;
  CertPercentage: any;
  program: any;
  collegeNumber: any;
  studentID: any;
  status: any;
  year: any;
  currency: any;
  class: any;
  semester: any;
  academicStand: any;
  pic: any;
}

export interface Commity {
  isMedicalFit: boolean;
  isCommityFit: boolean;
  studant;
}

interface Acceptance {
  studant: Studant;
  commity: Commity;
}

@Injectable({
  providedIn: "root"
})
export class StudantService {
  Acceptance: Acceptance;
  data: any;
  message;
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private msg: NzMessageService
  ) {}

  acceptance(studantData: Studant, commity: Commity) {
    this.Acceptance = {
      studant: studantData,
      commity
    };
    this.http
      .post<Acceptance>(this.common.AcceptanceUrl, this.Acceptance)
      .subscribe(
        res => res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success("تم حفظ البيانات بنجاح");
        }
      );
    return this.data;
  }

  update(studantData: Studant) {
    return this.http
      .put<Studant>(this.common.StudantUrl + "/" + studantData.id, studantData)
      .subscribe(
        res => res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success("تم حفظ البيانات بنجاح");
        }
      );
  }

  registration(academicStand, studant, collegeNumber) {
    this.http
      .post(this.common.Registration + "/" + studant, {
        academicStand,
        collegeNumber
      })
      .subscribe(
        res => res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success("تم حفظ البيانات بنجاح");
        }
      );
  }

  scolarship(studant, brother, scolarship, scolarshipType) {
    scolarship = Math.round(scolarship) / 100;
    scolarship = (1 - scolarship).toFixed(2);
    return this.http.post(this.common.Scolarship + "/" + studant, {
      scolarship,
      scolarshipType,
      brother
    });
  }

  removeScolarship(studant) {
    return this.http.delete(this.common.Scolarship + "/" + studant);
  }

  passExam(data) {
    return this.http.post(this.common.Pass, { studants: data });
  }
  repeatYear(data) {
    return this.http.post(this.common.repeat, { studants: data });
  }

  getStudant(id: number): Observable<Studant> {
    return this.http.get<Studant>(this.common.StudantUrl + "/" + id);
  }
  getStudantsFull(type: any = null): Observable<Studant[]> {
    return this.http.get<Studant[]>(this.common.StudantUrl);
  }

  getStudantsBasics(type: any = null): Observable<Studant[]> {
    return this.http.get<Studant[]>(this.common.StudantBasicUrl);
  }

  accepted(studants) {
    return this.http.post(this.common.StudantUrl + "/accepted", { studants });
  }

  freeze(data)
  {
    var url;
    this.http
      .post<Studant>(this.common.freeze, {id:data})
      .subscribe(
        res => (url = res),
        error => console.log(error),
        () => {
          window.open(url, "popup", "width=680,height=500");
        }
      );
    return this.data;
  }
  
  resign(data)
  {
    var url;
    this.http
      .post<Studant>(this.common.resign, {id:data})
      .subscribe(
        res => (url = res),
        error => console.log(error),
        () => {
          window.open(url, "popup", "width=680,height=500");
        }
      );
    return this.data;
  }
  
  transfare(data,prog,stdclass)
  {
    this.http
      .post<Studant>(this.common.transfare, {id:data,program:prog,class:stdclass})
      .subscribe(
        res => this.message = res,
        error => this.msg.error("حدث خطاء اثناء حفظ البيانات"),
        () => {
          this.msg.success(this.message);
          
          
        }
      );
    return this.data;
  }
  
}
