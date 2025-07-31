interface TextFieldProps {
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
}

export const TextField = ({
  maxLength = 45,
  value,
  onChange,
}: TextFieldProps) => {
  const getTrimmedLength = (text: string) => text.replace(/\s/g, "").length;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value;
    const trimmedLength = getTrimmedLength(nextValue);
    if (trimmedLength <= maxLength) {
      onChange(nextValue);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="header-h5 ml-1 text-left">공지 사항</span>
      <div className="relative">
        <textarea
          rows={3}
          value={value}
          onChange={handleChange}
          placeholder="내용을 입력해주세요"
          className="w-full h-26 resize-none outline-none py-2.5 px-3 border-soft border-1 border-gy-200 bg-white placeholder:text-gy-200"
        />
        <span className="absolute right-3 bottom-2.5 body-rg-500 text-gy-400 py-0.5">
          ({value.length} / {maxLength})
        </span>
      </div>
    </div>
  );
};
