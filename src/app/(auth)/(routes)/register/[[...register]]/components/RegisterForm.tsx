"use client";
import { useState } from "react";
import { FieldValues, useForm, FormProvider } from "react-hook-form";
import Card from "../../../../../components/Card";
import Input from "../../../../../components/Input";
import SelectInput from "../../../../../components/SelectInput";
import Button, { CancelButton } from "../../../../../components/Button";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface IRegisterFormProps {
  surgeons: string[];
}

const RegisterForm = (props: IRegisterFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const registerForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      userType: "",
      surgeon: "",
      code: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const registerHandler = async (data: FieldValues) => {
    setIsLoading(true);

    if (!isLoaded) return;

    try {
      await fetch("/api/new-user", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
    }
    setIsLoading(false);
  };

  const verificationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);
    if (!isLoaded) return;

    try {
      console.log(code);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        return;
      }

      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/");
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
    }

    setIsLoading(false);
  };

  return (
    <Card>
      {pendingVerification ? (
        <form
          onSubmit={verificationHandler}
          className="flex flex-col justify-center items-center w-full h-full"
        >
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
            value={code}
            className="text-black mb-2"
            placeholder="Código de Verificación"
          />
          <Button type="submit">Verificar</Button>
        </form>
      ) : (
        <FormProvider {...registerForm}>
          <form
            className="w-full h-full"
            onSubmit={registerForm.handleSubmit(registerHandler)}
          >
            <h1>Acceda a su cuenta: </h1>
            <div className="my-8">
              <div className="relative flex flex-col my-8 md:px-0">
                <Input
                  name="email"
                  formConfig={{
                    required: "Por favor use un email correcto.",
                    onChange: () =>
                      registerForm.formState.errors.email &&
                      registerForm.clearErrors("email"),
                    disabled: isLoading,
                  }}
                  label="Email: "
                  placeholder="usuario@mail.com"
                  type="email"
                  labelClassName="text-sm font-semibold"
                  autoComplete="on"
                  error={
                    registerForm.getFieldState("email").isTouched &&
                    registerForm.formState.errors.email
                      ? registerForm.formState.errors.email.message
                      : ""
                  }
                />
              </div>

              <div className="relative flex flex-col my-8 md:px-0">
                <Input
                  name="password"
                  formConfig={{
                    required: "Por favor use una contrasena correcta.",
                    onChange: () =>
                      registerForm.formState.errors.password &&
                      registerForm.clearErrors("password"),
                    disabled: isLoading,
                  }}
                  label="Contrasena: "
                  placeholder="********"
                  type="password"
                  labelClassName="text-sm font-semibold"
                  autoComplete="on"
                  error={
                    registerForm.getFieldState("password").isTouched &&
                    registerForm.formState.errors.password
                      ? registerForm.formState.errors.password.message
                      : ""
                  }
                />
              </div>
            </div>

            <div className="my-8">
              <div className="relative flex flex-col my-8 md:px-0">
                <Input
                  name="username"
                  formConfig={{
                    required: "Por favor agregue su nombre de usuario.",
                    onChange: () =>
                      registerForm.formState.errors.username &&
                      registerForm.clearErrors("username"),
                    disabled: isLoading,
                  }}
                  label="Nombre de usuario: "
                  placeholder="Mi Nombre"
                  type="text"
                  labelClassName="text-sm font-semibold"
                  autoComplete="on"
                  error={
                    registerForm.getFieldState("username").isTouched &&
                    registerForm.formState.errors.username
                      ? registerForm.formState.errors.username.message
                      : ""
                  }
                />
              </div>

              <div className="relative flex flex-col my-8 md:px-0">
                <SelectInput
                  name="userType"
                  formConfig={{
                    required: "Por favor seleccione un tipo de usuario.",
                    onChange: () =>
                      registerForm.formState.errors.userType &&
                      registerForm.clearErrors("userType"),
                    disabled: isLoading,
                  }}
                  label="Tipo de usuario: "
                  placeholder="Asigne su tipo de usuario"
                  labelClassName="text-sm font-semibold"
                  options={["Asistente", "Cirujano", "Enfermero"]}
                  error={
                    registerForm.getFieldState("userType").isTouched &&
                    registerForm.formState.errors.userType
                      ? registerForm.formState.errors.userType.message
                      : ""
                  }
                />
              </div>

              {registerForm.watch("userType") === "Asistente" && (
                <div className="relative flex flex-col my-8 md:px-0">
                  <SelectInput
                    name="surgeon"
                    formConfig={{
                      required: "Por favor agregue un cirujano.",
                      onChange: () =>
                        registerForm.formState.errors.surgeon &&
                        registerForm.clearErrors("surgeon"),
                      disabled: isLoading,
                    }}
                    defaultValue=""
                    label="Cirujano: "
                    labelClassName="text-sm font-semibold mb-2"
                    options={props.surgeons}
                    placeholder="Asigne un cirujano: "
                    error={
                      registerForm.getFieldState("surgeon").isTouched &&
                      registerForm.formState.errors.surgeon
                        ? registerForm.formState.errors.surgeon.message
                        : ""
                    }
                  />
                </div>
              )}
            </div>
            <div className="relative flex flex-col my-8 md:px-0">
              <div className="flex w-full gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !registerForm.formState.isValid}
                >
                  Registrarse
                </Button>
                <CancelButton type="button">
                  <Link href="/login"> Volver a Login</Link>
                </CancelButton>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </Card>
  );
};

export default RegisterForm;
