// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { PageHeader } from "../../components/common/system/header/PageHeader";
// import SearchField from "../../components/common/Search_Filed/SearchField";
// import { LocationList } from "../../components/common/contentcard/LocationList";
// import { useState } from "react";
// import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
// import { ProgressBar } from "../../components/common/ProgressBar";

// export const OnboardingAddressSearchPage = () => {
//   const [setRegister, setIsRegister] = useState(false);

//   const {
//     // data,
//     register,
//     // handleSubmit,
//     // setValue,
//     // formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();
//   return (
//     <>
//       <div className="w-full min-h-screen flex flex-col">
//         <PageHeader title="주소 검색" />
//         <ProgressBar width="52" />

//         <div className="flex flex-col flex-1">
//           <div className="mt-2 mb-6">
//             <SearchField register={register("location")} showLabel={false} />
//           </div>

//           <div className="text-left flex items-center justify-center pb-2 border-b border-gy-200">
//             <LocationList
//               isMainAddr="더에이치퍼스티어아이파크"
//               streetAddr="서울특별시"
//               onClick={() => setIsRegister(true)}
//             />
//           </div>
//           <div className="text-left flex items-center justify-center py-2 border-b border-gy-200">
//             <LocationList
//               isMainAddr="더에이치퍼스티어아이파크"
//               streetAddr="서울특별시"
//             />
//           </div>
//         </div>
//         {setRegister && (
//           <div
//             className="flex justify-center"
//             onClick={() => navigate("/onboarding/profile")}
//           >
//             <Grad_GR400_L label="이 위치로 위치 등록" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default function OnboardingAddressSearchPage() {
//   const kkk = () => {
//     console.log("제출", getValues("phone"));
//   };
//   const {
//     data,
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     getValues,
//     formState: { errors },
//   } = useForm();

//   const InputValue = watch("phone") || "";

//   return (
//     <>
//       <InputField
//         labelName="전화번호"
//         {...register("phone", {
//           maxLength: {
//             value: 2,
//             message: "최대17글자까지 가능합니다",
//           },
//         })}
//         errorMsg={errors.phone?.message as string}
//         InputLength={InputValue.length}
//       />
//       <InputField
//         labelName="name"
//         {...register("name", {
//           maxLength: {
//             value: 2,
//             message: "최대17글자까지 가능합니다",
//           },
//         })}
//         errorMsg={errors.phone?.message as string}
//         // InputLength={InputValue.length}
//       />
//       <button className="border" onClick={handleSubmit(kkk)}>
//         클릭
//       </button>
//     </>
//   );
// }
