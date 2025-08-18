interface LoginProps {
  title: string;
  title2?: string;
  text1: string;
  text2: string;
  img: string;
}

export default function LoginSwiping({
  title,
  title2,
  text1,
  text2,
  img,
}: LoginProps) {
  return (
    <div
      className={`flex items-center flex-col  justify-center w-full  ${title2 ? "gap-5" : "gap-10"}`}
    >
      <div className=" header-h3 pt-18">
        <p>{title} </p>
        {title2 && <p>{title2}</p>}
      </div>

      <img
        src={img}
        alt="캐릭터img"
        className="size-50  aspect-square object-cover"
      />

      <div className="header-h5 max-w-60 mb-10">
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
}
