import {MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from "@angular/material";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {NgModule} from "@angular/core";

@NgModule({
  imports: [MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule],
  exports: [MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule],
})

export class MaterialModule {}
