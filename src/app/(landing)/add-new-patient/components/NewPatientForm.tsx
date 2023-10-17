"use client";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import Button, { CancelButton } from "../../../components/Button";
import { today, tomorrow } from "@/app/core/helpters";
import { useRouter } from "next/navigation";

interface INewPatientFormProps {
  surgeonOptions: string[];
  nurseOptions: string[];
  patientToEdit?: Patient | null;
  patientNurse?: string;
  patientSurgeon?: string;
  isSuperadmin: boolean;
}

const NewPatientForm = (props: INewPatientFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const newPatientForm = useForm({
    defaultValues: {
      patientName: props.patientToEdit?.patientName || "",
      surgery: props.patientToEdit?.surgery || "",
      surgeryDate: props.patientToEdit?.surgeryDate || today,
      firstVisitDate: props.patientToEdit?.firstVisitDate || tomorrow,
      phoneNumber: props.patientToEdit?.phoneNumber || "",
      surgeon: props.patientSurgeon || "",
      address: props.patientToEdit?.address || "",
      notes: props.patientToEdit?.notes || "",
      nurse: props.patientNurse || "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const submitNewPatient = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const newPatient = {
        patientName: data.patientName,
        surgery: data.surgery,
        surgeryDate: data.surgeryDate,
        firstVisitDate: data.firstVisitDate,
        phoneNumber: data.phoneNumber,
        surgeon: data.surgeon,
        address: data.address,
        notes: data.notes,
        nurse: data.nurse,
      };

      let response;
      
      if (props.patientToEdit) {
        response = await fetch("/api/new-patient", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newPatient, id: props.patientToEdit?.id }),
        });
      } else {
        response = await fetch("/api/new-patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPatient),
        });
      }

      const responseData = await response.json();

      if (responseData.status === 'success') {
        newPatientForm.reset();
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider {...newPatientForm}>
      <form onSubmit={newPatientForm.handleSubmit(submitNewPatient)} className="p-10">
        <h1>Nuevo Paciente: </h1>
        <div className="my-1">
          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Input
                name="patientName"
                formConfig={{
                  required: "Por favor agregue un nombre al paciente.",
                  validate: (input: string) =>
                    input.trim() !== "" ||
                    "Por favor agregue un nombre al paciente.",
                  minLength: {
                    value: 3,
                    message:
                      "El nombre del paciente debe ser de mas de 3 caracteres.",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "El nombre del paciente debe ser de menos de 50 caracteres.",
                  },
                  onChange: () =>
                    newPatientForm.formState.errors.patientName &&
                    newPatientForm.clearErrors("patientName"),
                  disabled: isLoading,
                }}
                label="Nombre: "
                placeholder="Paciente"
                type="text"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("patientName").isTouched &&
                  newPatientForm.formState.errors.patientName
                    ? newPatientForm.formState.errors.patientName.message
                    : ""
                }
              />
              <Input
                name="surgery"
                formConfig={{
                  required: "Por favor agregue un tipo de cirugia.",
                  validate: (input: string) =>
                    input.trim() !== "" ||
                    "Por favor agregue un tipo de cirugia.",
                  minLength: {
                    value: 3,
                    message:
                      "El nombre de la cirugia debe ser de mas de 3 caracteres.",
                  },

                  onChange: () =>
                    newPatientForm.formState.errors.surgery &&
                    newPatientForm.clearErrors("surgery"),
                  disabled: isLoading,
                }}
                label="Cirugia: "
                placeholder="Cirugia"
                type="text"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("surgery").isTouched &&
                  newPatientForm.formState.errors.surgery
                    ? newPatientForm.formState.errors.surgery.message
                    : ""
                }
              />
            </div>
          </div>

          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <SelectInput
                name="surgeon"
                formConfig={{
                  required: "Por favor agregue un cirujano.",
                  onChange: () =>
                    newPatientForm.formState.errors.surgeon &&
                    newPatientForm.clearErrors("surgeon"),
                  disabled: isLoading,
                }}
                defaultValue=""
                label="Cirujano: "
                labelClassName="text-sm font-semibold mb-2"
                options={props.surgeonOptions}
                placeholder="Asigne un cirujano: "
                error={
                  newPatientForm.getFieldState("surgeon").isTouched &&
                  newPatientForm.formState.errors.surgeon
                    ? newPatientForm.formState.errors.surgeon.message
                    : ""
                }
              />
              {props.isSuperadmin && (
                <SelectInput
                  name="nurse"
                  formConfig={{
                    onChange: () =>
                      newPatientForm.formState.errors.nurse &&
                      newPatientForm.clearErrors("nurse"),
                    disabled: isLoading,
                  }}
                  defaultValue=""
                  label="Enfermero: "
                  placeholder="Asigne un enfermero: "
                  labelClassName="text-sm font-semibold mb-2"
                  options={props.nurseOptions}
                  error={
                    newPatientForm.getFieldState("nurse").isTouched &&
                    newPatientForm.formState.errors.nurse
                      ? newPatientForm.formState.errors.nurse.message
                      : ""
                  }
                />
              )}
            </div>
          </div>

          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Input
                name="surgeryDate"
                formConfig={{
                  required: "Por favor agregue la fecha de la cirugia.",
                  onChange: () =>
                    newPatientForm.formState.errors.surgeryDate &&
                    newPatientForm.clearErrors("surgeryDate"),
                  disabled: isLoading,
                }}
                label="Fecha de la Operacion: "
                placeholder={new Date().toDateString()}
                type="date"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("surgeryDate").isTouched &&
                  newPatientForm.formState.errors.surgeryDate
                    ? newPatientForm.formState.errors.surgeryDate.message
                    : ""
                }
              />
              <Input
                name="firstVisitDate"
                formConfig={{
                  required: "Por favor agregue la fecha de la primera visita.",
                  onChange: () =>
                    newPatientForm.formState.errors.firstVisitDate &&
                    newPatientForm.clearErrors("firstVisitDate"),
                  disabled: isLoading,
                }}
                label="Primera Visita: "
                placeholder={new Date().toDateString()}
                type="date"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("firstVisitDate").isTouched &&
                  newPatientForm.formState.errors.firstVisitDate
                    ? newPatientForm.formState.errors.firstVisitDate.message
                    : ""
                }
              />
            </div>
          </div>

          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Input
                name="address"
                formConfig={{
                  required: "Por favor agregue la direccion del paciente.",
                  validate: (input: string) =>
                    input.trim() !== "" ||
                    "Por favor agregue la direccion del paciente.",
                  minLength: {
                    value: 3,
                    message:
                      "La direccion del paciente debe ser de mas de 3 caracteres.",
                  },
                  maxLength: {
                    value: 100,
                    message:
                      "La direccion del paciente debe ser de menos de 100 caracteres.",
                  },
                  onChange: () =>
                    newPatientForm.formState.errors.address &&
                    newPatientForm.clearErrors("address"),
                  disabled: isLoading,
                }}
                label="Direccion: "
                placeholder="Direccion"
                type="text"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("address").isTouched &&
                  newPatientForm.formState.errors.address
                    ? newPatientForm.formState.errors.address.message
                    : ""
                }
              />
              <Input
                name="phoneNumber"
                formConfig={{
                  required:
                    "Por favor agregue el numero de telefono del paciente.",
                  validate: (input: string) =>
                    input.trim() !== "" ||
                    "Por favor agregue el numero de telefono del paciente.",
                  onChange: () =>
                    newPatientForm.formState.errors.phoneNumber &&
                    newPatientForm.clearErrors("phoneNumber"),
                  disabled: isLoading,
                }}
                label="Numero de Telefono: "
                placeholder="Formato: 1234-5678"
                type="text"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("phoneNumber").isTouched &&
                  newPatientForm.formState.errors.phoneNumber
                    ? newPatientForm.formState.errors.phoneNumber.message
                    : ""
                }
              />
            </div>
          </div>

          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Input
                name="notes"
                formConfig={{
                  onChange: () =>
                    newPatientForm.formState.errors.notes &&
                    newPatientForm.clearErrors("notes"),
                  disabled: isLoading,
                }}
                label="Notas: "
                placeholder="Notas sobre el paciente"
                type="text"
                labelClassName="text-sm font-semibold mb-2"
                autoComplete="on"
                error={
                  newPatientForm.getFieldState("notes").isTouched &&
                  newPatientForm.formState.errors.notes
                    ? newPatientForm.formState.errors.notes.message
                    : ""
                }
              />
            </div>
          </div>

          <div className="relative flex flex-col my-8 md:px-0">
            <div className="flex w-full gap-2">
              <Button
                type="submit"
                disabled={isLoading || !newPatientForm.formState.isValid}
              >
                Enviar
              </Button>
              <CancelButton
                type="button"
                onClick={() => router.push("/patients")}
              >
                Cancelar
              </CancelButton>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewPatientForm;
