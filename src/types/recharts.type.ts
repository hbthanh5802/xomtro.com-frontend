export type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: {
      stroke: string;
      fill: string;
      cx: string;
      cy: string;
      name: string;
      value: number;
    };
    dataKey: string;
  }[];
  label?: string;
};
