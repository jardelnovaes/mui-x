# GridPrintExportOptions Interface

<p class="description">The options to apply on the Print export.</p>

## Demos

:::info
For examples and details on the usage, check the following pages:

- [Print export](/x/react-data-grid/export/#print-export)

:::

## Import

```js
import { GridPrintExportOptions } from '@mui/x-data-grid-premium';
// or
import { GridPrintExportOptions } from '@mui/x-data-grid-pro';
// or
import { GridPrintExportOptions } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                | Type                                                                                      | Default                                                  | Description                                                                                                                                |
| :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">boolean</span>                                                    | <span class="prop-default">false</span>                  | If `true`, the hidden columns will also be exported.                                                                                       |
| <span class="prop-name optional">bodyClassName<sup><abbr title="optional">?</abbr></sup></span>     | <span class="prop-type">string</span>                                                     |                                                          | One or more classes passed to the print window.                                                                                            |
| <span class="prop-name optional">copyStyles<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">boolean</span>                                                    | <span class="prop-default">true</span>                   | If `false`, all &lt;style&gt; and &lt;link type="stylesheet" /&gt; tags from the &lt;head&gt; will not be copied<br />to the print window. |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>            | <span class="prop-type">string[]</span>                                                   |                                                          | The columns exported.<br />This should only be used if you want to restrict the columns exports.                                           |
| <span class="prop-name optional">fileName<sup><abbr title="optional">?</abbr></sup></span>          | <span class="prop-type">string</span>                                                     | <span class="prop-default">The title of the page.</span> | The value to be used as the print window title.                                                                                            |
| <span class="prop-name optional">getRowsToExport<sup><abbr title="optional">?</abbr></sup></span>   | <span class="prop-type">(params: GridPrintGetRowsToExportParams) =&gt; GridRowId[]</span> |                                                          | Function that returns the list of row ids to export in the order they should be exported.                                                  |
| <span class="prop-name optional">hideFooter<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">boolean</span>                                                    | <span class="prop-default">false</span>                  | If `true`, the footer is removed for when printing.                                                                                        |
| <span class="prop-name optional">hideToolbar<sup><abbr title="optional">?</abbr></sup></span>       | <span class="prop-type">boolean</span>                                                    | <span class="prop-default">false</span>                  | If `true`, the toolbar is removed for when printing.                                                                                       |
| <span class="prop-name optional">includeCheckboxes<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>                                                    | <span class="prop-default">false</span>                  | If `true`, the selection checkboxes will be included when printing.                                                                        |
| <span class="prop-name optional">pageStyle<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">string \| Function</span>                                         |                                                          | Provide Print specific styles to the print window.                                                                                         |
