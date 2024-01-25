# Data Grid - Column visibility

<p class="description">Define which columns are visible.</p>

By default, all the columns are visible.
The column's visibility can be switched through the user interface in two ways:

- By opening the column menu and clicking the _Hide_ menu item.
- By clicking the _Columns_ menu and toggling the columns to show or hide.

You can prevent the user from hiding a column through the user interface by setting the `hideable` in `GridColDef` to `false`.

In the following demo, the "username" column cannot be hidden.

{{"demo": "VisibleColumnsBasicExample.js", "bg": "inline"}}

## Initialize the visible columns

To initialize the visible columns without controlling them, provide the model to the `initialState` prop.

:::info

Passing the visible columns to the `initialState` prop will only have an impact when the data grid is rendered for the first time. In order to update the visible columns after the first render, you need to use the [`columnVisibilityModel`](#controlled-visible-columns) prop.

:::

```tsx
<DataGrid
  initialState={{
    columns: {
      columnVisibilityModel: {
        // Hide columns status and traderName, the other columns will remain visible
        status: false,
        traderName: false,
      },
    },
  }}
/>
```

{{"demo": "VisibleColumnsModelInitialState.js", "bg": "inline", "defaultCodeOpen": false }}

## Controlled visible columns

Use the `columnVisibilityModel` prop to control the visible columns.
You can use the `onColumnVisibilityModelChange` prop to listen to the changes to the visible columns and update the prop accordingly.

```tsx
<DataGrid
  columnVisibilityModel={{
    // Hide columns status and traderName, the other columns will remain visible
    status: false,
    traderName: false,
  }}
/>
```

{{"demo": "VisibleColumnsModelControlled.js", "bg": "inline"}}

## Column visibility panel

The column visibility panel can be opened through the Data Grid toolbar.
To enable it, you need to add `toolbar: GridToolbar` to the Data Grid `slots` prop.

The user can then choose which columns are visible using the _Columns_ button.

{{"demo": "ColumnSelectorGrid.js", "bg": "inline"}}

### Disable the column visibility panel

Sometimes, the intention is to disable the columns panel or control the visible columns programmatically based on the application state.
To disable the column visibility panel, set the prop `disableColumnSelector={true}` and use the [`columnVisibilityModel`](#controlled-visible-columns) prop to control the visible columns.

```tsx
<DataGrid disableColumnSelector columnVisibilityModel={columnVisibilityModel} />
```

In the following demo, the columns panel is disabled, and access to columns `id`, `quantity`, and `filledQuantity` is only allowed for the `Admin` type user.

{{"demo": "ColumnSelectorDisabledGrid.js", "bg": "inline"}}

### Customize the list of columns in panel

To show or hide specific columns in the column visibility panel, use the `slotProps.columnsPanel.getTogglableColumns` prop. It should return an array of column field names.

```tsx
// stop `id`, `__row_group_by_columns_group__`, and `status` columns to be togglable
const hiddenFields = ['id', '__row_group_by_columns_group__', 'status'];

const getTogglableColumns = (columns: GridColDef[]) => {
  return columns
    .filter((column) => !hiddenFields.includes(column.field))
    .map((column) => column.field);
};

<DataGrid
  slots={{
    toolbar: GridToolbar,
  }}
  slotProps={{
    columnsPanel: {
      getTogglableColumns,
    },
  }}
/>;
```

{{"demo": "ColumnSelectorGridCustomizeColumns.js", "bg": "inline"}}

### Disable action buttons

To disable `Hide all` or `Show all` buttons in the column visibility panel, pass `disableHideAllButton` or `disableShowAllButton` to `slotProps.columnsPanel`.

```tsx
<DataGrid
  slots={{
    toolbar: GridToolbar,
  }}
  slotProps={{
    columnsPanel: {
      disableHideAllButton: true,
      disableShowAllButton: true,
    },
  }}
/>
```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
