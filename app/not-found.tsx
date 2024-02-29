import Image from "next/image"

import FourOhFour from "/public/images/404.svg"

export default function NotFound() {
  return (
    <div className="relative mx-auto h-full w-5/6">
      <Image src={FourOhFour} alt="Four oh four, bro oh bro" fill />
    </div>
  )
}
