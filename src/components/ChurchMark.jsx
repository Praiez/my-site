export function ChurchMark({ className = "h-12 w-12", ...props }) {
  return (
    <img
      src="/logo.png"
      alt="The Redeemed Christian Church of God"
      className={"shrink-0 object-contain " + className}
      {...props}
    />
  );
}

export default ChurchMark;