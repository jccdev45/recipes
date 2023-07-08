import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import CookingSvg from "/public/images/CookingSvg.svg";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col items-center w-full p-4 py-24 lg:flex-row gap-y-4 lg:gap-0 lg:py-12">
      <div className="w-full prose lg:w-3/5">
        <h1>Welcome to the Medina Family Recipe Collection!</h1>
        <p>
          You like flavor, don't you? <br /> Good, you're in the right place.
        </p>

        {!user && (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>

      <div className="w-5/6 rounded-full -z-10 md:w-2/3 lg:w-2/5 bg-stone-300/90 lg:-translate-x-1/4">
        <Image
          src={CookingSvg}
          alt="Cartoon style depiction of man sitting on large chef hat, with spoon and salt/pepper shakers"
          width={500}
          height={500}
          className="contain translate-x-[10%] md:translate-x-1/4"
        />
      </div>
    </section>
  );
}
