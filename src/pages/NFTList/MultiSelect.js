import { useRef, useEffect, useCallback, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import OutlinedInput from '@mui/material/OutlinedInput';

import { debounce } from './debounce';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelectCheckbox = ({
  onChange,
  selectedValues,
  options,
  label,
  ...rest
}) => {
  const inputRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(debounce(onChange, 1500), [debounce]);

  const [localSelectedValues, setLocalSelectedValues] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocalSelectedValues(
      typeof value === 'string' ? value.split(',') : value
    );
    debounceInput(event);
  };

  useEffect(() => {
    setLocalSelectedValues(selectedValues);
  }, [debounceInput, inputRef, selectedValues]);

  return (
    <Select
      {...rest}
      multiple
      value={localSelectedValues}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => selected.join(', ')}
      MenuProps={MenuProps}
      className="multiSelect"
    >
      {options.map((option) => (
        <MenuItem key={option} value={option} className="multiSelectItem">
          <Checkbox checked={localSelectedValues.indexOf(option) > -1} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelectCheckbox;
