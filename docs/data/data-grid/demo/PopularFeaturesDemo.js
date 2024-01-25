import * as React from 'react';
import {
  DataGridPremium,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@mui/material/styles';
import AggregationRowGrouping from '../aggregation/AggregationRowGrouping';
import BasicColumnPinning from '../column-pinning/BasicColumnPinning';
import ColumnSelectorGrid from '../column-visibility/ColumnSelectorGrid';
import ExcelExport from '../export/ExcelExport';
import QuickFilteringGrid from '../filtering/QuickFilteringGrid';
import BasicDetailPanels from '../master-detail/BasicDetailPanels';
import RowGroupingInitialState from '../row-grouping/RowGroupingInitialState';
import RowOrderingGrid from '../row-ordering/RowOrderingGrid';
import RowPinningWithPagination from '../row-pinning/RowPinningWithPagination';
import RestoreStateInitialState from '../state/RestoreStateInitialState';
import TreeDataFullExample from '../tree-data/TreeDataFullExample';
import ColumnVirtualizationGrid from '../virtualization/ColumnVirtualizationGrid';
import FullFeaturedDemo from './FullFeaturedDemo';
import LazyLoadingGrid from '../row-updates/LazyLoadingGrid';
import BasicGroupingDemo from '../column-groups/BasicGroupingDemo';
import EditingWithDatePickers from '../custom-columns/EditingWithDatePickers';
import CellSelectionGrid from '../cell-selection/CellSelectionRangeStyling';
import AddNewColumnMenuGrid from '../column-menu/AddNewColumnMenuGrid';
import HeaderFilteringDataGridPro from '../filtering/HeaderFilteringDataGridPro';
import ClipboardPaste from '../clipboard/ClipboardPaste';

export const featuresSet = [
  {
    id: 1,
    name: 'Master detail',
    description: 'A parent row with a collapsible child panel',
    plan: 'Pro',
    detailPage: '/master-detail/',
    demo: <BasicDetailPanels />,
    linkToCode: '/master-detail/#system-BasicDetailPanels.tsx',
  },
  {
    id: 2,
    name: 'Inline editing',
    description:
      'Edit your data inside the cells by double-clicking or pressing Enter',
    plan: 'Community',
    detailPage: '/editing/',
    demo: <EditingWithDatePickers />,
    linkToCode: '/recipes-editing/#system-EditingWithDatePickers.tsx',
  },
  {
    id: 3,
    name: 'Column groups',
    description: 'Group columns in a multi-level hierarchy',
    plan: 'Community',
    detailPage: '/column-groups/',
    newBadge: true,
    demo: <BasicGroupingDemo />,
    linkToCode: '/column-groups/#system-BasicGroupingDemo.tsx',
  },
  {
    id: 4,
    name: 'Lazy loading',
    description: 'Easily paginate your rows and only fetch what you need',
    plan: 'Pro',
    detailPage: '/pagination/',
    demo: <LazyLoadingGrid />,
    linkToCode: '/row-updates/#system-LazyLoadingGrid.tsx',
  },
  {
    id: 5,
    name: 'Save and restore state',
    description:
      'Save and restore internal state and configurations like active filters and sorting',
    plan: 'Community',
    detailPage: '/state/#save-and-restore-the-state',
    demo: <RestoreStateInitialState />,
    linkToCode: '/state/#system-RestoreStateInitialState.tsx',
  },
  {
    id: 6,
    name: 'Row grouping',
    description: 'Group rows with repeating column values',
    plan: 'Premium',
    detailPage: '/row-grouping/',
    demo: <RowGroupingInitialState />,
    linkToCode: '/row-grouping/#system-RowGroupingInitialState.tsx',
  },
  {
    id: 7,
    name: 'Excel export',
    description:
      'Easily export the rows in various file formats such as CSV, PDF or Excel',
    plan: 'Premium',
    detailPage: '/export/#excel-export',
    demo: <ExcelExport />,
    linkToCode: '/export/#system-ExcelExport.tsx',
  },
  {
    id: 8,
    name: 'Quick filter',
    description: 'Use a single text input to filter multiple fields',
    plan: 'Community',
    detailPage: '/filtering/quick-filter/',
    demo: <QuickFilteringGrid />,
    linkToCode: '/filtering/quick-filter/#system-QuickFilteringGrid.tsx',
  },
  {
    id: 9,
    name: 'Row reorder',
    description: 'Drag and drop to reorder your data',
    plan: 'Pro',
    detailPage: '/row-ordering/',
    demo: <RowOrderingGrid />,
    linkToCode: '/row-ordering/#system-RowOrderingGrid.tsx',
  },
  {
    id: 10,
    name: 'Column Pinning',
    description: 'Pin your columns to the left or right',
    plan: 'Pro',
    detailPage: '/column-pinning/',
    demo: <BasicColumnPinning />,
    linkToCode: '/column-pinning/#system-BasicColumnPinning.tsx',
  },
  {
    id: 11,
    name: 'Row pinning',
    description: 'Pin your rows up or down',
    plan: 'Pro',
    detailPage: '/row-pinning/',
    demo: <RowPinningWithPagination />,
    linkToCode: '/row-pinning/#system-RowPinningWithPagination.tsx',
  },
  {
    id: 12,
    name: 'Aggregation and Summary rows',
    description: 'Set summary footer rows or inline summaries with row grouping',
    plan: 'Premium',
    detailPage: '/aggregation/',
    demo: <AggregationRowGrouping />,
    linkToCode: '/aggregation/#system-AggregationRowGrouping.tsx',
  },
  {
    id: 13,
    name: 'Column visibility',
    description:
      'Display different columns in different use cases by defining which columns are visible',
    plan: 'Community',
    detailPage: '/column-visibility/',
    demo: <ColumnSelectorGrid />,
    linkToCode: '/column-visibility/#system-ColumnSelectorGrid.tsx',
  },
  {
    id: 14,
    name: 'Column virtualization',
    description: 'High performance support for thousands of columns',
    plan: 'Community',
    detailPage: '/virtualization/#column-virtualization',
    demo: <ColumnVirtualizationGrid />,
    linkToCode: '/virtualization/#system-ColumnVirtualizationGrid.tsx',
  },
  {
    id: 15,
    name: 'Row virtualization',
    description: 'High performance support for vast volume of data',
    plan: 'Pro',
    detailPage: '/virtualization/#row-virtualization',
    demo: <FullFeaturedDemo />,
  },
  {
    id: 16,
    name: 'Tree data',
    description: 'Support rows with parent / child relationship',
    plan: 'Pro',
    detailPage: '/tree-data/',
    demo: <TreeDataFullExample />,
    linkToCode: '/tree-data/#system-TreeDataFullExample.tsx',
  },
  {
    id: 17,
    name: 'Cell selection',
    description:
      'Allow users to select individual and multiple cells with mouse dragging and/or keyboard (using shift key)',
    plan: 'Premium',
    detailPage: '/cell-selection/',
    demo: <CellSelectionGrid />,
    linkToCode: '/cell-selection/#system-CellSelectionGrid.tsx',
    newBadge: true,
  },
  {
    id: 18,
    name: 'Column menu',
    description: 'More customization and improved design on v6',
    plan: 'Community',
    detailPage: '/column-menu/',
    demo: <AddNewColumnMenuGrid />,
    linkToCode: '/column-menu/#system-AddNewColumnMenuGrid.tsx',
    newBadge: true,
  },
  {
    id: 19,
    name: 'Clipboard paste',
    description:
      'Copy and paste the selected cells and rows using the copy/paste keyboard shortcuts.',
    plan: 'Premium',
    detailPage: '/clipboard/#clipboard-paste',
    demo: <ClipboardPaste />,
    linkToCode: '/clipboard/#system-ClipboardPaste.tsx',
    newBadge: true,
  },
  {
    id: 20,
    name: 'Header filters',
    description:
      'Quickly accessible and customizable header filters to filter the data',
    plan: 'Pro',
    detailPage: '/filtering/#header-filters',
    demo: <HeaderFilteringDataGridPro />,
    linkToCode: '/filtering/header-filters/#system-HeaderFilteringDataGridPro.tsx',
    newBadge: true,
  },
];

function getChipProperties(plan) {
  switch (plan) {
    case 'Premium':
      return { avatarLink: '/static/x/premium.svg', color: '#ffecc8' };
    case 'Pro':
      return { avatarLink: '/static/x/pro.svg', color: '#c8e9ff' };
    default:
      return { avatarLink: undefined, color: '#c8ffdb' };
  }
}

function PlanTag(props) {
  const chipPropperties = getChipProperties(props.plan);
  const avatar = !chipPropperties.avatarLink ? undefined : (
    <img src={chipPropperties.avatarLink} width={21} height={24} alt="" />
  );

  return (
    <Chip
      avatar={avatar}
      sx={{
        backgroundColor: chipPropperties.color,
        color: 'rgba(0, 0, 0, 0.87)',
        '& .MuiChip-avatar': {
          width: 21,
        },
      }}
      label={props.plan}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

function RowDemo(props) {
  const { row } = props;
  const theme = useTheme();
  const gridBgColor = theme.palette.mode === 'dark' ? '#000' : '#fff';
  const panelColor = theme.palette.mode === 'dark' ? 'transparent' : '#efefef';

  return (
    <Box sx={{ py: 2, backgroundColor: panelColor }}>
      <div style={{ width: '90%', margin: 'auto' }}>
        <Box sx={{ backgroundColor: gridBgColor }}>{row.demo}</Box>
        {row.linkToCode ? (
          <Typography sx={{ marginTop: 1 }} variant="body2">
            <Link href={`/x/react-data-grid${row.linkToCode}`} target="_blank">
              Open demo source
            </Link>
          </Typography>
        ) : null}
      </div>
    </Box>
  );
}

function CustomSizeAggregationFooter(props) {
  return (
    <Typography sx={{ fontWeight: 500, fontSize: '1em' }} color="primary">
      Total: {props.value}
    </Typography>
  );
}

const columns = [
  {
    field: 'name',
    headerName: 'Feature name',
    maxWidth: 172,
    flex: 0.2,
    minWidth: 100,
    groupable: false,
    renderCell: (params) => {
      if (params.aggregation) {
        return <CustomSizeAggregationFooter value={params.formattedValue} />;
      }
      if (!params.value) {
        return '';
      }
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <Link
              href={`/x/react-data-grid${params.row.detailPage}`}
              target="_blank"
            >
              {params.value}
            </Link>
          </Typography>
          {params.row.newBadge && (
            <Box
              sx={{
                width: 'fit-content',
                height: 'fit-content',
                fontSize: '0.8em',
                fontWeight: 600,
                position: 'absolute',
                textAlign: 'center',
                top: -13,
                left: -20,
                background: '#fcf0a0',
                color: '#af5b00',
                px: 1,
                borderRadius: 10,
              }}
            >
              New
            </Box>
          )}
        </Box>
      );
    },
  },
  {
    field: 'description',
    headerName: 'Brief description',
    groupable: false,
    flex: 0.5,
    minWidth: 120,
  },
  {
    field: 'plan',
    headerName: 'Plan',
    maxWidth: 130,
    flex: 0.3,
    type: 'singleSelect',
    valueOptions: ['Premium', 'Pro', 'Community'],
    renderCell: (params) => {
      if (params.aggregation) {
        return <CustomSizeAggregationFooter value={params.formattedValue} />;
      }
      if (!params.value) {
        return '';
      }
      return <PlanTag plan={params.value} />;
    },
    sortComparator: (p1, p2) => {
      function getSortingValue(plan) {
        switch (plan) {
          case 'Pro':
            return 1;
          case 'Premium':
            return 2;
          default:
            return 0;
        }
      }
      const p1Value = getSortingValue(p1);
      const p2Value = getSortingValue(p2);
      return p1Value - p2Value;
    },
  },
];

export default function PopularFeaturesDemo() {
  const apiRef = useGridApiRef();

  const getDetailPanelContent = React.useCallback((params) => {
    return <RowDemo row={params.row} />;
  }, []);

  const getRowHeight = React.useCallback(() => 'auto', []);
  const getDetailPanelHeight = React.useCallback(() => 'auto', []);

  const onRowClick = React.useCallback(
    (params) => {
      const rowNode = apiRef.current.getRowNode(params.id);
      if (rowNode && rowNode.type === 'group') {
        apiRef.current.setRowChildrenExpansion(params.id, !rowNode.childrenExpanded);
      } else {
        apiRef.current.toggleDetailPanel(params.id);
      }
    },
    [apiRef],
  );

  const memoizedGroupingDef = React.useMemo(() => {
    return {
      headerName: 'Grouped by Plan',
      width: 200,
    };
  }, []);

  return (
    <Box sx={{ minHeight: 1000, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        autoHeight
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        slots={{
          toolbar: CustomToolbar,
          detailPanelExpandIcon: ArrowDown,
          detailPanelCollapseIcon: ArrowUp,
        }}
        slotProps={{
          toolbar: { showQuickFilter: true },
        }}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        getRowHeight={getRowHeight}
        initialState={{
          sorting: {
            sortModel: [{ field: 'plan', sort: 'asc' }],
          },
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 2,
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            fontWeight: 400,
          },
          [`& .${gridClasses.detailPanel}`]: {
            background: 'transparent',
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: 'none',
            },
          border: 0,
        }}
        rows={featuresSet}
        columns={columns}
        hideFooter
        groupingColDef={memoizedGroupingDef}
      />
    </Box>
  );
}
