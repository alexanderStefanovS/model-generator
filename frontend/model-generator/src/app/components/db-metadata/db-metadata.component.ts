import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorResponse } from 'src/app/classes/error-response';
import { Table } from 'src/app/classes/table';
import { TableColumn } from 'src/app/classes/table-column';
import { download } from 'src/app/functions/download';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-db-metadata',
  templateUrl: './db-metadata.component.html',
  styleUrls: ['./db-metadata.component.css']
})
export class DbMetadataComponent implements OnInit {

  public readonly GET_TABLES_URL = 'db-metadata/db';
  public readonly GET_TABLE_COLUMNS_URL = 'db-metadata/table';
  public readonly EXPORT_URL = 'export-models';

  public tables: Table[] = [];
  public selectedTable!: Table;
  public errMsg = '';
  public isTablesDataLoading = false;
  public isColumnsDataLoading = false;

  @ViewChild('successSwal') private successSwal!: SwalComponent;
  @ViewChild('errorSwal') private errorSwal!: SwalComponent;

  constructor(
    private baseService: BaseService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public readonly swalTargets: SwalPortalTargets
  ) { }

  ngOnInit(): void {
    this.loadTables();
  }

  //#region services

  private loadTables(): void {
    this.isTablesDataLoading = true;
    this.baseService.loadData(this.GET_TABLES_URL, Table)
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
          this.selectedTable = this.tables[0];
          this.loadTableColumns();
          this.isTablesDataLoading = false;
        },
        (err: ErrorResponse) => {
          this.errMsg = err.message;
          this.isTablesDataLoading = false;
          this.errorSwal.fire();
        }
      );
  }

  private loadTableColumns(): void {
    this.isColumnsDataLoading = true;
    const url = `${this.GET_TABLE_COLUMNS_URL}/${this.selectedTable.tableName}`;
    this.baseService.loadData(url, TableColumn)
      .subscribe(
        (columns: TableColumn[]) => {
          this.selectedTable.columns = columns;
          this.isColumnsDataLoading = false;
        },
        (err: ErrorResponse) => {
          this.errMsg = err.message;
          this.isColumnsDataLoading = false;
          this.errorSwal.fire();
        }
      );
  }

  //#endregion

  onClickTable(table: Table): void {
    this.selectedTable = table;
    if (!this.selectedTable.columns.length) {
      this.loadTableColumns();
    }
  }

  onCheckTable(table: Table): void {
    table.isChecked = !table.isChecked;
  }

  isSemicolumnNeeded(columns: TableColumn[], index: number): boolean {
    for (let i = index + 1; i < columns.length; i++) {
      if (columns[i].isChecked) {
        return true;
      }
    }
    return false;
  }

  isGenrateButtonDisabled(): any {
    return this.tables.reduce((isDisabled, table) => {
      return !table.isChecked && isDisabled;
    }, true);
  }

  onGenerateFiles(): void {
    this.spinner.show();

    const selectedTables: Table[] = this.tables.reduce((acc: Table[], table) => {
      if (table.isChecked) {
        const columns = table.columns.filter(column => column.isChecked);
        const genTable = new Table({tableName: table.tableName, columns});
        acc.push(genTable);
      }
      return acc;
    }, []);

    this.baseService.loadFile(this.EXPORT_URL, selectedTables)
      .subscribe(
        ({archive, filename}) => {
          download(archive, filename);
          this.spinner.hide();
          this.successSwal.fire();
        },
        (err: ErrorResponse) => {
          this.errMsg = 'Error generating models';
          this.spinner.hide();
          this.errorSwal.fire();
        }
      );
  }

  redirectOnError(): void {
    this.router.navigate(['../db-connection']);
  }

  onCheckAllColumns(): void {
    this.selectedTable.columns.forEach(column => column.isChecked = !column.isChecked);
  }

}
