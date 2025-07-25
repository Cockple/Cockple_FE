// /mypage/mymedal에 보이는 내 메달 현황 갯수를 나타내는 컴포넌트입니다.

interface MyPageProps {
  myMedalTotal?: number; 
  goldCount?: number; 
  silverCount?: number; 
  bronzeCount?: number; 
  disabled?: boolean; 
}

export const MyPage_Medal2 = ({
  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  disabled = false,
}: MyPageProps) => {

  
  return (
    <div className="flex flex-col gap-[1rem]"> 

      {/* 내 메달 섹션 */}
      <div className="w-[21.4375rem] h-[13.5rem] px-[1rem] py-[0.75rem] rounded-[1rem] flex flex-col justify-between gap-[1rem]"> 

        <div className="w-[13.5rem] h-[1.75rem] shadow-ds200-gr rounded-[0.5rem] mx-auto flex items-center justify-center"> 
          <p className="body-rg-500 text-center">
            지금까지 {myMedalTotal}개의 메달을 모았어요
          </p> 
        </div>

        <div className="flex flex-row justify-center gap-[1.25rem]"> 
          {/* 금메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]"> 
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" /> 

            <div className="flex flex-col items-center justify-center gap-[0.25rem]"> 
              <p className="body-rg-500 text-center">금메달</p>
              <p className="header-h3 text-[#1ABB65] text-center">{goldCount}</p>
            </div>
          </div>

          {/* 은메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />

            <div className="flex flex-col items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">은메달</p>
              <p className="header-h3 text-[#1ABB65] text-center">{silverCount}</p> 
            </div>
          </div>

          {/* 동메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />

            <div className="flex flex-col items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">동메달</p>
              <p className="header-h3 text-[#1ABB65] text-center">{bronzeCount}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};