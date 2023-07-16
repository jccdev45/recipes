import AccountInfoSvg from '/public/images/AccountInfo.svg';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { RegisterForm } from '@/app/(auth)/login/RegisterForm';
import { GradientBanner } from '@/components/GradientBanner';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function EditProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <GradientBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 -translate-y-[12%] md:-translate-y-1/4 gap-y-4 md:gap-0">
        <div className="w-5/6 h-full col-span-1 py-2 m-auto rounded-lg md:-translate-x-16 md:-translate-y-16 bg-neutral-300 -z-10 dark:bg-zinc-950">
          <Image
            src={AccountInfoSvg}
            width={250}
            height={250}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
            alt="Cartoon depiction of person editing their profile information"
            className="object-contain mx-auto md:translate-x-20 md:translate-y-20"
          />
        </div>

        <RegisterForm
          type="edit-profile"
          user={user}
          className="flex flex-col justify-center flex-1 w-5/6 max-w-lg col-span-1 gap-2 p-4 mx-auto"
        />
      </div>
    </section>
  );
}
