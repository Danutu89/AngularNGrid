import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'AngularNGrid';

  columnDefs: ColDef[] = [
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true }
  ];

  rowData: Observable<any[]>;

  constructor(private http: HttpClient) {
      this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/small-row-data.json');
  }

}
