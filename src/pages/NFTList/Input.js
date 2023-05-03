import { useRef, useEffect, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

import { debounce } from './debounce';

const Input = ({ error, label, onChange, ...rest }) => {
  const inputRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(debounce(onChange, 1000), [debounce]);

  useEffect(() => {
    inputRef.current.addEventListener('input', debounceInput);
  }, [debounceInput, inputRef]);

  return (
    <Box>
      <TextField label={label} {...rest} ref={inputRef} />
    </Box>
  );
};

export default Input;
