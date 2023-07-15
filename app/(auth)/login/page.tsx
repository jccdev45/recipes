import AuthSvg from '/public/images/Login.svg';
import Image from 'next/image';

import { GradientBanner } from '@/components/GradientBanner';

import FormContainer from './FormContainer';

export default async function LoginPage() {
  return (
    <section className="">
      <GradientBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 -translate-y-[12%] md:-translate-y-1/4">
        <div className="relative w-2/3 col-span-1 m-auto rounded-lg md:-translate-x-16 md:-translate-y-16 bg-zinc-300 h-3/4 -z-10 dark:bg-zinc-900">
          <Image
            src={AuthSvg}
            alt="Cartoon depiction of person standing on laptop with lock icon, representing logging in"
            className="mx-auto md:translate-x-20 md:translate-y-20"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
          />
        </div>

        <FormContainer className="col-span-1" />
      </div>
    </section>
  );
}
