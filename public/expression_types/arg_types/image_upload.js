import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { withState } from 'recompose';
import { ArgType } from '../arg_type';
import { encode } from '../../../common/lib/dataurl';

const template = ({ typeInstance, onValueChange, setLoading, isLoading }) => {
  const { name } = typeInstance;

  function handleUpload(ev) {
    const [ upload ] = ev.target.files;
    setLoading(true);
    encode(upload).then((res) => {
      setLoading(false);
      onValueChange({
        [name]: [{
          type: 'string',
          value: res,
        }],
      });
    });
  }

  return (
    <FormGroup key={name} controlId="formControlsSelect">
      <ControlLabel>
        Image Upload {isLoading ? <span className="fa fa-spinner fa-pulse" /> : null}
      </ControlLabel>
      <div className="canvas__argtype--image">
        <input type="file" onChange={handleUpload} disabled={isLoading} />
      </div>
    </FormGroup>
  );
};

template.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  typeInstance: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export const imageUpload = () => new ArgType('imageUpload', {
  displayName: 'Image Upload',
  description: 'Select or upload an image',
  template: withState('isLoading', 'setLoading', false)(template),
});
