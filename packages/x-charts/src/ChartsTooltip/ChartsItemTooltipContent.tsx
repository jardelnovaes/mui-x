import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { DefaultChartsItemTooltipContent } from './DefaultChartsItemTooltipContent';

export type ChartsItemContentProps<T extends ChartSeriesType = ChartSeriesType> = {
  /**
   * The data used to identify the triggered item.
   */
  itemData: ItemInteractionData<T>;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultized<T>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  sx?: SxProps<Theme>;
};

function ChartsItemTooltipContent<T extends ChartSeriesType>(props: {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ChartsItemContentProps<T>>;
  contentProps?: Partial<ChartsItemContentProps<T>>;
  sx?: SxProps<Theme>;
  classes: ChartsItemContentProps<T>['classes'];
}) {
  const { content, itemData, sx, classes, contentProps } = props;

  const series = React.useContext(SeriesContext)[itemData.type]!.series[
    itemData.seriesId
  ] as ChartSeriesDefaultized<T>;

  const Content = content ?? DefaultChartsItemTooltipContent;
  const chartTooltipContentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      itemData,
      series,
      sx,
      classes,
    },
    ownerState: {},
  });
  return <Content {...chartTooltipContentProps} />;
}

ChartsItemTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object.isRequired,
  content: PropTypes.elementType,
  contentProps: PropTypes.shape({
    classes: PropTypes.object,
    itemData: PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
    }),
    series: PropTypes.shape({
      color: PropTypes.string,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
          }),
        ),
        PropTypes.arrayOf(
          PropTypes.shape({
            color: PropTypes.string.isRequired,
            endAngle: PropTypes.number.isRequired,
            formattedValue: PropTypes.string.isRequired,
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            index: PropTypes.number.isRequired,
            label: PropTypes.string,
            padAngle: PropTypes.number.isRequired,
            startAngle: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
          }),
        ),
      ]).isRequired,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
      valueFormatter: PropTypes.func.isRequired,
    }),
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
  }),
  itemData: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsItemTooltipContent };
