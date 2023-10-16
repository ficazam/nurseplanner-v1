"use client";
import { useState } from "react";
import Card from "../../../../../components/Card";
import { FieldValues, useForm, FormProvider } from "react-hook-form";
import Input from "../../../../../components/Input";
import { emailRegex, validatePassword } from "../../../../../core/validators";
import { useRouter } from "next/navigation";
import Button, { CancelButton } from "../../../../../components/Button";
import { useSignIn } from "@clerk/nextjs";

const LoginForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null | undefined>(
    undefined
  );
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const loginHandler = async (data: FieldValues) => {
    setIsLoading(true)
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status !== "complete") {
        return;
      }

      await setActive({ session: result.createdSessionId });
      router.push("/");
    } catch (err: any) {
      setAuthError('')
      console.error("error", err.errors[0].longMessage);
    }

    setIsLoading(false)
  };

  return (
    <Card>
      <FormProvider {...loginForm}>
        <form
          className="w-full h-full"
          onSubmit={loginForm.handleSubmit(loginHandler)}
        >
          <h1>Acceda a su cuenta: </h1>
          <div className="my-8">
            <div className="relative flex flex-col my-8 md:px-0">
              <Input
                name="email"
                formConfig={{
                  required: "Por favor use un email correcto.",
                  onChange: () =>
                    loginForm.formState.errors.email &&
                    loginForm.clearErrors("email"),
                  disabled: isLoading,
                }}
                label="Email: "
                placeholder="usuario@mail.com"
                type="email"
                labelClassName="text-sm font-semibold"
                autoComplete="on"
                error={
                  loginForm.getFieldState("email").isTouched &&
                  loginForm.formState.errors.email
                    ? loginForm.formState.errors.email.message
                    : ""
                }
              />
            </div>

            <div className="relative flex flex-col my-8 md:px-0">
              <Input
                name="password"
                formConfig={{
                  required: "Por favor use una contraseña correcta.",
                  validate: (password: string) =>
                    !validatePassword(password) || validatePassword(password),
                  onChange: () =>
                    loginForm.formState.errors.password &&
                    loginForm.clearErrors("password"),
                  disabled: isLoading,
                }}
                label="Contrasena: "
                placeholder="********"
                type="password"
                labelClassName="text-sm font-semibold"
                autoComplete="on"
                error={
                  loginForm.getFieldState("password").isTouched &&
                  loginForm.formState.errors.password
                    ? loginForm.formState.errors.password.message
                    : ""
                }
              />
            </div>
          </div>
          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Button
                type="submit"
                disabled={isLoading || !loginForm.formState.isValid}
                onClick={() => console.log('email: ', loginForm.watch('email'), ' - password: ', loginForm.watch('password'))}
              >
                Entrar
              </Button>
              <CancelButton
                type="button"
                onClick={() => router.push("/register")}
              >
                Registro
              </CancelButton>
            </div>
          </div>
          <div className="min-h-20 text-red-500">
            <p>{authError && authError}</p>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};

export default LoginForm;
