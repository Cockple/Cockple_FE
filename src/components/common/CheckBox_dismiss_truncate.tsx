import React, { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import White_L_Thin_Add from "../MyPage/White_L_Thin_Add";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import { useForm, Controller } from "react-hook-form";

interface CheckBoxDismissTruncateProps {
  title: string;
}

export const CheckBox_dismiss_truncate: React.FC<CheckBoxDismissTruncateProps> = ({ title }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [recordTexts, setRecordTexts] = useState<string[]>([""]);
  const [isPrivate, setIsPrivate] = useState(false);

  const textAreaRefs = useRef<(HTMLInputElement | null)[]>([]);

  const adjustHeight = (idx: number) => {
    const textarea = textAreaRefs.current[idx];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    recordTexts.forEach((_, idx) => {
      adjustHeight(idx);
    });
  }, [recordTexts]);

  const onChangeText = (idx: number, value: string) => {
    const newTexts = [...recordTexts];
    newTexts[idx] = value;
    setRecordTexts(newTexts);
    setValue(`name_${idx}`, value, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemove = (idx: number) => {
    const updated = [...recordTexts];
    if (updated.length === 1) {
      updated[0] = "";
      setValue(`name_0`, "", { shouldValidate: true, shouldDirty: true });
    } else {
      updated.splice(idx, 1);
      setRecordTexts(updated);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <label className={`header-h5 ${isPrivate ? "text-[#9195A1]" : "text-black"}`}>
              {title}
            </label>
            <CicleSRED/>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrivate((prev) => !prev)}
              type="button"
              className="focus:outline-none"
            >
              {isPrivate ? (
                <CheckCircledFilled className="w-4 h-4" />
              ) : (
                <CheckCircled className="w-4 h-4" />
              )}
            </button>
            <label className="body-rg-500">비공개</label>
          </div>
        </div>
      </div>

      {/* 입력 리스트 */}
      {recordTexts.map((text, idx) => {
        const hasError = !!errors[`name_${idx}`];
        const showDismiss = text.trim() !== "" && !hasError;
        return (
          <div key={idx} className="relative">
            <Controller
              name={`name_${idx}`}
              control={control}
              defaultValue={text}
              rules={{ required: "필수 입력입니다" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  disabled={isPrivate}
                  style={{ paddingRight: "3rem" }}
                  className={`w-full rounded-xl border py-[0.625rem] px-3 focus:outline-none overflow-hidden whitespace-nowrap text-ellipsis
                    ${
                      hasError
                        ? "border-[#F62D2D] focus:border-[#F62D2D]"
                        : "border-gy-200 focus:border-active"
                    }
                  `}
                  ref={(el) => {
                    field.ref(el);
                    textAreaRefs.current[idx] = el;
                    if (el) adjustHeight(idx);
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    onChangeText(idx, e.target.value);
                  }}
                />
              )}
            />
            {showDismiss && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5"
              >
                <Dismiss className="w-full h-full" />
              </button>
            )}
            {hasError && (
              <p className="body-sm-500 text-[#F62D2D] text-left mt-1">
                {errors[`name_${idx}`]?.message?.toString()}
              </p>
            )}
          </div>
        );
      })}

      {/* 추가 버튼 */}
      {!isPrivate && recordTexts[recordTexts.length - 1].trim() !== "" && (
        <White_L_Thin_Add
          label="추가하기"
          onClick={() => setRecordTexts([...recordTexts, ""])}
        />
      )}
    </div>
  );
};
