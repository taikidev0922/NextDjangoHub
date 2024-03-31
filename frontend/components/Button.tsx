type PropType = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};
export default function Button({
  children,
  className,
  type,
  onClick,
}: PropType) {
  return (
    <button
      className={`btn ${className}`}
      type={type ?? "submit"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
