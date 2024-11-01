import React from 'react';

type RadioProps = {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    position?: "right" | "left"
};

export function Radio({ label, name, value, checked, onChange, position = "right"}: RadioProps) {
    return (
        <label className="flex items-center">
            { position === "right" && <span className="mr-2">{label}</span> }
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="mr-2"
            />
            { position === "left" && <span className="mr-2">{label}</span> }
        </label>
    );
}