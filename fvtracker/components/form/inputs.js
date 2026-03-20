import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./form.module.css";

export const AppInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  wrapStyle = "",
  inputStyle = "",
  min,
  max,
}) => {
  return (
    <div className={`inputRow`}>
      {label && <label className="label">{label}</label>}
      <input
        className={`inputText`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        data-label={label}
      />
    </div>
  );
};

export const AppTextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div className={`inputRow`}>
      <label className="label">{label}</label>
      <textarea
        className={`textarea`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
      />
    </div>
  );
};

export const AppSelect = ({ options, name, label, onChange, defaultValue }) => {
  return (
    <div className={`inputRow`}>
      <label className="label">{label}</label>
      <select
        className={`inputText`}
        name={name}
        onChange={onChange}
        value={defaultValue}
      >
        <option value={""}>Odaberite</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const AppDatePicker = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className={`inputRow`}>
      <label className="label">{label}</label>
      <DatePicker
        className={`inputText`}
        selected={value}
        onChange={(date) => onChange({ target: { name, value: date } })}
        placeholderText={placeholder}
      />
    </div>
  );
};
