export default function Button({
  children,
  className,
  type,
}: {
  children: React.ReactNode;
  className: string;
  type?: "button" | "submit";
}) {
  return (
    <button className={`btn ${className}`} type={type ?? "submit"}>
      {children}
    </button>
  );
}
