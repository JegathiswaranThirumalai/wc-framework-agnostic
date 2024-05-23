var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { provideFluentDesignSystem, fluentDataGrid, fluentDataGridRow, fluentDataGridCell, fluentCard } from '@fluentui/web-components';
provideFluentDesignSystem()
    .register(fluentDataGrid(), fluentDataGridRow(), fluentDataGridCell(), fluentCard());
let DataTable = class DataTable extends LitElement {
    constructor() {
        super(...arguments);
        this.data = [];
    }
    async connectedCallback() {
        super.connectedCallback();
        const response = await fetch('http://localhost:3000/value');

        this.data = await response.json();
    }
    render() {
        return html `
        <fluent-card class="custom-card">
        <fluent-design-system-provider use-defaults>
            <fluent-data-grid>
                <fluent-data-grid-row role="row" row-type="header">
                    <fluent-data-grid-cell cell-type="columnheader" grid-column="1">ID</fluent-data-grid-cell>
                    <fluent-data-grid-cell cell-type="columnheader" grid-column="2">User Key</fluent-data-grid-cell>
                    <fluent-data-grid-cell cell-type="columnheader" grid-column="3">Summary</fluent-data-grid-cell>
                </fluent-data-grid-row>
                ${this.data.map(item => html`
                    <fluent-data-grid-row role="row">
                        <fluent-data-grid-cell grid-column="1">${item.ID}</fluent-data-grid-cell>
                        <fluent-data-grid-cell grid-column="2">${item.UserKey}</fluent-data-grid-cell>
                        <fluent-data-grid-cell grid-column="3">${item.Summary}</fluent-data-grid-cell>
                    </fluent-data-grid-row>
                `)}
            </fluent-data-grid>
        </fluent-design-system-provider>
    </fluent-card>
    `;
    }
};
DataTable.styles = css `
    .custom-card {
      --card-width: 800px;
      --card-height: auto;
      padding: 20px;
      margin: 50px auto;
      background-color: #f9f9f9;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    fluent-data-grid {
      width: 100%;
      border: none;
      border-collapse: collapse;
    }
    fluent-data-grid-row {
      border-bottom: 1px solid #ddd;
    }
    fluent-data-grid-cell {
      padding: 12px;
      text-align: left;
    }
    fluent-data-grid-cell[cell-type="columnheader"] {
      font-weight: bold;
      background-color: #f1f1f1;
    }
    fluent-data-grid-cell:nth-child(odd) {
      background-color: #f9f9f9;
    }
    fluent-data-grid-cell:nth-child(even) {
      background-color: #ffffff;
    }
  `;
__decorate([
    property({ type: Array })
], DataTable.prototype, "data", void 0);
DataTable = __decorate([
    customElement('data-table')
], DataTable);
export default DataTable;
//# sourceMappingURL=data-table.js.map