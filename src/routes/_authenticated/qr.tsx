import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQrDataUrl, buildPortalUrl } from "@/lib/qr";
import { Download, Printer, QrCode as QrIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/qr")({
  component: QrPage,
});

function QrPage() {
  const { shop } = useShop();
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!shop) return;
    generateQrDataUrl(buildPortalUrl(shop.shopCode), shop.themeColor).then(setQr);
  }, [shop]);

  if (!shop) return null;

  const download = () => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = `${shop.shopCode}-customer-portal.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">QR management</h1>
        <p className="text-sm text-muted-foreground">Generate and download QR codes for shop and table access.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="flex items-center gap-2"><QrIcon className="w-4 h-4" /> Customer portal QR</CardTitle><CardDescription>Share this QR with customers to track their order status.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {qr ? <img src={qr} alt="customer QR" className="h-56 w-56 rounded-xl border border-border object-cover" /> : <div className="h-56 w-56 animate-pulse rounded-xl bg-muted" />}
            <div className="flex gap-2"><Button onClick={download} variant="outline"><Download className="mr-2 h-4 w-4" />Download</Button><Button onClick={() => toast.success("Printer setup ready")}> <Printer className="mr-2 h-4 w-4" /> Print</Button></div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Shop details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div><span className="font-semibold text-foreground">Shop:</span> {shop.name}</div>
            <div><span className="font-semibold text-foreground">Shop code:</span> {shop.shopCode}</div>
            <div><span className="font-semibold text-foreground">Portal URL:</span> {buildPortalUrl(shop.shopCode)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
