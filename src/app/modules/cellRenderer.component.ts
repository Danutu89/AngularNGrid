import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';



@Component({
    selector: 'checkbox-renderer',
    templateUrl: './cellRenderer.html',
})
export class CheckboxRendererComponent implements ICellRendererAngularComp, OnDestroy {
    params: any;

    agInit(params: any): void {
        this.params = params;
        console.log(params);

    }

    refresh(params: ICellRendererParams): boolean {
        return true

    }

    checkedHandler(event: any) {
        let checked = event.target.checked;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, checked);
    }

    ngOnDestroy(): void {
        this.params = null;

    }
}
