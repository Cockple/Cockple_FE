interface IntroTextProps {
  title: string;
  isBar: boolean;
  text1: string;
  text2?: string;
  className?: string;
}

export default function IntroText({
  isBar = false,
  title,
  text1,
  text2,
  className,
}: IntroTextProps) {
  return (
    <div
      className={`flex flex-col gap-2   ${isBar ? "pt-15" : "items-stretch text-left  w-full pt-30"} ${className}`}
    >
      <p className="header-h4">{title}</p>
      <div className="body-md-500">
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
}
