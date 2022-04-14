import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CellClassParams, CellStyle, ColDef, GridOptions, RowSelectedEvent } from 'ag-grid-community';
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

  cellRenderer = (row: CellClassParams) => {
    if (row.node.isSelected()) {
      return { "background-color": "initial" } as CellStyle;
    }
    if (row.node.selectable) {
      return { "background-color": "initial" } as CellStyle;
    } else {
      return { "background-color": "rgb(166 166 166)" } as CellStyle;
    }
  }

  columnDefs: ColDef[] = [
    { headerName: 'Period', field: 'period', checkboxSelection: true, cellStyle: this.cellRenderer, pinned: 'left' }, //enum('new', 'old');
    { headerName: 'Match Score', field: 'matchScore', pinned: 'left', cellStyle: this.cellRenderer }, //number
    { headerName: 'ID', field: 'id', cellStyle: this.cellRenderer }, //number
    { headerName: 'Insured Object', field: 'insuredObject', cellStyle: this.cellRenderer }, //string
    { headerName: 'Comment', field: 'comment', cellStyle: this.cellRenderer }, //string
    { headerName: 'Comment 2', field: 'comment2', cellStyle: this.cellRenderer }, //string
    { headerName: 'Comment 3', field: 'comment3', cellStyle: this.cellRenderer }, //string
    { headerName: 'Comment 4', field: 'comment4', cellStyle: this.cellRenderer }, //string
    { headerName: 'Country', field: 'country', cellStyle: this.cellRenderer }, //enum('countryCodes')
    { headerName: 'Street', field: 'street', cellStyle: this.cellRenderer }, //string
    { headerName: 'Street No.', field: 'streetNumber', cellStyle: this.cellRenderer }, //string
    { headerName: 'City', field: 'city', cellStyle: this.cellRenderer }, //string
    { headerName: 'State', field: 'state', cellStyle: this.cellRenderer }, //string
    { headerName: 'ZIP', field: 'zip', cellStyle: this.cellRenderer }, //number
    { headerName: 'Total TSI', field: 'totalTsi', cellStyle: this.cellRenderer }, //number
    { headerName: '% Change', field: 'totalTsiPercentage', cellStyle: this.cellRenderer }, //number (percentage)
    { headerName: 'Total PD', field: 'totalPd', cellStyle: this.cellRenderer }, //number
    { headerName: '% Change', field: 'totalPdPercentage', cellStyle: this.cellRenderer }, //number (percentage)
    { headerName: 'TSI Building', field: 'tsiBuilding', cellStyle: this.cellRenderer }, //number
    { headerName: '% Change', field: 'tsiBuildingPercentage', cellStyle: this.cellRenderer }, //number (percentage)
    { headerName: 'TSI Contents', field: 'tsiContents', cellStyle: this.cellRenderer }, //number
    { headerName: '% Change', field: 'tsiContentsPercentage', cellStyle: this.cellRenderer }, //number (percentage)
    { headerName: 'TSI BI', field: 'tsiBi', cellStyle: this.cellRenderer }, //number
    { headerName: '% Change', field: 'tsiBiPercentage', cellStyle: this.cellRenderer }, //number (percentage)
    { headerName: 'Longitude', field: 'longitude', cellStyle: this.cellRenderer }, //number
    { headerName: 'Latitude', field: 'latitude', cellStyle: this.cellRenderer }, //number
    { headerName: 'Occupancy Code', field: 'occupancyCode', cellStyle: this.cellRenderer }, //number
    { headerName: 'No. of Buildings', field: 'numberOfBuildings', cellStyle: this.cellRenderer }, //number
    { headerName: 'Stories above Ground', field: 'storiesAboveGround', cellStyle: this.cellRenderer }, //number
    { headerName: 'Year of Construction', field: 'constructionYear', cellStyle: this.cellRenderer }, //year
    { headerName: 'Construction Class NatCat', field: 'constructionClassNatcat', cellStyle: this.cellRenderer }, //string
    { headerName: 'Construction Class', field: 'constructionClass', cellStyle: this.cellRenderer }, //string
    { headerName: 'Construction Class Scheme+', field: 'constructionClassScheme', cellStyle: this.cellRenderer }, //string
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
    console.log(selectionCounts);

    this.agGrid.api.forEachNode((node) => {
      let selectable = true;

      if (selectedRows.length === 0) {
        selectable = true;
      }

      if (selectedRows.some((row) => row.rowIndex !== node.rowIndex)) {
        if (selectionCounts === 2) selectable = false
        else selectable = selectedRows[0] ? selectedRows[0].data['period'] !== node.data['period'] : true;

      }
      node.selectable = selectable;
    });
    this.agGrid.api.refreshCells({
      force: true,
      suppressFlash: true
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
