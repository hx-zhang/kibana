import React from 'react';
import PropTypes from 'prop-types';
import { EuiFieldNumber, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiSelect } from '@elastic/eui';

const opacities = [
  { value: 1, text: '100%' },
  { value: 0.9, text: '90%' },
  { value: 0.7, text: '70%' },
  { value: 0.5, text: '50%' },
  { value: 0.3, text: '30%' },
  { value: 0.1, text: '10%' },
];

const overflows = [{ value: 'hidden', text: 'Hidden' }, { value: 'visible', text: 'Visible' }];

export const AppearanceForm = ({ padding, opacity, overflow, onChange }) => {
  const paddingVal = padding ? padding.replace('px', '') : '';

  const namedChange = name => ev => {
    if (name === 'padding') return onChange(name, `${ev.target.value}px`);

    onChange(name, ev.target.value);
  };

  return (
    <EuiFlexGroup gutterSize="s" justify-content="spaceBetween">
      <EuiFlexItem grow={2}>
        <EuiFormRow label="Padding" compressed>
          <EuiFieldNumber value={Number(paddingVal)} onChange={namedChange('padding')} />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={3}>
        <EuiFormRow label="Opacity" compressed>
          <EuiSelect defaultValue={opacity} options={opacities} onChange={namedChange('opacity')} />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={3}>
        <EuiFormRow label="Overflow" compressed>
          <EuiSelect
            defaultValue={overflow}
            options={overflows}
            onChange={namedChange('overflow')}
          />
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

AppearanceForm.propTypes = {
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overflow: PropTypes.oneOf(['hidden', 'visible']),
  onChange: PropTypes.func.isRequired,
};
