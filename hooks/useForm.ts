import {
  // AuthSchema,
  LoginFormValues,
  LoginSchema,
  RegisterFormValues,
  RegisterSchema,
} from "@/lib/zod/schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useAuthForm<T extends z.ZodType<any, any>>(
  schema: T,
  defaultValues: z.infer<T>
) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
}

// export function useLoginForm() {
//   return useForm<LoginFormValues>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
// }

// export function useRegisterForm() {
//   return useForm<RegisterFormValues>({
//     resolver: zodResolver(RegisterSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       first_name: "",
//       last_name: "",
//       avatar_url: "",
//     },
//   });
// }
