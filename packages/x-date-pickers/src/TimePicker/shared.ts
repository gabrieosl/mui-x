import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { Clock } from '../internals/components/icons';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPicker';
import { useUtils } from '../internals/hooks/useUtils';
import { ValidationProps } from '../internals/hooks/validation/useValidation';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { ClockPickerView, MuiPickersAdapter } from '../internals/models';

export interface BaseTimePickerProps<TInputDate, TDate>
  extends ExportedClockPickerProps<TDate>,
    BasePickerProps<TInputDate | null, TDate, TDate | null>,
    ValidationProps<TimeValidationError, TInputDate | null>,
    ExportedDateInputProps<TInputDate, TDate> {
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange?: (view: ClockPickerView) => void;
  /**
   * First view to show.
   */
  openTo?: ClockPickerView;
  /**
   * Component that will replace default toolbar renderer.
   * @default TimePickerToolbar
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate>>;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select time'
   */
  toolbarTitle?: React.ReactNode;
  /**
   * Array of views to show.
   */
  views?: readonly ClockPickerView[];
}

function getTextFieldAriaText<TDate>(value: any, utils: MuiPickersAdapter<TDate>) {
  return value && utils.isValid(utils.date(value))
    ? `Choose time, selected time is ${utils.format(utils.date(value) as TDate, 'fullTime')}`
    : 'Choose time';
}

type DefaultizedProps<Props> = Props & { inputFormat: string };
export function useTimePickerDefaultizedProps<
  TInputDate,
  TDate,
  Props extends BaseTimePickerProps<TInputDate, TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> &
  Required<Pick<BaseTimePickerProps<TInputDate, TDate>, 'openTo' | 'views'>> {
  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({ props, name });

  const utils = useUtils<TDate>();
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ampm,
    openTo: 'hours',
    views: ['hours', 'minutes'],
    acceptRegex: ampm ? /[\dapAP]/gi : /\d/gi,
    mask: '__:__',
    disableMaskedInput: ampm,
    getOpenDialogAriaText: getTextFieldAriaText,
    inputFormat: ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h,
    ...themeProps,
    components: {
      OpenPickerIcon: Clock,
      ...themeProps.components,
    },
  };
}