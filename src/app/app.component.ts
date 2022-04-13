import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'AngularNGrid';

  @ViewChild('agGrid') agGrid!: AgGridAngular;

  defaultColDef: ColDef = {
        sortable: true,
        filter: true
    };

  columnDefs: ColDef[] = [
        { field: 'make', rowGroup: true },
        { field: 'price' }
    ];

  autoGroupColumnDef: ColDef = {
        headerName: 'Model',
        field: 'model',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            checkbox: true
        }
    };

  rowData: Observable<any[]>;

  constructor(private http: HttpClient) {
      this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }

  getSelectedRows() {
        const selectedNodes = this.agGrid.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => {
          if (node.groupData) {
            return { make: node.key, model: 'Group' };
          }
          return node.data;
        });
        const selectedDataStringPresentation = selectedData.map(node => `${node.make} ${node.model}`).join(', ');

        alert(`Selected nodes: ${selectedDataStringPresentation}`);
    }

}
