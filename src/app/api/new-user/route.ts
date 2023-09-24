import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { username: name, email, surgeon, userType } = await request.json();

  try {
    let surgeonData = undefined;
    if (userType === "Asistente") {
      surgeonData = await prisma.user.findUnique({
        where: { name: surgeon },
      });
    }

    const result = await prisma.user.create({
      data: {
        name,
        email,
        surgeonId: surgeonData?.id,
        userType,
        createdAt: new Date(),
        isVerified: false,
        superadmin: false,
      },
    });

    return NextResponse.json({ status: "success", message: result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error });
  }
};

export const PUT = async(request: Request) => {
  const id = await request.json()
    console.log('papitas ',id)
  try {
    const result = await prisma.user.update({
      where: {id: id},
      data: {
        isVerified: true
      }
    })

    return NextResponse.json({ status: "success", message: result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error });
  }
}