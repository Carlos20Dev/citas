import React from "react";
import Select from "react-select";

const SelectField = ({ options, onChange, placeholder, value, isDisabled = false }) => {
    return(
        <Select
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            isDisabled={isDisabled}
            className="w-full"
        />
    )
}

export default SelectField