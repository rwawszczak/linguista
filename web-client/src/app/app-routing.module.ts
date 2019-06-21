import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./_guards/auth.guard";
import {AddUserComponent} from "./add-user/add-user.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'addUser', component: AddUserComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
