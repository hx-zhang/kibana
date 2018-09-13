import React from 'react';
import PropTypes from 'prop-types';
import dateMath from '@elastic/datemath';
import { EuiDatePicker } from '@elastic/eui';
import { DatetimeInput } from '../datetime_input';
import './datetime_calendar.scss';

export const DatetimeCalendar = ({ value, onSelect, startDate, endDate }) => (
  <div className="canvasDateTimeCal">
    <DatetimeInput moment={dateMath.parse(value)} setMoment={onSelect} />
    <EuiDatePicker
      inline
      showTimeSelect
      shadow={false}
      selected={dateMath.parse(value)}
      onChange={onSelect}
      shouldCloseOnSelect={false}
      startDate={startDate}
      endDate={endDate}
    />
  </div>
);

DatetimeCalendar.propTypes = {
  value: PropTypes.object,
  onSelect: PropTypes.func, // Called with a moment
  startDate: PropTypes.object, // a moment
  endDate: PropTypes.object, // a moment
};
