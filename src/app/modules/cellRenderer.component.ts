import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';



@Component({
    selector: 'checkbox-renderer',
    templateUrl: './cellRenderer.html',
})
export class CheckboxRendererComponent implements ICellRendererAngularComp {
    params: ICellRendererParams = {} as ICellRendererParams;

    agInit(params: ICellRendererParams): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams): boolean {
        return true

    }

    checkedHandler(event: any) {
        let checked = event.target.checked;
        let colId = this.params.column?.getId();
        if (colId)
            this.params.node.setDataValue(colId, checked);
    }

    handleUnlink(event: any) {
        this.params.data.groupedWith.forEach((element: string) => {
            let selectedRow = this.params.api.getRowNode(element);
            selectedRow?.setSelected(false);
            if (selectedRow) {
                selectedRow.selectable = true;
                selectedRow.data.isGrouped = false;
                selectedRow.data.groupedWith = [];
            }
        });
        this.params.api.refreshCells({
            force: true,
        });

    }

}
