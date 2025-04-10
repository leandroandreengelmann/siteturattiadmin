import React, { ReactNode } from 'react';

interface BaseFormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  gridSpan?: 'full' | 'half';
}

interface InputFieldProps extends BaseFormFieldProps {
  type: 'text' | 'tel' | 'email' | 'password' | 'number' | 'color';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  pattern?: string;
}

interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  emptyOption?: string;
}

interface CheckboxFieldProps extends BaseFormFieldProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextareaFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

type FormFieldProps = 
  | InputFieldProps 
  | SelectFieldProps 
  | CheckboxFieldProps
  | TextareaFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, id, required, error, labelClassName, gridSpan = 'half' } = props;
  
  const wrapperClassName = `${gridSpan === 'full' ? 'md:col-span-2' : ''} ${error ? 'has-error' : ''}`;
  const labelClasses = `block ${labelClassName || 'text-lg text-gray-700'} mb-2`;
  const inputClasses = "w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors";
  const errorClasses = "mt-1 text-sm text-red-600";

  const renderField = (): ReactNode => {
    switch (props.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'password':
      case 'number':
        return (
          <input
            type={props.type}
            id={id}
            value={props.value}
            onChange={props.onChange}
            className={inputClasses}
            required={required}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            pattern={props.pattern}
          />
        );
      case 'color':
        return (
          <div className="flex items-center">
            <input
              type="color"
              id={id}
              value={props.value}
              onChange={props.onChange}
              className="w-12 h-10 border border-gray-300 rounded-md mr-2"
            />
            <input
              type="text"
              value={props.value}
              onChange={props.onChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#RRGGBB"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            />
          </div>
        );
      case 'select':
        return (
          <select
            id={id}
            value={props.value}
            onChange={props.onChange}
            className={`${inputClasses} appearance-none bg-white bg-no-repeat bg-right`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
            required={required}
          >
            {props.emptyOption && (
              <option value="">{props.emptyOption}</option>
            )}
            {props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer mt-2">
            <input
              type="checkbox"
              id={id}
              checked={props.checked}
              onChange={props.onChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-lg text-gray-700">{label}</span>
          </label>
        );
      case 'textarea':
        return (
          <>
            <label className={labelClasses} htmlFor={id}>
              {label}{required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={id}
              value={props.value}
              onChange={props.onChange}
              className={`${inputClasses} h-auto`}
              required={required}
              placeholder={props.placeholder}
              rows={props.rows || 4}
            />
          </>
        );
    }
  };

  return (
    <div className={wrapperClassName}>
      {props.type !== 'checkbox' && props.type !== 'textarea' && (
        <label className={labelClasses} htmlFor={id}>
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  );
} 