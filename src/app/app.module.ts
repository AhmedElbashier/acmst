import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IconsProviderModule } from "./icons-provider.module";
import {
  NgZorroAntdModule,
  NZ_I18N,
  ar_EG,
  NzModalModule
} from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import ar from "@angular/common/locales/ar";
import { LoginComponent } from "./pages/login/login.component";
import { NZModule } from "./nz.module";
import { MainComponent } from "./pages/main/main.component";
import { AcceptanceComponent } from "./pages/acceptance/acceptance.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ScolarshipComponent } from "./pages/payment/scolarship/scolarship.component";
import { InstallmentComponent } from "./pages/payment/installment/installment.component";
import { JwtModule, JwtModuleOptions } from "@auth0/angular-jwt";
import { AuthService, tokenGetter } from "./Services/auth.service";
import { TokenInterceptor } from "./Services/header-interceptor.service";
import { ResignationComponent } from "./pages/student/resignation/resignation.component";
import { FreezeComponent } from "./pages/student/freeze/freeze.component";
import { AcceptedComponent } from "./pages/acceptance/accepted/accepted.component";
import { ExamsComponent } from "./pages/exams/exams.component";
import { CardComponent } from "./pages/card/card.component";
import { NgxImageCompressService } from "ngx-image-compress";
import { SettingsComponent } from "./pages/settings/settings.component";
import { DataTablesModule } from "angular-datatables";
import { UsersComponent } from './pages/settings/users/users.component';
import { TollsComponent } from './pages/settings/tolls/tolls.component';
import { SemesterComponent } from './pages/settings/semester/semester.component';
import { PaymentsComponent } from './pages/settings/payments/payments.component';
import { InformationComponent } from './pages/student/information/information.component';
import { ReportComponent } from './pages/payment/report/report.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProceduresComponent } from './pages/procedures/procedures.component';
import { TransfareComponent } from './pages/acceptance/transfare/transfare.component';
import { ExtraservicesComponent } from './pages/payment/extraservices/extraservices.component';
import { ServicesComponent } from './pages/settings/services/services.component';

registerLocaleData(ar);

const JWT_Module_Options: JwtModuleOptions = {
  config: {
    tokenGetter: tokenGetter,
    whitelistedDomains: ["localhost:8000"]
  }
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    AcceptanceComponent,
    RegistrationComponent,
    ScolarshipComponent,
    InstallmentComponent,
    ResignationComponent,
    FreezeComponent,
    AcceptedComponent,
    ExamsComponent,
    CardComponent,
    SettingsComponent,
    UsersComponent,
    TollsComponent,
    SemesterComponent,
    PaymentsComponent,
    InformationComponent,
    ReportComponent,
    OrdersComponent,
    ProceduresComponent,
    TransfareComponent,
    ExtraservicesComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzModalModule,
    NZModule,
    DataTablesModule,
    JwtModule.forRoot(JWT_Module_Options)
  ],
  providers: [
    { provide: NZ_I18N, useValue: ar_EG },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
