export const AppTextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div className={``}>
      <input
        className={`text-input`}
        type="text"
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
