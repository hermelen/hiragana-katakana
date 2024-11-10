import React from 'react';

type RadioProps = {
    label: string;
    name: string;
    className: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    position?: "right" | "left"
};

export function Radio({ label, name, value, checked, onChange, position = "right", className = ""}: RadioProps) {
    return (
        <label className={
            `${className}
            ${position === "left" && "justify-start"}
            ${position === "right" && "justify-end"}
            flex items-center`}>
            { position === "right" && <span className="mr-2">{label}</span> }
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="mr-2"/>
            { position === "left" && <span className="mr-2">{label}</span> }
        </label>
    );
}