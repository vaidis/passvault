import React from 'react';
import { dataApi } from '../api/data';
import type { ApiResponse, DataItem } from '../api/types';
import Input from '../components/Input';

// for mandaroty fields set min > 1
// for optional fields set min = 0
const fieldsConfig = {
  title:    { label: "Title",    type: "text",     min: 1 },
  username: { label: "Username", type: "text",     min: 1 },
  password: { label: "Password", type: "password", min: 1 },
  notes:    { label: "Notes",    type: "text",     min: 0 },
} as const;

export type Data = {
  [K in keyof typeof fieldsConfig]: string;
};

type Field = keyof Data;

export default function RowAdd({ closeModal }: { closeModal: () => void }) {

  // the values must be encrypted before submit them!
  const [form, setForm] = React.useState<Data>({
    title: '',
    username: '',
    password: '',
    notes: '',
  });

  // create the field validity state,
  // by copying the keys of the form state,
  // and give a boolean value as an initial value based on the value of the min
  const [fieldValidity, setFieldValidity] = React.useState<Record<Field, boolean>>(() => {
    const initial: Partial<Record<Field, boolean>> = {};    // empty {} needs Partial
    (Object.keys(fieldsConfig) as Field[]).forEach((k) => { // get key
      initial[k] = fieldsConfig[k].min > 0 ? false : true;  // set value
    });
    return initial as Record<Field, boolean>;               // not empty, remove Partial
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = React.useCallback((name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleValidityChange = React.useCallback((name: string, isValid: boolean) => {
      setFieldValidity(prev => ({ ...prev, [name as Field]: isValid }));
  },[]);

  const hasInvalidField = React.useMemo(
    () => Object.values(fieldValidity).some(v => v === false),
    [fieldValidity]
  );

  const isDisabled = isSubmitting || hasInvalidField;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ready to submit?
    if (isDisabled) return;
    setIsSubmitting(true);
    try {
      const res: ApiResponse<DataItem> = await dataApi.create(form);
      if (!res.success) {
        // global error banner
        return;
      }
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        {Object.entries(fieldsConfig).map(([name, cfg]) => (
          <Input
            key={name}
            id={name}
            label={cfg.label}
            type={cfg.type}
            value={form[name as keyof Data]}
            onChange={handleChange}
            validateMinChars={cfg.min}
            onValidityChange={handleValidityChange}
          />
        ))}
        <button
          className={`button button--submit ${isDisabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={isDisabled}
        >
          <div className="buttonLabel">
            {isSubmitting ? 'Saving...' : 'Save'}
          </div>
        </button>
      </form>
    </div>
  );
}
