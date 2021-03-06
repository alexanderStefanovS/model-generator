import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenerationWayChoiceComponent } from './components/generation-way-choice/generation-way-choice.component';
import { HeaderComponent } from './components/header/header.component';
import { DbConnctionComponent } from './components/db-connction/db-connction.component';
import { CustomGenerationComponent } from './components/custom-generation/custom-generation.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { MysqlConnectionFormComponent } from './components/db-connection-forms/mysql-connection-form/mysql-connection-form.component';
import { DbMetadataComponent } from './components/db-metadata/db-metadata.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    GenerationWayChoiceComponent,
    HeaderComponent,
    DbConnctionComponent,
    CustomGenerationComponent,
    MysqlConnectionFormComponent,
    DbMetadataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
