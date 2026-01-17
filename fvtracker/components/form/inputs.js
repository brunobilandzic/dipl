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
}) => {
  return (
    <div className={`${wrapStyle}`}>
      {label && <label className="block mb-2">{label}</label>}
      <input
        className={`${styles.textInput} ${inputStyle}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
    <div className={``}>
      <textarea
        className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
