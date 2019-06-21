import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule, MatSortModule,
  MatTableModule
} from "@angular/material";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {NgModule} from "@angular/core";
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,],
  exports: [MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule],
})

export class MaterialModule {
}
