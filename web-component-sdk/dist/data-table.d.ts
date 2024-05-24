import { LitElement } from 'lit';
interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}
export default class DataTable extends LitElement {
    todos: Todo[];
    static styles: import("lit").CSSResult;
    connectedCallback(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'data-table': DataTable;
    }
}
export {};
//# sourceMappingURL=data-table.d.ts.map