import { useRef, useEffect, useCallback } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debounce } from './debounce';

const CheckboxInput = ({ error, label, onChange, ...rest }) => {
  const inputRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(debounce(onChange, 1000), [debounce]);

  useEffect(() => {
    inputRef.current.addEventListener('input', debounceInput);
  }, [debounceInput, inputRef]);

  return (
    <FormControlLabel
      control={<Checkbox onChange={onChange} />}
      {...rest}
      ref={inputRef}
      label={label}
    />
  );
};

export default CheckboxInput;
