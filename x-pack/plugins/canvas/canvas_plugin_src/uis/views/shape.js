import { shapes } from '../../renderers/shape/shapes';

export const shape = () => ({
  name: 'shape',
  displayName: 'Shape',
  modelArgs: [],
  requiresContext: false,
  args: [
    {
      name: '_',
      displayName: 'Select a Shape',
      argType: 'shape',
      help: 'A basic shape',
      options: {
        choices: Object.keys(shapes).map(shape => ({
          value: shape,
          name: shape,
        })),
      },
    },
    {
      name: 'fill',
      displayName: 'Fill',
      argType: 'color',
      help: 'Fill color of the shape',
    },
    {
      name: 'border',
      displayName: 'Border',
      argType: 'color',
      help: 'Border color',
    },
    {
      name: 'borderWidth',
      displayName: 'Border Width',
      argType: 'number',
      help: 'Border width',
    },
    {
      name: 'maintainAspect',
      displayName: 'Maintain Aspect Ratio',
      argType: 'toggle',
      help: `Select 'true' to maintain aspect ratio`,
    },
  ],
});
