import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { makeLogin } from "@/services/auth/requests";
import { useState } from "react";
import { saveSessionData } from "@/services/auth/auth";
export default function Home() {
  const router = useRouter();

  interface LoginData {
    username: string;
    password: string;
  }

  const [values, setValues] = useState<LoginData>({username: 'omariosouto', password:'safepassword' })
  const loginFormSchema = zod
    .object({
      usuario: zod.string(),
      password: zod.string(),
      passwordConfirm: zod.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Senhas não conferem",
    });

  type LoginFormData = zod.infer<typeof loginFormSchema>;

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = loginForm;

  function handleLoginForm({ usuario, password }: LoginFormData) {
    const data: LoginData = { username: usuario, password: password };

    makeLogin(data)
      .then((res) => {
        const access_token = res.data.data.access_token
        saveSessionData({access_token: access_token});
        router.push("/auth-page-ssr");
      })
      .catch(() => {
        alert("Usuário ou senha inváldos");
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(handleLoginForm)}>
        <div>
          <input placeholder="Usuário" type="text" {...register("usuario")} />
          {errors.usuario && <p>{errors.usuario.message}</p>}
        </div>
        <div>
          <input
            placeholder="Senha"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <input
            placeholder="Confirmar Senha"
            type="password"
            {...register("passwordConfirm")}
          />
          {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
        </div>
        <pre>
          {JSON.stringify(values, null, 2)}
        </pre>
        <div>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}
