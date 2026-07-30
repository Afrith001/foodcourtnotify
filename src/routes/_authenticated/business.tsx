import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/business")({
  component: BusinessPage,
});

function BusinessPage() {
  const { shop } = useShop();
  const [form, setForm] = useState({ businessName: "", currency: "INR", address: "", phone: "", email: "", gst: "", fssai: "", timezone: "Asia/Kolkata" });

  useEffect(() => {
    if (!shop) return;
    getDoc(doc(getDb(), COL.shops, shop.id)).then((snap) => {
      const data = snap.data() as any;
      setForm({
        businessName: data?.businessName || shop.name || "",
        currency: data?.currency || "INR",
        address: data?.address || "",
        phone: data?.phone || "",
        email: data?.email || "",
        gst: data?.gst || "",
        fssai: data?.fssai || "",
        timezone: data?.timezone || "Asia/Kolkata",
      });
    });
  }, [shop]);

  const save = async () => {
    if (!shop) return;
    try {
      await updateDoc(doc(getDb(), COL.shops, shop.id), form);
      toast.success("Business settings saved");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Business settings</h1>
        <p className="text-sm text-muted-foreground">Store your business identity, tax details and operating preferences.</p>
      </div>
      <Card className="shadow-soft">
        <CardHeader><CardTitle>Business profile</CardTitle><CardDescription>All values persist to the shared shop document in Firestore.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5"><Label>Business name</Label><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>GST</Label><Input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>FSSAI</Label><Input value={form.fssai} onChange={(e) => setForm({ ...form, fssai: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Timezone</Label><Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></div>
        </CardContent>
        <div className="p-6 pt-0"><Button onClick={save}>Save business settings</Button></div>
      </Card>
    </div>
  );
}
