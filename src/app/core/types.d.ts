type User = {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	surgeonId?: string | null;
	assistant?: User;
	surgeon?: string;
	userType: "Asistente" | "Cirujano" | "Enfermero" | string;
	superadmin: boolean;
	isVerified: boolean
};

type Patient = {
	id: string;
	patientName: string;
	surgery: string;
	surgeryDate: string;
	firstVisitDate: string;
	phoneNumber: string;
	surgeonId: string | null;
	address: string;
	notes: string | null;
	nurseId: string | null;
};
