type PropType = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  name?: string;
  disabled?: boolean;
  onClick?: () => void;
};
export default function Button({
  children,
  className,
  type,
  onClick,
  name,
  disabled,
}: PropType) {
  return (
    <button
      className={`btn ${className}`}
      disabled={disabled}
      type={type ?? "button"}
      onClick={onClick}
      name={name}
    >
      {children}
    </button>
  );
}
