import Image from "next/image";
import logo from "../images/roadside-logo.png";
// import logo from "../images/logo_momentum.png";

export default function Header() {
  return (
    <div id="navigation" className="w-full h-24 bg-slate-200 sticky top-0 flex justify-center items-center z-50">
      <Image className="h-20 w-24" src={logo} alt="logo" />
    </div>
  );
}