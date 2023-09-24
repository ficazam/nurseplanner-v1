import prisma from "../../../../../../lib/prisma";
import RegisterForm from "./components/RegisterForm";

const Register = async () => {
  const surgeons = await prisma.user.findMany({
    where: { userType: "Cirujano" },
  });
  const surgeonOptions = surgeons?.map((surgeon: User) => surgeon.name);

  return <RegisterForm surgeons={surgeonOptions} />;
};

export default Register;
