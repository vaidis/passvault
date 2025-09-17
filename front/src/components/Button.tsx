import React from 'react';
import './Input.scss';

export default function InputField({label}: {label:string;}) {
    return (
        <button>
            {label}
        </button>
    )
}