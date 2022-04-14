import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CellClassParams, ColDef, GridOptions, RowSelectedEvent } from 'ag-grid-community';
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

/*  
  columnDefs: ColDef[] = [
    {
      field: 'make', checkboxSelection: true, cellStyle: (row: CellClassParams) => {
        return {};
      }
    },
    { field: 'price' }
  ]; 
*/

  columnDefs: ColDef[] = [
    {headerName: 'Period', field: 'period', checkboxSelection: true, cellStyle: (row: CellClassParams) => {
        return {};
      }, pinned: 'left'}, //enum('new', 'old');
    {headerName: 'Match Score',field: 'matchScore', pinned: 'left'}, //number
    {headerName: 'ID', field: 'id'}, //number
    {headerName: 'Insured Object', field: 'insuredObject'}, //string
    {headerName: 'Comment', field: 'comment'}, //string
    {headerName: 'Comment 2', field: 'comment2'}, //string
    {headerName: 'Comment 3', field: 'comment3'}, //string
    {headerName: 'Comment 4', field: 'comment4'}, //string
    {headerName: 'Country', field: 'country'}, //enum('countryCodes')
    {headerName: 'Street', field: 'street'}, //string
    {headerName: 'Street No.', field: 'streetNumber'}, //string
    {headerName: 'City', field: 'city'}, //string
    {headerName: 'State', field: 'state'}, //string
    {headerName: 'ZIP', field: 'zip'}, //number
    {headerName: 'Total TSI', field: 'totalTsi'}, //number
    {headerName: '% Change', field: 'totalTsiPercentage'}, //number (percentage)
    {headerName: 'Total PD', field: 'totalPd'}, //number
    {headerName: '% Change', field: 'totalPdPercentage'}, //number (percentage)
    {headerName: 'TSI Building', field: 'tsiBuilding'}, //number
    {headerName: '% Change', field: 'tsiBuildingPercentage'}, //number (percentage)
    {headerName: 'TSI Contents', field: 'tsiContents'}, //number
    {headerName: '% Change', field: 'tsiContentsPercentage'}, //number (percentage)
    {headerName: 'TSI BI', field: 'tsiBi'}, //number
    {headerName: '% Change', field: 'tsiBiPercentage'}, //number (percentage)
    {headerName: 'Longitude', field: 'longitude'}, //number
    {headerName: 'Latitude', field: 'latitude'}, //number
    {headerName: 'Occupancy Code', field: 'occupancyCode'}, //number
    {headerName: 'No. of Buildings', field: 'numberOfBuildings'}, //number
    {headerName: 'Stories above Ground', field: 'storiesAboveGround'}, //number
    {headerName: 'Year of Construction', field: 'constructionYear'}, //year
    {headerName: 'Construction Class NatCat', field: 'constructionClassNatcat'}, //string
    {headerName: 'Construction Class', field: 'constructionClass'}, //string
    {headerName: 'Construction Class Scheme+', field: 'constructionClassScheme'}, //string
  ];

  autoGroupColumnDef: ColDef = {
    headerName: 'Model',
    field: 'model',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true
    }
  };

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: this.defaultColDef,
    autoGroupColumnDef: this.autoGroupColumnDef,
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true,
    animateRows: true,
    onRowSelected: this.onRowSelected.bind(this),
  }

  rowData: Observable<any[]>;

  constructor(private http: HttpClient) {
    // this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
    this.rowData = this.http.get<any[]>('https://cors-anywhere.herokuapp.com/https://github.com/Danutu89/AngularNGrid/raw/master/src/assets/data/grid-data-small.json');
  }

  onRowSelected(event: RowSelectedEvent) {
    const selectedRows = this.agGrid.api.getSelectedNodes();
    var selectionCounts = selectedRows.length;
    this.agGrid.api.forEachNode((node) => {
      if (selectedRows.some((row) => row.rowIndex !== node.rowIndex))
        node.selectable = selectionCounts < 2;
    });
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
