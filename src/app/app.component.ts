import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CellClassParams, CellStyle, ColDef, GridOptions, RowSelectedEvent, RowNode, ICellRendererComp, ICellRendererParams, RowSpanParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CheckboxRendererComponent } from './modules/cellRenderer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'AngularNGrid';
  disableButtons = true;

  matchFilterType = 'all';

  @ViewChild('agGrid') agGrid!: AgGridAngular;

  defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };


  cellRenderer = (row: CellClassParams) => {
    if (row.node.isSelected()) {
      return { "background-color": "initial" } as CellStyle;
    }
    if (row.node.data?.isGrouped) {
      return { "background-color": "rgb(0 128 0)", "display": "flex", "flex-flow": "row", "align-items": "center" } as CellStyle;
    }
    if (row.node.selectable) {
      return { "background-color": "initial" } as CellStyle;
    } else {
      return { "background-color": "rgb(166 166 166)" } as CellStyle;
    }
  }

  onSelectionChanged(event: any) {

    var selectedRows = this.agGrid.api.getSelectedRows();

    if (selectedRows.length < 2) {
      this.disableButtons = true;
    } else {
      this.disableButtons = false;
    }
  }

  columnDefs: ColDef[] = [
    {
      field: 'link',
      headerName: 'Links',
      pinned: 'left',
      cellRenderer: 'customCheckbox',
      rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    },
    {
      headerName: 'Period', field: 'period',
      cellStyle: this.cellRenderer,
      pinned: 'left',
      // rowSpan: params => params.data.isGrouped === true ? 2 : 1,
    }, //enum('new', 'old');
    {
      headerName: 'Match Score', field: 'matchScore', pinned: 'left', cellStyle: this.cellRenderer, cellClassRules: {
        'show-cell': 'value !== undefined',
      }, rowSpan: this.isRowSpanning, cellRenderer: ShowCellRenderer
    }, //number
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
    {
      headerName: '% Change', field: 'totalTsiPercentage', rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    }, //number (percentage)
    { headerName: 'Total PD', field: 'totalPd', cellStyle: this.cellRenderer }, //number
    {
      headerName: '% Change', field: 'totalPdPercentage', rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    }, //number (percentage)
    { headerName: 'TSI Building', field: 'tsiBuilding', cellStyle: this.cellRenderer }, //number
    {
      headerName: '% Change', field: 'tsiBuildingPercentage', rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    }, //number (percentage)
    { headerName: 'TSI Contents', field: 'tsiContents', cellStyle: this.cellRenderer }, //number
    {
      headerName: '% Change', field: 'tsiContentsPercentage', rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    }, //number (percentage)
    { headerName: 'TSI BI', field: 'tsiBi', cellStyle: this.cellRenderer }, //number
    {
      headerName: '% Change', field: 'tsiBiPercentage', rowSpan: this.isRowSpanning,
      cellStyle: this.cellRenderer,
      cellClassRules: {
        'show-cell': 'value !== undefined',
      }
    }, //number (percentage)
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
    suppressRowTransform: true,
    onRowSelected: this.onRowSelected.bind(this),
    isExternalFilterPresent: this.isExternalFilterPresent,
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    frameworkComponents: {
      customCheckbox: CheckboxRendererComponent
    }

  }

  rowData: Observable<any[]>;

  constructor(private http: HttpClient) {
    // this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
    this.rowData = this.http.get<any[]>('https://cors-anywhere.herokuapp.com/https://github.com/Danutu89/AngularNGrid/raw/master/src/assets/data/grid-data-small.json');
  }

  isExternalFilterPresent() {
    // console.log('isExternalFilterPresent');
    return this.matchFilterType != 'all';

  }

  doesExternalFilterPass(node: RowNode) {
    // console.log('doesExternalFilterPass');

    // console.log(this.matchFilterType);
    // console.log(this.matchFilterType);
    switch (this.matchFilterType) {
      case 'unmatchedonly': //OR CASE
        return node.data.isGrouped === false || typeof (node.data.isGrouped) === 'undefined';
      case 'matchedonly': // AND CASE
        return node.data.isGrouped === true;
      // case 'netherlandsOr2004': // OR CASE ACROSS DIFFERENT COLUMNS
      //   return node.data.country == 'Netherlands' || node.data.year == 2004;
      default:
        return true;
    };
  }

  isRowSpanning(params: RowSpanParams) {

    if (!params.data.isGrouped) return 1;

    let groupedRows = <RowNode[]>params.node?.data?.groupedWith?.map((id: string) => params.api.getRowNode(id)) || []

    let isHigherThanAll = groupedRows.every(row => (row?.rowTop || -1) > (params.node?.rowTop || -1));


    if (isHigherThanAll) {
      return 2;
    }

    return 1;
  }

  onRowSelected(event: RowSelectedEvent) {
    const selectedRows = this.agGrid.api.getSelectedNodes();
    var selectionCounts = selectedRows.length;


    this.agGrid.api.forEachNode((node) => {
      let selectable = true;

      if (selectedRows.length === 0) {
        selectable = true;
      }

      if (selectedRows.some((row) => row.rowIndex !== node.rowIndex)) {

        if (selectionCounts === 2) {
          selectable = false;
        }
        else {
          selectable = selectedRows[0] ? selectedRows[0].data['period'] !== node.data['period'] : true;
        }

      }
      if (node.data['isGrouped'] === true) {
        selectable = false;
      }
      node.selectable = selectable;
    });
    this.agGrid.api.refreshCells({
      force: true,
    });
  }

  setLinkedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();

    selectedNodes.forEach(selectedNode => {
      selectedNode.data.isGrouped = true;
      selectedNode.data.groupedWith = selectedNodes.map(node => node?.id);
      selectedNode.setSelected(false);
      selectedNode.setRowSelectable(false);
      selectedNode.selectable = false;
    });

  }

  onFilterTextBoxChanged() {
    // console.log('onFilterTextBoxChanged');

    this.agGrid.api.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPrintQuickFilterTexts() {
    // console.log('printQuickFilterTexts');
    this.agGrid.api.forEachNode(function (rowNode, index) {
      console.log(
        'Row ' +
        index +
        ' quick filter text is ' +
        rowNode.quickFilterAggregateText
      );
    });
  }

  externalFilterChanged(filterType: string) {
    if (filterType === 'all') {
      this.matchFilterType = 'all';
    }
    if (filterType === 'unmatchedonly') {
      this.matchFilterType = 'unmatchedonly';
    }
    if (filterType === 'matchedonly') {
      this.matchFilterType = 'matchedonly';
    }

    this.agGrid.api.onFilterChanged();

  }

}

class ShowCellRenderer implements ICellRendererComp {
  ui: any;

  init(params: ICellRendererParams) {
    const cellBlank = !params.value;
    if (cellBlank) {
      return;
    }

    this.ui = document.createElement('div');
    this.ui.innerHTML =
      '<div class="show-single">' +
      params.value +
      '' +
      '</div>';
  }

  getGui() {
    return this.ui;
  }

  refresh() {
    return false;
  }
}