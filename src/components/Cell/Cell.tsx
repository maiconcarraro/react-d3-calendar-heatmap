import * as React from "react";
import useTooltip from "../Tooltip/useTooltip";
import { Tooltip } from "../Tooltip/Tooltip";
import { CountableTimeInterval, utcYear } from "d3-time";
import { BaseCalendarHeatMapItemType } from "../CalendarHeatMap/CalendarHeatMap";
import { ScaleSequential } from "d3-scale";

interface CellProps<CalendarHeatMapItemType> {
  c: CalendarHeatMapItemType;
  color: ScaleSequential<string, never>;
  cellSize: number;
  countDay: (i: number) => number;
  timeWeek: CountableTimeInterval;
  formatDate: (date: Date) => string;
  formatValue: (n: number | { valueOf(): number }) => string;
  timeRange?: { from: Date; to: Date };
}

const Cell = <CalendarHeatMapItemType extends BaseCalendarHeatMapItemType>({
  color,
  cellSize,
  c,
  countDay,
  timeWeek,
  formatDate,
  formatValue,
  timeRange,
  ...rest
}: CellProps<CalendarHeatMapItemType>): React.ReactElement => {
  const { hideTooltip, showTooltip, disableTooltip } = useTooltip();

  const handleMouseMove = React.useCallback(
    (ev: React.MouseEvent) => {
      showTooltip(
        <Tooltip
          label={`${formatDate(new Date(c.day))}`}
          value={`${formatValue(c.value)}`}
        />,
        ev
      );
    },
    [showTooltip]
  );

  const handleMouseLeave = React.useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const cellDay = new Date(c.day);
  const x =
    timeWeek.count(timeRange ? timeRange.from : utcYear(cellDay), cellDay) *
      cellSize +
    1;

  return (
    <rect
      onMouseEnter={disableTooltip ? undefined : handleMouseMove}
      onMouseLeave={disableTooltip ? undefined : handleMouseLeave}
      onMouseMove={disableTooltip ? undefined : handleMouseMove}
      rx={9999}
      width={cellSize - 2}
      height={cellSize - 2}
      x={x}
      y={countDay(new Date(c.day).getUTCDay()) * cellSize + 0.5}
      fill={color(c.value)}
      {...rest}
    />
  );
};

export default Cell;