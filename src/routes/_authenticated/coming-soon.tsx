import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export const Route = createFileRoute("/_authenticated/coming-soon")({
  component: ComingSoon,
});

function ComingSoon() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(getFirebaseAuth());
    navigate({ to: "/auth" });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Coming soon</h1>
      <p className="mt-4">This role's dashboard is coming soon. Please contact your shop owner for access.</p>
      <div className="mt-6">
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
    </div>
  );
}
