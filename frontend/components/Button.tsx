type PropType = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  name?: string;
  onClick?: () => void;
};
export default function Button({
  children,
  className,
  type,
  onClick,
  name,
}: PropType) {
  return (
    <button
      className={`btn ${className}`}
      type={type ?? "submit"}
      onClick={onClick}
      name={name}
    >
      {children}
    </button>
  );
}
