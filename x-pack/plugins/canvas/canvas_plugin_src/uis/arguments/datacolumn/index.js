import React, { Component } from 'react';
import { compose, withPropsOnChange, withHandlers } from 'recompose';
import PropTypes from 'prop-types';
import { EuiSelect, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import { sortBy } from 'lodash';
import { createStatefulPropHoc } from '../../../../public/components/enhance/stateful_prop';
import { getType } from '../../../../common/lib/get_type';
import { templateFromReactComponent } from '../../../../public/lib/template_from_react_component';
import { SimpleMathFunction } from './simple_math_function';
import { getFormObject } from './get_form_object';

const maybeQuoteValue = val => (val.match(/\s/) ? `'${val}'` : val);

// TODO: Garbage, we could make a much nicer math form that can handle way more.
class DatacolumnArgInput extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    onValueChange: PropTypes.func.isRequired,
    mathValue: PropTypes.object.isRequired,
    setMathFunction: PropTypes.func.isRequired,
    typeInstance: PropTypes.object.isRequired,
    renderError: PropTypes.func.isRequired,
    argId: PropTypes.string.isRequired,
  };

  inputRefs = {};

  render() {
    const {
      onValueChange,
      columns,
      mathValue,
      setMathFunction,
      renderError,
      argId,
      typeInstance,
    } = this.props;

    if (mathValue.error) {
      renderError();
      return null;
    }

    const allowedTypes = typeInstance.options.allowedTypes || false;
    const onlyShowMathFunctions = typeInstance.options.onlyMath || false;
    const valueNotSet = val => !val || val.length === 0;

    const updateFunctionValue = () => {
      // if setting size, auto-select the first column if no column is already set
      if (this.inputRefs.fn.value === 'size') {
        const col = this.inputRefs.column.value || (columns[0] && columns[0].name);
        if (col) return onValueChange(`${this.inputRefs.fn.value}(${maybeQuoteValue(col)})`);
      }

      // this.inputRefs.column is the column selection, if there is no value, do nothing
      if (valueNotSet(this.inputRefs.column.value)) {
        return setMathFunction(this.inputRefs.fn.value);
      }

      // this.inputRefs.fn is the math function to use, if it's not set, just use the value input
      if (valueNotSet(this.inputRefs.fn.value)) {
        return onValueChange(this.inputRefs.column.value);
      }

      // this.inputRefs.fn has a value, so use it as a math.js expression
      onValueChange(`${this.inputRefs.fn.value}(${maybeQuoteValue(this.inputRefs.column.value)})`);
    };

    const column = columns.map(col => col.name).find(colName => colName === mathValue.column) || '';

    const options = [{ value: '', text: 'select column', disabled: true }];

    sortBy(columns, 'name').forEach(column => {
      if (allowedTypes && !allowedTypes.includes(column.type)) return;
      options.push({ value: column.name, text: column.name });
    });

    return (
      <EuiFlexGroup gutterSize="s" id={argId}>
        <EuiFlexItem grow={false}>
          <SimpleMathFunction
            id={argId}
            value={mathValue.fn}
            inputRef={ref => (this.inputRefs.fn = ref)}
            onlymath={onlyShowMathFunctions}
            onChange={updateFunctionValue}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiSelect
            compressed
            options={options}
            defaultValue={column}
            inputRef={ref => (this.inputRefs.column = ref)}
            onChange={updateFunctionValue}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}

const EnhancedDatacolumnArgInput = compose(
  withPropsOnChange(['argValue', 'columns'], ({ argValue, columns }) => ({
    mathValue: (argValue => {
      if (getType(argValue) !== 'string') return { error: 'argValue is not a string type' };
      try {
        const matchedCol = columns.find(({ name }) => argValue === name);
        const val = matchedCol ? maybeQuoteValue(matchedCol.name) : argValue;
        return getFormObject(val);
      } catch (e) {
        return { error: e.message };
      }
    })(argValue),
  })),
  createStatefulPropHoc('mathValue', 'setMathValue'),
  withHandlers({
    setMathFunction: ({ mathValue, setMathValue }) => fn => setMathValue({ ...mathValue, fn }),
  })
)(DatacolumnArgInput);

EnhancedDatacolumnArgInput.propTypes = {
  argValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  columns: PropTypes.array.isRequired,
};

export const datacolumn = () => ({
  name: 'datacolumn',
  displayName: 'Column',
  help: 'Select the data column',
  default: '""',
  simpleTemplate: templateFromReactComponent(EnhancedDatacolumnArgInput),
});
