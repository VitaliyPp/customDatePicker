import React from 'react';
import './DatePicker.css';
interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date) => void;
    ageRestriction?: boolean;
}
export declare const DatePicker: React.FC<DatePickerProps>;
export {};
