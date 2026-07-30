import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/staff")({
  component: StaffPage,
});

type StaffMember = { id: string; fullName?: string | null; email?: string | null; role: string; active: boolean };

function StaffPage() {
  const { shop } = useShop();
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", role: "cashier" as string, active: true });

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
    try {
      const db = getDb();
      await setDoc(doc(collection(db, COL.staff)), {
        shopId: shop.id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
        active: form.active,
        createdAt: new Date(),
      });
      toast.success("Staff member added");
      setForm({ fullName: "", email: "", role: "cashier", active: true });
    } catch (error) {
      toast.error((error as Error).message);
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
        <p className="text-sm text-muted-foreground">Assign roles such as admin, manager, cashier, kitchen and waiter.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Add staff</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveMember}>
              <div className="space-y-1.5"><Label>Full name</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Role</Label><Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="cashier">Cashier</SelectItem><SelectItem value="kitchen">Kitchen</SelectItem><SelectItem value="waiter">Waiter</SelectItem></SelectContent></Select></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} /><Label>Active</Label></div>
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
