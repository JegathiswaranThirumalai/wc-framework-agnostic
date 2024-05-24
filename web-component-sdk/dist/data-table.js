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
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        this.data = await response.json();
    }
    render() {
        return html `
    <fluent-card class="custom-card">
      <fluent-design-system-provider use-defaults>
        <fluent-data-grid>
          <fluent-data-grid-row role="row" row-type="header">
            <fluent-data-grid-cell cell-type="columnheader" grid-column="1">ID</fluent-data-grid-cell>
            <fluent-data-grid-cell cell-type="columnheader" grid-column="2">Title</fluent-data-grid-cell>
            <fluent-data-grid-cell cell-type="columnheader" grid-column="3">Completed</fluent-data-grid-cell>
          </fluent-data-grid-row>
          ${this.data.map(todo => html `
            <fluent-data-grid-row role="row">
              <fluent-data-grid-cell grid-column="1">${todo.id}</fluent-data-grid-cell>
              <fluent-data-grid-cell grid-column="2">${todo.title}</fluent-data-grid-cell>
              <fluent-data-grid-cell grid-column="3">${todo.completed}</fluent-data-grid-cell>
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
      --card-width: 500px;
      --card-height: 400px;
      padding: 22px;
      margin: 200px auto 0px auto;
    }
    fluent-data-grid {
      width: 100%;
      border: 1px solid #ccc;
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