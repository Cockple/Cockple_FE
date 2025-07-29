import type { InputHTMLAttributes } from "react";
import type { FieldValues, UseFormRegister } from "react-hook-form";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelName?: string;
  placeholder?: string;
  errorMsg?: string | undefined;
  className?: string;
  InputLength?: number | null;
  InputMaxLength?: number | null;
  onClick?: () => void;
  register?: UseFormRegister<FieldValues>;
  disabled?: boolean;
}

export default function InputField({
  labelName = "",
  placeholder = "",
  errorMsg = "",
  className = "",
  register,
  InputLength,
  InputMaxLength = 17,
  disabled,
  ...props
}: InputFieldProps) {
  return (
    <div className="text-left flex flex-col gap-2 relative  pb-5">
      <div className="flex px-1 gap-[2px] items-center">
        {labelName && (
          <p
            className={`header-h5 ${disabled ? "text-gy-600" : "text-black"} `}
          >
            {labelName}
          </p>
        )}
        <img src="/src/assets/icons/cicle_s_red.svg" alt="icon-cicle" />
      </div>
      <div className="relative">
        <input
          type="text"
          className={`w-full rounded-xl  border py-[0.625rem] pl-3 pr-15 body-md-500 focus:outline-none  ${errorMsg ? "!border-rd-500" : "focus:border-active border-gray-200"} ${className} ${disabled ? "!border-gray-200 cursor-not-allowed" : ""}`}
          {...register}
          {...props}
          placeholder={placeholder}
          disabled={disabled}
        />
        {typeof InputLength === "number" && (
          <p className="absolute right-2 top-3 body-rg-500 text-gy-400">
            ({InputLength} / {InputMaxLength} )
          </p>
        )}
      </div>
      {errorMsg && (
        <p className="absolute bottom-0 body-sm-500 ml-2 text-rd-500">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
