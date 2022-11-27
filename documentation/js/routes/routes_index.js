var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","pathMatch":"full","redirectTo":"/login"},{"path":"login","component":"LoginComponent"},{"path":"main","component":"MainComponent","canActivate":["AuthGuard"],"children":[{"path":"acceptance","children":[{"path":"new","component":"AcceptanceComponent"},{"path":"accepted","component":"AcceptedComponent"},{"path":"transfare","component":"TransfareComponent"}]},{"path":"registration","component":"RegistrationComponent"},{"path":"info","component":"InformationComponent"},{"path":"settings","component":"SettingsComponent"},{"path":"payment","children":[{"path":"scolarship","component":"ScolarshipComponent"},{"path":"installment","component":"InstallmentComponent"},{"path":"extra","component":"ExtraservicesComponent"},{"path":"report","component":"ReportComponent"}]},{"path":"exams","component":"ExamsComponent"},{"path":"settings","children":[{"path":"users","component":"UsersComponent"},{"path":"tolls","component":"TollsComponent"},{"path":"semester","component":"SemesterComponent"},{"path":"payments","component":"PaymentsComponent"},{"path":"services","component":"ServicesComponent"}]},{"path":"studant","children":[{"path":"resignation","component":"ResignationComponent"},{"path":"orders","component":"OrdersComponent"},{"path":"procedures","component":"ProceduresComponent"},{"path":"card","component":"CardComponent"}]}]}],"kind":"module"}]}