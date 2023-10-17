import Card from "../../components/Card";
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import { currentUser } from "@clerk/nextjs";

const Patients = async () => {
  const loggedInUser = await currentUser()
  const user: any = await prisma.user.findUnique({
    where: { email: loggedInUser?.emailAddresses[0].emailAddress },
  });
  const patientsList: any[] = await prisma.patient.findMany({
    where: { surgeonId: user.surgeonId || user.id },
  });

  const surgeons: any[] = await prisma.user.findMany({ where: { userType: 'Cirujano' } })
  const nurses: any[] = await prisma.user.findMany({ where: { userType: 'Enfermero' } })

  return (
    <>
      {patientsList.length > 0 ? patientsList.map((patient: Patient) => (
        <Card key={patient.id}>
          <Link href={`/patients/${patient.id}`}>
            <div className="flex flex-col items-start justify-center w-full gap-y-2">
              <h1 className="text-2xl">Paciente: {patient.patientName}</h1>
              <p>
                Cirugía: {patient.surgery} - Dr. {surgeons.find((surgeon) => surgeon.id === patient.surgeonId).name}
              </p>
              <p>Fecha de la cirugía: {patient.surgeryDate}</p>
              <p>Primera visita: {patient.firstVisitDate}</p>
              <p>Enfermero Asignado: {nurses.find((nurse) => nurse.id === patient.nurseId)?.name}</p>
              <p>Dirección: {patient.address}</p>
              <p>Nuúmero de teléfono: {patient.phoneNumber}</p>
              <p>Notas: {patient.notes}</p>
            </div>
          </Link>
        </Card>
      )) : (
        <h1 className="text-lg">No hay pacientes para mostrar.</h1>
      )}
    </>
  );
};

export default Patients;
