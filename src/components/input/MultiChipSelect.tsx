import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Box,
    Chip,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";

interface MultiChipSelectProps {
    name: string;
    value?: string[];
    label: string;
    onSelect?: (name: string, values: string[]) => void;
    options: string[];
    disabled?: boolean;
    defaultValue?: string[];
    required?: boolean;
    readOnly?: boolean;
}

const MultiChipSelect: React.FC<MultiChipSelectProps> = ({
    name,
    value,
    label,
    onSelect,
    options,
    disabled = false,
    defaultValue = [],
    required,
    readOnly = false,
}) => {
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        if (readOnly) return;

        const selectedValues =
            typeof event.target.value === "string"
                ? event.target.value.split(",")
                : (event.target.value as string[]);

        if (onSelect) {
            onSelect(name, selectedValues);
        }

        if (value === undefined) {
            setInternalValue(selectedValues);
        }
    };

    const selectedValues = value !== undefined ? value : internalValue;

    return (
        <FormControl fullWidth>
            <InputLabel id={`${name}-label`} required={required}>
                {label}
            </InputLabel>
            <Select
                labelId={`${name}-label`}
                id={name}
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput id={`select-multiple-chip-${name}`} label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((val) => (
                            <Chip key={val} label={val} />
                        ))}
                    </Box>
                )}
                disabled={disabled}
                slotProps={{ input: { readOnly } }}
                required={required}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
            <input type="hidden" name={name} value={selectedValues.join(",")} />
        </FormControl>
    );
};

export default MultiChipSelect;
