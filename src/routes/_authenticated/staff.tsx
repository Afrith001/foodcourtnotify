import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/staff")({
  component: StaffPage,
});

type StaffMember = { id: string; fullName?: string | null; email?: string | null; role: string; active: boolean };

function StaffPage() {
  const { shop } = useShop();
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "kitchen" as string, active: true });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(collection(db, COL.staff), where("shopId", "==", shop.id));
    const unsub = onSnapshot(q, (snap) => setMembers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StaffMember, "id">) }))));
    return () => unsub();
  }, [shop]);

  const saveMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shop) return;
    setFormError(null);

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      setFormError("Email is required.");
      return;
    }
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string;
      if (!apiKey) {
        throw new Error("Missing Firebase API key for staff creation.");
      }

      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        },
      );

      const body = await resp.json();
      if (!resp.ok) {
        const errorMessage = body?.error?.message || "Could not create staff account.";
        throw new Error(errorMessage.replace(/_/g, " ").toLowerCase());
      }

      const uid = body.localId as string;
      const db = getDb();
      const staffRef = doc(collection(db, COL.staff));
      await setDoc(staffRef, {
        shopId: shop.id,
        userId: uid,
        fullName: form.fullName.trim(),
        email,
        role: form.role,
        active: form.active,
        createdAt: new Date(),
      });

      toast.success(`Kitchen account created — share these login details: ${email} + password`);
      setForm({ fullName: "", email: "", password: "", role: "kitchen", active: true });
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  const toggleActive = async (memberId: string, active: boolean) => {
    try {
      await updateDoc(doc(getDb(), COL.staff, memberId), { active });
      toast.success(active ? "Staff member activated" : "Staff member deactivated");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Staff</h1>
        <p className="text-sm text-muted-foreground">Assign roles for owner/admin, cashier, and kitchen access.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Add staff</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveMember}>
              <div className="space-y-1.5"><Label>Full name</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Set temporary password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
              <div className="space-y-1.5"><Label>Role</Label><div className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm">Kitchen</div></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} /><Label>Active</Label></div>
              {formError ? <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div> : null}
              <Button type="submit">Save member</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Team roster</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <div className="font-semibold">{member.fullName || member.email || "Staff"}</div>
                  <div className="text-xs text-muted-foreground">{member.email || "—"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs capitalize">{member.role}</span>
                  <Switch checked={member.active} onCheckedChange={(checked) => toggleActive(member.id, checked)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
