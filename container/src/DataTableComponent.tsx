import React from 'react';
import { createComponent } from '@lit/react';
import DataTable  from 'wz-sdk/dist/data-table';

export const DataTableComponent = createComponent({
  tagName: 'data-table',
  elementClass: DataTable,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default DataTableComponent;
