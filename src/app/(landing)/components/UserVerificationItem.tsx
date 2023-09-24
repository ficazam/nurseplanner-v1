"use client";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import { dateFormatter } from "@/app/core/helpters";
import { useState } from "react";

interface iUserVerificationItem {
  userAdmin: User;
  surgeons: User[];
}

const UserVerificationItem = ({
  userAdmin,
  surgeons,
}: iUserVerificationItem) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userVerification = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/new-user", {
        method: "PUT",
        body: JSON.stringify(userAdmin.id),
      });
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <div className="flex flex-col items-start justify-center w-full gap-y-2">
        <h1 className="text-2xl">Usuario: {userAdmin.name}</h1>
        <p>
          Tipo: {userAdmin.userType} -{" "}
          {userAdmin.userType === "Asistente" &&
            `Dr. 
                  ${
                    surgeons.find(
                      (surgeon) => surgeon.id === userAdmin.surgeonId
                    )?.name
                  }`}
          {userAdmin.userType === "Cirujano" &&
            `Asistente 
                  ${
                    surgeons.find(
                      (surgeon) => surgeon.id === userAdmin.surgeonId
                    )?.name
                  }`}
        </p>
        <p>Creado: {dateFormatter(userAdmin.createdAt)}</p>
        <Button type="button" onClick={userVerification} disabled={isLoading}>
          Verificar
        </Button>
      </div>
    </Card>
  );
};

export default UserVerificationItem;
