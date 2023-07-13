import FormContainer from "./FormContainer";

export default async function LoginPage() {
  return (
    <div className="flex flex-col justify-center flex-1 w-full gap-2 px-8 py-16 mx-auto border sm:max-w-md border-border">
      <FormContainer />
    </div>
  );
}
