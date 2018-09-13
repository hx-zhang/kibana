import { get } from 'lodash';
import { getState, getValue } from '../../../public/lib/resolved_arg';

export const math = () => ({
  name: 'math',
  displayName: 'Measure',
  args: [
    {
      name: '_',
      displayName: 'Value',
      help: 'Function and column to use in extracting a value from the datasource',
      argType: 'datacolumn',
      options: {
        onlyMath: false,
      },
    },
  ],
  resolve({ context }) {
    if (getState(context) !== 'ready') return { columns: [] };
    return { columns: get(getValue(context), 'columns', []) };
  },
});
