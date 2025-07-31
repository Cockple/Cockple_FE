export default function SplashScreen() {
  return (
    <div
      className=" w-full flex items-center justify-center bg-white animate-fade-out -mb-8"
      style={{ height: "100dvh" }}
    >
      <img
        src="/src/assets/images/Logo_Typo.png"
        className="px-6"
        alt="splash screen"
      ></img>
    </div>
  );
}
