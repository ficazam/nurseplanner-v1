import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full min-h-[90vh] w-full flex flex-col justify-center items-center">
			<Navbar />
			{children}
		</div>
	);
};

export default DashboardLayout;
