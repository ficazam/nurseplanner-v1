import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { dateFormatter, today } from "../core/helpters";
import prisma from "../../../lib/prisma";
import { currentUser } from "@clerk/nextjs";
import Button from "../components/Button";
import UserVerificationItem from "./components/UserVerificationItem";

const Dashboard = async () => {
  const loggedInUser = await currentUser();
  const user: any = await prisma.user.findUnique({
    where: { email: loggedInUser?.emailAddresses[0].emailAddress },
  });

  const patientsList: Patient[] = await prisma.patient.findMany({
    where:
      user.userType === "Enfermero"
        ? { firstVisitDate: today, surgeonId: user.surgeonId || user.id }
        : { surgeryDate: today, surgeonId: user.surgeonId || user.id },
  });

  const unverifiedUserList: User[] = await prisma.user.findMany({
    where: { isVerified: false },
  });

  const surgeons: User[] = await prisma.user.findMany({
    where: { userType: "Cirujano" },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-full w-full py-20 px-10">
        <h1 className="text-2xl">
          Bienvenido, {user?.userType} {user?.name}
        </h1>
        <h1>Hoy, {today}</h1>

        <>
          {patientsList.map((patient: Patient) => (
            <Card key={patient.id}>
              <div className="flex flex-col items-start justify-center w-full gap-y-2">
                <h1 className="text-2xl">Paciente: {patient.patientName}</h1>
                <p>
                  Cirugia: {patient.surgery} - Dr.{" "}
                  {
                    surgeons.find((surgeon) => surgeon.id === patient.surgeonId)
                      ?.name
                  }
                </p>
                <p>Direccion: {patient.address}</p>
                <p>Numero de telefono: {patient.phoneNumber}</p>
                <p>Notas: {patient.notes}</p>
              </div>
            </Card>
          ))}
        </>
      </div>

      {user.superadmin && unverifiedUserList.length > 0 && (
        <div className="h-full w-full py-0 px-10">
          <h1>Usuarios sin verificación:</h1>

          <>
            {unverifiedUserList.map((userAdmin: User) => (
              <UserVerificationItem
                key={userAdmin.id}
                userAdmin={userAdmin}
                surgeons={surgeons}
              />
            ))}
          </>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
