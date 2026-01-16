export const AppInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div className={``}>
      <input
        className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export const AppTextarea = ({
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
