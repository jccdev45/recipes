import FourOhFour from "/public/images/404.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative w-5/6 h-full mx-auto">
      <Image src={FourOhFour} alt="Four oh four, bro oh bro" fill />
    </div>
  );
}
