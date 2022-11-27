import { AuthService } from "./../../Services/auth.service";
import { CommonService } from "./../../Services/common.service";
import { Studant, Commity } from "./../../Services/studant.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { StudantService } from "src/app/Services/studant.service";
import { DatePipe } from "@angular/common";
import { NzMessageService } from "ng-zorro-antd/message";
import { Observable, Observer, Subject } from "rxjs";
import { NgxImageCompressService } from "ngx-image-compress";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-acceptance",
  templateUrl: "./acceptance.component.html",
  styleUrls: ["./acceptance.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [DatePipe]
})
export class AcceptanceComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  [x: string]: any;
  validateForm: FormGroup;
  studantData: Studant;
  StudantsData: Studant[];
  commityData: Commity;
  edit: boolean;
  nationalities;
  coutries;
  data;
  loading = false;
  avatarUrl: string;
  sp1: string = "'+249'";
  sp2: string = "'+249'";
  pp1: string = "'+249'";
  pp2: string = "'+249'";
  dtOptions: any = {};
  dtTrigger: Subject<Studant> = new Subject();

  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  visibleNew = false;
  visibleCheck = false;

  open(): void {
    this.visibleNew = true;
  }

  close(): void {
    this.visibleNew = false;
  }
  openCheck(): void {
    this.visibleCheck = true;
  }

  closeCheck(): void {
    this.visibleCheck = false;
  }

  check() {
    this.studantData = {
      id: this.validateForm.controls["id"].value,
      arabicFullName:
        this.validateForm.controls["arName1"].value +
        " , " +
        this.validateForm.controls["arName2"].value +
        " , " +
        this.validateForm.controls["arName3"].value +
        " , " +
        this.validateForm.controls["arName4"].value,
      englishFullName: "",
      gender: this.validateForm.controls["gender"].value,
      emailAddress: this.validateForm.controls["emailAddress"].value,
      pvType: this.validateForm.controls["pvType"].value,
      pvNumber: this.validateForm.controls["pvNumber"].value,
      religion: this.validateForm.controls["religion"].value,
      birthCountry: this.validateForm.controls["birthCountry"].value,
      birthday: this.validateForm.controls["birthday"].value,
      address: this.validateForm.controls["address"].value,
      nationality: this.validateForm.controls["nationality"].value,
      phoneNumber1:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.phoneNumber1
          : this.sp1.replace("'", "").replace("'", "") +
            this.validateForm.controls["phoneNumber1"].value,
      phoneNumber2:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.phoneNumber2
          : this.sp2.replace("'", "").replace("'", "") +
            this.validateForm.controls["phoneNumber2"].value,
      residencynumber: this.validateForm.controls["residencynumber"].value,
      residencyExpire: this.validateForm.controls["residencyExpire"].value,
      parentName:
        this.validateForm.controls["prName1"].value +
        " , " +
        this.validateForm.controls["prName2"].value +
        " , " +
        this.validateForm.controls["prName3"].value +
        " , " +
        this.validateForm.controls["prName4"].value,
      parentPhoneNumber1:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.parentPhoneNumber1
          : this.pp1.replace("'", "").replace("'", "") +
            this.validateForm.controls["parentPhoneNumber1"].value,
      parentPhoneNumber2:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.parentPhoneNumber2
          : this.pp2.replace("'", "").replace("'", "") +
            this.validateForm.controls["parentPhoneNumber2"].value,
      relation: this.validateForm.controls["relation"].value,
      applyDate: this.validateForm.controls["applyDate"].value,
      CertType: this.validateForm.controls["CertType"].value,
      CertPercentage: this.validateForm.controls["CertPercentage"].value,
      program: this.validateForm.controls["program"].value,
      year: this.validateForm.controls["year"].value,
      collegeNumber: this.validateForm.controls["collegeNumber"].value,
      studentID:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.studentID
          : "",
      status:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.status
          : "",
      class: this.validateForm.controls["class"].value,
      semester:
        typeof this.studantData !== "undefined" && this.studantData !== null
          ? this.studantData.semester
          : "الاول",
      currency: this.validateForm.controls["currency"].value,
      pic: this.imgResultAfterCompress,
      academicStand: this.validateForm.controls["academicStand"].value
    };
    this.openCheck();
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  constructor(
    private fb: FormBuilder,
    private studant: StudantService,
    private common: CommonService,
    private msg: NzMessageService,
    private imageCompress: NgxImageCompressService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAllowed("acceptance");

    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      arName1: [null, [Validators.required]],
      arName2: [null, [Validators.required]],
      arName3: [null, [Validators.required]],
      arName4: [null, [Validators.required]],
      enName1: [null, [Validators.required]],
      enName2: [null, [Validators.required]],
      enName3: [null, [Validators.required]],
      enName4: [null, [Validators.required]],
      prName1: [null, [Validators.required]],
      prName2: [null, [Validators.required]],
      prName3: [null, [Validators.required]],
      prName4: [null, [Validators.required]],
      arabicFullName: [null, [Validators.required]],
      englishFullName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      emailAddress: [null, [Validators.required]],
      pvType: [null, [Validators.required]],
      pvNumber: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      birthCountry: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      address: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      phoneNumber1: [null, [Validators.required]],
      phoneNumber2: [null, [Validators.required]],
      residencynumber: [null, [Validators.required]],
      residencyExpire: [null, [Validators.required]],
      parentName: [null, [Validators.required]],
      parentPhoneNumber1: [null, [Validators.required]],
      parentPhoneNumber2: [null, [Validators.required]],
      relation: [null, [Validators.required]],
      applyDate: [null, [Validators.required]],
      CertType: [null, [Validators.required]],
      CertPercentage: [null, [Validators.required]],
      program: [null, [Validators.required]],
      collegeNumber: [null, [Validators.required]],
      studentID: [null, [Validators.required]],
      status: [null, [Validators.required]],
      year: [null, [Validators.required]],
      isMedicalFit: [null, [Validators.required]],
      isCommityFit: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      academicStand: [null, [Validators.required]],
      class: [null, [Validators.required]],
      pic: [null, [Validators.required]],
      semester: [null, [Validators.required]]
    });
    this.validateForm.patchValue({
      religion: "مسلم",
      nationality: "سوداني",
      birthCountry: "السودان",
      pvType: "الرقم الوطني",
      class: "الاول"
    });
    this.nationalities = this.common.Natoinality;
    this.coutries = this.common.Country;
    this.studant.getStudantsFull().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
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
      // Declare the use of the extension in the dom parameter
      dom: "Bfrtip",
      // Configure the buttons
      buttons: [
        "excel",
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
  }
  createBasicMessage(): void {
    this.message.success(
      "This is a prompt message for success, and it will disappear in 10 seconds",
      {
        nzDuration: 10000
      }
    );
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  submitForm(edit: boolean = false) {
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }

    this.commityData = {
      isCommityFit: true,
      isMedicalFit: true,
      studant: ""
    };
    console.log(this.studantData.class);

    if (this.edit) {
      this.studant.update(this.studantData);
      this.close();
      this.closeCheck();
      this.validateForm.reset();
    } else {
      this.studantData = this.studant.acceptance(
        this.studantData,
        this.commityData
      );
      this.close();
      this.closeCheck();
    }

    this.studant.getStudantsFull().subscribe(
      Studants => (this.data = Studants),
      error => console.log(error),
      () => {
        this.StudantsData = this.data;
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

  print() {
    window.print();
  }

  editStudant(studantId) {
    this.validateForm.reset();
    this.studantData = this.StudantsData.filter(
      studant => studant.id === studantId
    )[0];
    console.log(this.studantData);

    this.edit = true;
    this.validateForm.patchValue(this.studantData);
    var [name1, name2, name3, name4] = this.studantData.arabicFullName.split(
      " , "
    );
    this.validateForm.controls["arName1"].setValue(name1);
    this.validateForm.controls["arName2"].setValue(name2);
    this.validateForm.controls["arName3"].setValue(name3);
    this.validateForm.controls["arName4"].setValue(name4);
    var [name1, name2, name3, name4] = this.studantData.parentName.split(" , ");
    this.validateForm.controls["prName1"].setValue(name1);
    this.validateForm.controls["prName2"].setValue(name2);
    this.validateForm.controls["prName3"].setValue(name3);
    this.validateForm.controls["prName4"].setValue(name4);
    this.open();
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === "image/jpeg";

      const isLt2M = file.size / 1024 / 1024 < 2;

      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        observer.next(true);
        observer.complete();
      });
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 300);
      };
    });
  }

  compressFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.imgResultBeforeCompress = image;

      this.imageCompress
        .compressFile(image, orientation, 70, 70)
        .then(result => {
          this.imgResultAfterCompress = result;

          this.avatarUrl = this.imgResultBeforeCompress;
          this.validateForm.controls["pic"].setValue(
            this.imgResultBeforeCompress
          );
        });
    });
  }

  handleChange(): void {
    this.loading = false;
    this.compressFile();
  }

  reset() {
    this.validateForm.reset();
    this.validateForm.patchValue({
      religion: "مسلم",
      nationality: "سوداني",
      birthCountry: "السودان",
      pvType: "الرقم الوطني",
      class: "الاول"
    });
    this.studantData = null;
  }
}
