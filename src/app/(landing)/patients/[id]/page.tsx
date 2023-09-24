import NewPatientForm from "../../add-new-patient/components/NewPatientForm";
import prisma from "../../../../../lib/prisma";
import { currentUser } from "@clerk/nextjs";

const EditPatient = async ({ params }: { params: { id: string } }) => {
  const { id: patientId } = params;
  const loggedInUser = await currentUser();
  const user: any = await prisma.user.findUnique({
    where: { email: loggedInUser?.emailAddresses[0].emailAddress },
  });

  const surgeons = await prisma.user.findMany({
    where: { userType: "Cirujano" },
  });

  const nurses = await prisma.user.findMany({
    where: { userType: "Enfermero" },
  });

  const patientToEdit: Patient | null = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  const surgeonOptions = surgeons?.map((surgeon: User) => surgeon.name);
  const nurseOptions = nurses?.map((nurse: User) => nurse.name);
  const patientSurgeon: string | undefined = surgeons.find(
    (surgeon: User) => surgeon.id === patientToEdit?.surgeonId
  )?.name;
  const patientNurse: string | undefined = nurses.find(
    (nurse: User) => nurse.id === patientToEdit?.nurseId
  )?.name;

  return (
    <NewPatientForm
      surgeonOptions={surgeonOptions}
      nurseOptions={nurseOptions}
      patientToEdit={patientToEdit}
      patientNurse={patientNurse}
      patientSurgeon={patientSurgeon}
      isSuperadmin={user.superadmin}
    />
  );
};

export default EditPatient;
