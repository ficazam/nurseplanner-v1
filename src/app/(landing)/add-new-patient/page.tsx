import { currentUser } from "@clerk/nextjs";
import prisma from "../../../../lib/prisma";
import NewPatientForm from "./components/NewPatientForm";

const NewPatient = async () => {
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

  const surgeonOptions = surgeons?.map((surgeon: User) => surgeon.name);
  const nurseOptions = nurses?.map((nurse: User) => nurse.name);

  return (
    <NewPatientForm
      surgeonOptions={surgeonOptions}
      nurseOptions={nurseOptions}
      isSuperadmin={user.superadmin}
    />
  );
};

export default NewPatient;
