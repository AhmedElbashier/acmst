import { InformationComponent } from "./pages/student/information/information.component";
import { PaymentsComponent } from "./pages/settings/payments/payments.component";
import { SemesterComponent } from "./pages/settings/semester/semester.component";
import { TollsComponent } from "./pages/settings/tolls/tolls.component";
import { UsersComponent } from "./pages/settings/users/users.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { ExamsComponent } from "./pages/exams/exams.component";
import { AcceptedComponent } from "./pages/acceptance/accepted/accepted.component";
import { AuthGuardService as AuthGuard } from "./Services/auth.guard.service";
import { AcceptanceComponent } from "./pages/acceptance/acceptance.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, CanActivate } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { MainComponent } from "./pages/main/main.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ScolarshipComponent } from "./pages/payment/scolarship/scolarship.component";
import { InstallmentComponent } from "./pages/payment/installment/installment.component";
import { ResignationComponent } from "./pages/student/resignation/resignation.component";
import { CardComponent } from "./pages/card/card.component";
import { ReportComponent } from "./pages/payment/report/report.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import { FreezeComponent } from './pages/student/freeze/freeze.component';
import {ProceduresComponent} from './pages/procedures/procedures.component';
import {ExtraservicesComponent} from './pages/payment/extraservices/extraservices.component';
import { TransfareComponent } from './pages/acceptance/transfare/transfare.component';
import { ServicesComponent } from "./pages/settings/services/services.component";
const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/login" },
  { path: "login", component: LoginComponent },
  {
    path: "main",
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "acceptance",
        children: [
          { path: "new", component: AcceptanceComponent },
          { path: "accepted", component: AcceptedComponent },
          { path: "transfare", component: TransfareComponent }
        ]
      },
      { path: "registration", component: RegistrationComponent },
      { path: "info", component: InformationComponent },
      { path: "settings", component: SettingsComponent },

      {
        path: "payment",
        children: [
          { path: "scolarship", component: ScolarshipComponent },
          { path: "installment", component: InstallmentComponent },
          { path: "extra",component: ExtraservicesComponent},
          { path: "report", component: ReportComponent }
        ]
      },
      { path: "exams", component: ExamsComponent },
      {
        path: "settings",
        // component: SettingsComponent,
        children: [
          { path: "users", component: UsersComponent },
          { path: "tolls", component: TollsComponent },
          { path: "semester", component: SemesterComponent },
          { path: "payments", component: PaymentsComponent },
          { path: "services", component: ServicesComponent }
        ]
      },
      {
        path: "studant",
        children: [
          { path: "resignation", component: ResignationComponent },
          { path: "orders", component: OrdersComponent },
          { path: "procedures",component: ProceduresComponent},
          { path: "card", component: CardComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
