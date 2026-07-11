import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale";
import { v4 as uuid } from "uuid";

registerLocale("hr", hr);
export const AppInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
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

export const AppSelect = ({
  options,
  name,
  label,
  onChange,
  defaultValue,
  defaultOptionLabel = "Odaberite",
}) => {
  return (
    <div className={`inputRow`}>
      <label className="label">{label}</label>
      <select
        className={`inputText`}
        name={name}
        onChange={onChange}
        value={defaultValue}
      >
        <option value={""}>{defaultOptionLabel}</option>
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
        locale="hr"
        dateFormat="dd.MM.yyyy"
        selected={value}
        onChange={(date) => onChange({ target: { name, value: date } })}
        placeholderText={placeholder}
      />
    </div>
  );
};

export const SelectTable = ({ options }) => {
  return (
    <div className="flex flex-col cursor-pointer">
      {options.map((Option) => {
        <Option key={uuid()} />;
      })}
    </div>
  );
};

export const SelectTableOption = ({ onClick, choosen, children }) => {
  return (
    <div className={`${choosen ? "ring ring-green-500" : ""}`}>{children}</div>
  );
};
