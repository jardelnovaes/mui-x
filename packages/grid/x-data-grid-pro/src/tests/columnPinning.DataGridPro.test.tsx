import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGridPro,
  GridApi,
  useGridApiRef,
  DataGridProProps,
  gridClasses,
  GridPinnedPosition,
  GridColumnGroupingModel,
  GridColDef,
  GRID_CHECKBOX_SELECTION_FIELD,
} from '@mui/x-data-grid-pro';
import { useBasicDemoData, getBasicGridData } from '@mui/x-data-grid-generator';
import {
  createRenderer,
  fireEvent,
  screen,
  createEvent,
  act,
  userEvent,
} from '@mui-internal/test-utils';
import { getCell, getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';

// TODO Move to utils
// Fix https://github.com/mui/mui-x/pull/2085/files/058f56ac3c729b2142a9a28b79b5b13535cdb819#diff-db85480a519a5286d7341e9b8957844762cf04cdacd946331ebaaaff287482ec
function createDragOverEvent(target: ChildNode) {
  const dragOverEvent = createEvent.dragOver(target);
  // Safari 13 doesn't have DragEvent.
  // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
  Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });

  return dragOverEvent;
}

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Column pinning', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  function TestCase({ nbCols = 20, ...other }: Partial<DataGridProProps> & { nbCols?: number }) {
    apiRef = useGridApiRef();
    const data = useBasicDemoData(1, nbCols);
    return (
      <div style={{ width: 302, height: 300 }}>
        <DataGridPro {...data} apiRef={apiRef} {...other} />
      </div>
    );
  }

  function ResizeObserverMock(
    callback: (entries: { borderBoxSize: [{ blockSize: number }] }[]) => void,
  ) {
    let timeout: NodeJS.Timeout;

    return {
      observe: (element: HTMLElement) => {
        // Simulates the async behavior of the native ResizeObserver
        timeout = setTimeout(() => {
          callback([{ borderBoxSize: [{ blockSize: element.clientHeight }] }]);
        });
      },
      disconnect: () => {
        clearTimeout(timeout);
      },
      unobserve: () => {
        clearTimeout(timeout);
      },
    };
  }

  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    const { userAgent } = window.navigator;

    if (userAgent.includes('Chrome') && !userAgent.includes('Headless')) {
      // Only use the mock in non-headless Chrome
      window.ResizeObserver = ResizeObserverMock as any;
    }
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it('should scroll when the next cell to focus is covered by the left pinned columns', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    virtualScroller.scrollLeft = 100;
    act(() => virtualScroller.dispatchEvent(new Event('scroll')));
    const cell = getCell(0, 2);
    userEvent.mousePress(cell);
    fireEvent.keyDown(cell, { key: 'ArrowLeft' });
    expect(virtualScroller.scrollLeft).to.equal(0);
  });

  it('should scroll when the next cell to focus is covered by the right pinned columns', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase initialState={{ pinnedColumns: { right: ['price16M'] } }} />);
    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    expect(virtualScroller.scrollLeft).to.equal(0);
    const cell = getCell(0, 1);
    userEvent.mousePress(cell);
    fireEvent.keyDown(cell, { key: 'ArrowRight' });
    expect(virtualScroller.scrollLeft).to.equal(100);
  });

  it('should apply .Mui-hovered on the entire row when the mouse enters the row', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />);
    const leftColumns = document.querySelector(`.${gridClasses['pinnedColumns--left']}`);
    const rightColumns = document.querySelector(`.${gridClasses['pinnedColumns--right']}`);
    const renderZone = document.querySelector(`.${gridClasses.virtualScrollerRenderZone}`);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    const cell = getCell(0, 0);
    fireEvent.mouseEnter(cell);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
  });

  it('should remove .Mui-hovered from the entire row when the mouse leaves the row', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />);
    const cell = getCell(0, 0);
    fireEvent.mouseEnter(cell);
    const leftColumns = document.querySelector(`.${gridClasses['pinnedColumns--left']}`);
    const rightColumns = document.querySelector(`.${gridClasses['pinnedColumns--right']}`);
    const renderZone = document.querySelector(`.${gridClasses.virtualScrollerRenderZone}`);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    fireEvent.mouseLeave(cell);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
  });

  // https://github.com/mui/mui-x/issues/10176
  it('should keep .Mui-hovered on the entire row when row is selected and deselected', () => {
    render(
      <TestCase
        initialState={{
          pinnedColumns: { left: [GRID_CHECKBOX_SELECTION_FIELD], right: ['price16M'] },
        }}
        checkboxSelection
      />,
    );
    const leftColumns = document.querySelector(`.${gridClasses['pinnedColumns--left']}`);
    const rightColumns = document.querySelector(`.${gridClasses['pinnedColumns--right']}`);
    const renderZone = document.querySelector(`.${gridClasses.virtualScrollerRenderZone}`);
    const cell = getCell(0, 0);

    fireEvent.mouseEnter(cell);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');

    const checkbox = cell.querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
  });

  it('should update the render zone offset after resize', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const renderZone = document.querySelector<HTMLDivElement>(
      `.${gridClasses.virtualScrollerRenderZone}`,
    )!;
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(100px, 0px, 0px)' });
    const columnHeader = getColumnHeaderCell(0);
    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
    fireEvent.mouseUp(separator);
    clock.runToLast();
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(110px, 0px, 0px)' });
  });

  it('should update the column headers offset after resize', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const columnHeadersInner = document.querySelector<HTMLDivElement>(
      `.${gridClasses.columnHeadersInner}`,
    )!;
    expect(columnHeadersInner).toHaveInlineStyle({ transform: 'translate3d(100px, 0px, 0px)' });
    const columnHeader = getColumnHeaderCell(0);
    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
    fireEvent.mouseUp(separator);
    expect(columnHeadersInner).toHaveInlineStyle({ transform: 'translate3d(110px, 0px, 0px)' });
  });

  it('should update the render zone offset after pinning the column', function test() {
    render(<TestCase />);
    const renderZone = document.querySelector<HTMLDivElement>(
      `.${gridClasses.virtualScrollerRenderZone}`,
    )!;
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(0px, 0px, 0px)' });

    const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
    const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
    fireEvent.click(menuIconButton);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to left' }));
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(100px, 0px, 0px)' });
  });

  it('should increase the width of right pinned columns by resizing to the left', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }} />);
    const columnHeader = getColumnHeaderCell(2);
    expect(columnHeader).toHaveInlineStyle({ width: '100px' });

    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 200 });
    fireEvent.mouseMove(separator, { clientX: 190, buttons: 1 });
    fireEvent.mouseUp(separator);

    expect(columnHeader).toHaveInlineStyle({ width: '110px' });
    expect(separator).to.have.class(gridClasses['columnSeparator--sideLeft']);
  });

  it('should reduce the width of right pinned columns by resizing to the right', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }} />);
    const columnHeader = getColumnHeaderCell(2);
    expect(columnHeader).toHaveInlineStyle({ width: '100px' });

    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 200 });
    fireEvent.mouseMove(separator, { clientX: 210, buttons: 1 });
    fireEvent.mouseUp(separator);

    expect(columnHeader).toHaveInlineStyle({ width: '90px' });
    expect(separator).to.have.class(gridClasses['columnSeparator--sideLeft']);
  });

  it('should not allow to drag pinned columns', () => {
    render(
      <TestCase
        nbCols={3}
        initialState={{ pinnedColumns: { left: ['id'], right: ['price1M'] } }}
      />,
    );
    expect(getColumnHeaderCell(0).firstChild).to.have.attribute('draggable', 'false');
    expect(getColumnHeaderCell(2).firstChild).to.have.attribute('draggable', 'false');
  });

  it('should not allow to drop a column on top of a pinned column', () => {
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }} />);
    expect(
      document.querySelector('.MuiDataGrid-pinnedColumnHeaders--right')?.textContent,
    ).to.deep.equal('1M');
    const dragCol = getColumnHeaderCell(1).firstChild!;
    const targetCell = getCell(0, 2)!;
    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(
      document.querySelector('.MuiDataGrid-pinnedColumnHeaders--right')?.textContent,
    ).to.deep.equal('1M');
  });

  it('should filter out invalid columns when blocking a column from being dropped', () => {
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { left: ['foo', 'bar'] } }} />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair', '1M']);
    const dragCol = getColumnHeaderCell(0).firstChild!;
    const targetCell = getCell(0, 1)!;
    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id', '1M']);
  });

  it('should not override the first left pinned column when checkboxSelection=true', () => {
    render(
      <TestCase nbCols={2} initialState={{ pinnedColumns: { left: ['id'] } }} checkboxSelection />,
    );
    expect(getColumnHeadersTextContent()).to.deep.equal(['id', '', 'Currency Pair']);
  });

  describe('dynamic row height', () => {
    let skipTest = false;

    beforeEach(function beforeEach() {
      const { userAgent } = window.navigator;

      // Need layouting and on Chrome non-headless and Edge these tests are flacky
      skipTest = !userAgent.includes('Headless') || /edg/i.test(userAgent);
    });

    it('should work with dynamic row height', async function test() {
      if (skipTest) {
        this.skip();
      }

      function Test({ bioHeight }: { bioHeight: number }) {
        const data = React.useMemo(() => getBasicGridData(1, 2), []);

        const columns = [
          ...data.columns,
          { field: 'bio', renderCell: () => <div style={{ width: 100, height: bioHeight }} /> },
        ];

        return (
          <TestCase
            rows={data.rows}
            columns={columns}
            getRowHeight={() => 'auto'}
            initialState={{ pinnedColumns: { left: ['id'], right: ['bio'] } }}
          />
        );
      }

      render(<Test bioHeight={100} />);
      await act(() => Promise.resolve());
      clock.runToLast();
      const leftRow = document.querySelector(`.${gridClasses['pinnedColumns--left']} [role="row"]`);
      expect(leftRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '101px' });
      const centerRow = document.querySelector(
        `.${gridClasses.virtualScrollerRenderZone} [role="row"]`,
      );
      expect(centerRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '101px' });
      const rightRow = document.querySelector(
        `.${gridClasses['pinnedColumns--right']} [role="row"]`,
      );
      expect(rightRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '101px' });
    });

    it('should react to content height changes', async function test() {
      if (skipTest) {
        this.skip();
      }

      function Test({ bioHeight }: { bioHeight: number }) {
        const data = React.useMemo(() => getBasicGridData(1, 2), []);

        const columns = [
          ...data.columns,
          { field: 'bio', renderCell: () => <div style={{ width: 100, height: bioHeight }} /> },
        ];

        return (
          <TestCase
            rows={data.rows}
            columns={columns}
            getRowHeight={() => 'auto'}
            initialState={{ pinnedColumns: { left: ['id'], right: ['bio'] } }}
          />
        );
      }

      const { setProps } = render(<Test bioHeight={100} />);
      await act(() => Promise.resolve());
      clock.runToLast();
      const centerRow = document.querySelector(
        `.${gridClasses.virtualScrollerRenderZone} [role="row"]`,
      );
      expect(centerRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '101px' });

      setProps({ bioHeight: 200 });
      await act(() => Promise.resolve());
      clock.runToLast();
      expect(centerRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '201px' });

      setProps({ bioHeight: 100 });
      await act(() => Promise.resolve());
      clock.runToLast();
      // If the new height is smaller than the current one, it won't be reflected unless
      // apiRef.current.resetRowHeights() is called
      expect(centerRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '201px' });

      act(() => apiRef.current.resetRowHeights());
      await act(() => Promise.resolve());
      clock.runToLast();
      expect(centerRow).toHaveInlineStyle({ maxHeight: 'none', minHeight: '101px' });
    });
  });

  it('should add border to right pinned columns section when `showCellVerticalBorder={true}`', function test() {
    if (isJSDOM) {
      // Doesn't work with mocked window.getComputedStyle
      this.skip();
    }

    render(
      <div style={{ width: 300, height: 500 }}>
        <TestCase showCellVerticalBorder initialState={{ pinnedColumns: { right: ['id'] } }} />
      </div>,
    );

    const computedStyle = window.getComputedStyle(
      document.querySelector<HTMLElement>('.MuiDataGrid-pinnedColumns--right')!,
    );
    const borderLeftColor = computedStyle.getPropertyValue('border-left-color');
    const borderLeftWidth = computedStyle.getPropertyValue('border-left-width');
    expect(borderLeftWidth).to.equal('1px');
    // should not be transparent
    expect(borderLeftColor).to.not.equal('rgba(0, 0, 0, 0)');
  });

  describe('props: onPinnedColumnsChange', () => {
    it('should call when a column is pinned', () => {
      const handlePinnedColumnsChange = spy();
      render(<TestCase onPinnedColumnsChange={handlePinnedColumnsChange} />);
      act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair'],
        right: [],
      });
      act(() => apiRef.current.pinColumn('price17M', GridPinnedPosition.right));
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair'],
        right: ['price17M'],
      });
    });

    it('should not change the pinned columns when it is called', () => {
      const handlePinnedColumnsChange = spy();
      render(
        <TestCase
          pinnedColumns={{ left: ['currencyPair'] }}
          onPinnedColumnsChange={handlePinnedColumnsChange}
        />,
      );
      expect(
        document.querySelectorAll(`.${gridClasses['pinnedColumns--left']} [role="cell"]`),
      ).to.have.length(1);
      act(() => apiRef.current.pinColumn('price17M', GridPinnedPosition.left));
      expect(
        document.querySelectorAll(`.${gridClasses['pinnedColumns--left']} [role="cell"]`),
      ).to.have.length(1);
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair', 'price17M'],
        right: [],
      });
    });
  });

  describe('prop: pinnedColumns', () => {
    it('should pin the columns specified', () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'] }} />);
      const leftColumns = document.querySelector<HTMLDivElement>(
        `.${gridClasses['pinnedColumns--left']}`,
      )!;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
    });

    it("should not change the pinned columns if the prop didn't change", () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'] }} />);
      expect(
        document.querySelector(
          `.${gridClasses['pinnedColumns--left']} [data-field="currencyPair"]`,
        ),
      ).not.to.equal(null);
      act(() => apiRef.current.pinColumn('price17M', GridPinnedPosition.left));
      expect(
        document.querySelector(
          `.${gridClasses['pinnedColumns--left']} [data-field="currencyPair"]`,
        ),
      ).not.to.equal(null);
    });

    it('should filter our duplicated columns', () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'], right: ['currencyPair'] }} />);
      const leftColumns = document.querySelector<HTMLDivElement>(
        `.${gridClasses['pinnedColumns--left']}`,
      )!;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      expect(document.querySelector(`.${gridClasses['pinnedColumns--right']}`)).to.equal(null);
    });
  });

  describe('prop: disableColumnPinning', () => {
    it('should not add any button to the column menu', () => {
      render(<TestCase disableColumnPinning />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      expect(screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Pin to right' })).to.equal(null);
    });

    it('should throw an error when calling `apiRef.current.pinColumn`', () => {
      render(<TestCase disableColumnPinning />);
      expect(() => apiRef.current.pinColumn('id', GridPinnedPosition.left)).to.throw();
    });

    it('should throw an error when calling `apiRef.current.unpinColumn`', () => {
      render(<TestCase disableColumnPinning />);
      expect(() => apiRef.current.unpinColumn('id')).to.throw();
    });

    it('should throw an error when calling `apiRef.current.getPinnedColumns`', () => {
      render(<TestCase disableColumnPinning />);
      expect(() => apiRef.current.getPinnedColumns()).to.throw();
    });

    it('should throw an error when calling `apiRef.current.setPinnedColumns`', () => {
      render(<TestCase disableColumnPinning />);
      expect(() => apiRef.current.setPinnedColumns({})).to.throw();
    });

    it('should throw an error when calling `apiRef.current.isColumnPinned`', () => {
      render(<TestCase disableColumnPinning />);
      expect(() => apiRef.current.isColumnPinned('is')).to.throw();
    });
  });

  describe('apiRef', () => {
    it('should reorder the columns to render the left pinned columns before all other columns', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['currencyPair', 'price1M'] } }} />);
      const leftColumns = document.querySelector<HTMLDivElement>(
        `.${gridClasses['pinnedColumns--left']}`,
      )!;
      const renderZone = document.querySelector<HTMLDivElement>(
        `.${gridClasses.virtualScrollerRenderZone}`,
      )!;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      expect(leftColumns.querySelector('[data-field="price1M"]')).not.to.equal(null);
      expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);
      expect(renderZone.querySelector('[data-field="price1M"]')).to.equal(null);
    });

    it('should reorder the columns to render the right pinned columns after all other columns', () => {
      render(<TestCase initialState={{ pinnedColumns: { right: ['price16M', 'price17M'] } }} />);
      const rightColumns = document.querySelector<HTMLDivElement>(
        `.${gridClasses['pinnedColumns--right']}`,
      )!;
      const renderZone = document.querySelector<HTMLDivElement>(
        `.${gridClasses.virtualScrollerRenderZone}`,
      )!;
      expect(rightColumns.querySelector('[data-field="price16M"]')).not.to.equal(null);
      expect(rightColumns.querySelector('[data-field="price17M"]')).not.to.equal(null);
      expect(renderZone.querySelector('[data-field="price16M"]')).to.equal(null);
      expect(renderZone.querySelector('[data-field="price17M"]')).to.equal(null);
    });

    it('should not crash if a non-existent column is pinned', () => {
      expect(() => {
        render(<TestCase initialState={{ pinnedColumns: { left: ['currency'] } }} />);
        render(<TestCase initialState={{ pinnedColumns: { right: ['currency'] } }} />);
      }).not.to.throw();
    });

    describe('pinColumn', () => {
      it('should pin the given column', () => {
        render(<TestCase />);
        const renderZone = document.querySelector<HTMLDivElement>(
          `.${gridClasses.virtualScrollerRenderZone}`,
        )!;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
        const leftColumns = document.querySelector<HTMLDivElement>(
          `.${gridClasses['pinnedColumns--left']}`,
        )!;
        expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);
      });

      it('should change the side when called on a pinned column', () => {
        render(<TestCase />);
        const renderZone = document.querySelector<HTMLDivElement>(
          `.${gridClasses.virtualScrollerRenderZone}`,
        )!;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);

        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
        const leftColumns = document.querySelector<HTMLDivElement>(
          `.${gridClasses['pinnedColumns--left']}`,
        )!;
        expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);

        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.right));
        const rightColumns = document.querySelector<HTMLDivElement>(
          `.${gridClasses['pinnedColumns--right']}`,
        )!;
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).to.equal(null);
        expect(rightColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      });

      it('should not change the columns when called on a pinned column with the same side ', () => {
        render(<TestCase />);
        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
        const leftColumns = document.querySelector<HTMLDivElement>(
          `.${gridClasses['pinnedColumns--left']}`,
        )!;
        expect(leftColumns.querySelector('[data-id="0"]')?.children).to.have.length(1);
        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
        expect(leftColumns.querySelector('[data-id="0"]')?.children).to.have.length(1);
      });
    });

    describe('unpinColumn', () => {
      it('should unpin the given column', () => {
        render(<TestCase />);
        act(() => apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left));
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).not.to.equal(null);
        act(() => apiRef.current.unpinColumn('currencyPair'));
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).to.equal(null);
        const renderZone = document.querySelector<HTMLDivElement>(
          `.${gridClasses.virtualScrollerRenderZone}`,
        )!;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      });
    });

    describe('isColumnPinned', () => {
      it('should return the correct value', () => {
        render(
          <TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />,
        );
        expect(apiRef.current.isColumnPinned('id')).to.equal(GridPinnedPosition.left);
        expect(apiRef.current.isColumnPinned('price16M')).to.equal(GridPinnedPosition.right);
        expect(apiRef.current.isColumnPinned('currencyPair')).to.equal(false);
      });
    });

    // See https://github.com/mui/mui-x/issues/7819
    describe('`getCellElement` method should return cell element', () => {
      it('should return the correct value', () => {
        render(
          <TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />,
        );
        const cellElement = apiRef.current.getCellElement(0, 'currencyPair');
        expect(cellElement).not.to.equal(null);
      });
    });
  });

  describe('column menu', () => {
    it('should pin the column to the left when clicking the "Pin to left" pinning button', () => {
      render(<TestCase />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to left' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should pin the column to the right when clicking the "Pin to right" pinning button', () => {
      render(<TestCase />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to right' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to invert the side when clicking on "Pin to right" pinning button on a left pinned column', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to right' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).to.equal(null);
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to invert the side when clicking on "Pin to left" pinning button on a right pinned column', () => {
      render(<TestCase initialState={{ pinnedColumns: { right: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to left' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).to.equal(null);
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to unpin a pinned left column when clicking "Unpin" pinning button', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Unpin' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).to.equal(null);
    });

    it('should not render menu items if the column has `pinnable` equals to false', () => {
      render(
        <TestCase
          columns={[
            { field: 'brand', pinnable: true },
            { field: 'year', pinnable: false },
          ]}
          rows={[{ id: 0, brand: 'Nike', year: 1941 }]}
        />,
      );

      const brandHeader = document.querySelector('[role="columnheader"][data-field="brand"]')!;
      fireEvent.click(brandHeader.querySelector('button[aria-label="Menu"]')!);
      expect(screen.queryByRole('menuitem', { name: 'Pin to left' })).not.to.equal(null);
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

      clock.runToLast();
      // Ensure that the first menu was closed
      expect(screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);

      const yearHeader = document.querySelector('[role="columnheader"][data-field="year"]')!;
      fireEvent.click(yearHeader.querySelector('button[aria-label="Menu"]')!);
      expect(screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
    });
  });

  describe('restore column position after unpinning', () => {
    it('should restore the position when unpinning existing columns', () => {
      const { setProps } = render(<TestCase nbCols={4} checkboxSelection disableVirtualization />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['', 'id', 'Currency Pair', '1M', '2M']);
      setProps({ pinnedColumns: { left: ['currencyPair', 'id'], right: ['__check__'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id', '1M', '2M', '']);
      setProps({ pinnedColumns: { left: [], right: [] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['', 'id', 'Currency Pair', '1M', '2M']);
    });

    it('should restore the position when unpinning a column added after the first pinned column', () => {
      const { setProps } = render(<TestCase nbCols={2} disableVirtualization />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair']);
      setProps({ pinnedColumns: { left: ['currencyPair'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id']);
      act(() => apiRef.current.updateColumns([{ field: 'foo' }, { field: 'bar' }]));
      expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id', 'foo', 'bar']);
      setProps({ pinnedColumns: { left: ['currencyPair', 'foo'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'foo', 'id', 'bar']);
      setProps({ pinnedColumns: {} });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair', 'foo', 'bar']);
    });

    it('should restore the position of a column pinned before it is added', () => {
      const { setProps } = render(
        <TestCase nbCols={2} pinnedColumns={{ left: ['foo'] }} disableVirtualization />,
      );
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair']);
      act(() => apiRef.current.updateColumns([{ field: 'foo' }, { field: 'bar' }]));
      expect(getColumnHeadersTextContent()).to.deep.equal(['foo', 'id', 'Currency Pair', 'bar']);
      setProps({ pinnedColumns: {} });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair', 'foo', 'bar']);
    });

    it('should restore the position of a column unpinned after a column is removed', () => {
      const { setProps } = render(
        <TestCase
          nbCols={3}
          columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]}
          pinnedColumns={{ left: ['price1M'] }}
          disableVirtualization
        />,
      );
      expect(getColumnHeadersTextContent()).to.deep.equal(['price1M', 'id', 'currencyPair']);
      setProps({ columns: [{ field: 'id' }, { field: 'price1M' }] });
      expect(getColumnHeadersTextContent()).to.deep.equal(['price1M', 'id']);
      setProps({ pinnedColumns: {}, columns: [{ field: 'id' }, { field: 'price1M' }] });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'price1M']);
    });

    it('should restore the position when the neighboring columns are reordered', () => {
      const { setProps } = render(<TestCase nbCols={4} disableVirtualization />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair', '1M', '2M']); // price1M's index = 2
      setProps({ pinnedColumns: { left: ['price1M'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['1M', 'id', 'Currency Pair', '2M']);
      act(() => apiRef.current.setColumnIndex('id', 2));
      expect(getColumnHeadersTextContent()).to.deep.equal(['1M', 'Currency Pair', 'id', '2M']);
      setProps({ pinnedColumns: {} });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id', '1M', '2M']); // price1M's index = 2
    });

    it('should not crash when unpinning the first column', () => {
      const { setProps } = render(
        <TestCase
          nbCols={3}
          columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]}
          pinnedColumns={{ left: ['id', 'currencyPair'] }}
          disableVirtualization
        />,
      );
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'currencyPair', 'price1M']);
      setProps({ pinnedColumns: { left: ['currencyPair'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['currencyPair', 'id', 'price1M']);
    });

    it('should not crash when unpinning the last column', () => {
      const { setProps } = render(
        <TestCase
          nbCols={3}
          columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]}
          pinnedColumns={{ right: ['currencyPair', 'price1M'] }}
          disableVirtualization
        />,
      );
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'currencyPair', 'price1M']);
      setProps({ pinnedColumns: { right: ['currencyPair'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'price1M', 'currencyPair']);
    });

    it('should not crash when removing a pinned column', () => {
      const { setProps } = render(
        <TestCase
          nbCols={3}
          columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]}
          pinnedColumns={{ right: ['currencyPair'] }}
          disableVirtualization
        />,
      );
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'price1M', 'currencyPair']);
      setProps({
        pinnedColumns: { right: [] },
        columns: [{ field: 'id' }, { field: 'price1M' }],
      });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'price1M']);
    });
  });

  describe('Column grouping', () => {
    const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
      },
      {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
      },
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
      },
    ];

    const rows = [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
      { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
      { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
      { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
      { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
      { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
      { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const columnGroupingModel: GridColumnGroupingModel = [
      {
        groupId: 'Internal',
        description: '',
        children: [{ field: 'id' }],
      },
      {
        groupId: 'Basic info',
        children: [
          {
            groupId: 'Full name',
            children: [{ field: 'lastName' }, { field: 'firstName' }],
          },
          { field: 'age' },
        ],
      },
    ];

    it('should create separate column groups for pinned and non-pinned columns having same column group', () => {
      render(
        <TestCase
          columns={columns}
          rows={rows}
          columnGroupingModel={columnGroupingModel}
          experimentalFeatures={{ columnGrouping: true }}
          initialState={{ pinnedColumns: { right: ['age'] } }}
        />,
      );

      const firstNameLastNameColumnGroupHeader = document.querySelector(
        '[role="columnheader"][data-fields="|-firstName-|-lastName-|"]',
      )!;
      expect(firstNameLastNameColumnGroupHeader.textContent).to.equal('Basic info');
      const ageCellColumnGroupHeader = document.querySelector(
        '[role="columnheader"][data-fields="|-age-|"]',
      )!;
      expect(ageCellColumnGroupHeader.textContent).to.equal('Basic info');
    });
  });
});
