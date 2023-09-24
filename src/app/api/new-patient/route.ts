import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const {
    patientName,
    surgery,
    surgeryDate,
    firstVisitDate,
    phoneNumber,
    surgeon,
    address,
    notes,
    nurse,
  } = await request.json();

  try {
    const surgeonData = await prisma.user.findUnique({ where: {name: surgeon }})
    const nurseData = await prisma.user.findUnique({ where: {name: nurse }})

    const result = await prisma.patient.create({
      data: {
        patientName,
        surgery,
        surgeryDate,
        firstVisitDate,
        phoneNumber,
        surgeonId: surgeonData?.id,
        address,
        notes,
        nurseId: nurseData?.id
      },
    });

    return NextResponse.json({ status: "success", message: result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error });
  }
};

export const PUT = async (request: Request) => {
  const {
    id,
    patientName,
    surgery,
    surgeryDate,
    firstVisitDate,
    phoneNumber,
    surgeon,
    address,
    notes,
    nurse,
  } = await request.json();

  try {
    const surgeonData = await prisma.user.findUnique({ where: {name: surgeon }})
    const nurseData = await prisma.user.findUnique({ where: {name: nurse }})

    const result = await prisma.patient.update({
      where: { id: id },
      data: {
        patientName,
        surgery,
        surgeryDate,
        firstVisitDate,
        phoneNumber,
        surgeonId: surgeonData?.id,
        address,
        notes,
        nurseId: nurseData?.id
      },
    });

    return NextResponse.json({ status: "success", message: result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error });
  }
};