import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminButton } from "./components/admin-button";

const AdminPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      AdminPage Welcome - {session.user.name}
      <AdminButton />
    </div>
  );
};

export default AdminPage;
