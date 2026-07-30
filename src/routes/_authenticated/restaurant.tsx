import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  RefreshCw,
  Eye,
  Clock,
  Palette,
  Layout,
  Star,
  Users,
  Award,
  Phone,
  Mail,
  Globe,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ChefHat,
  Sparkles,
  ImagePlus,
  Plus,
  Edit3,
  X,
  Check,
  Pin,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Calendar,
  Wifi,
  Car,
  Home,
  Utensils,
  Wind,
  Bell,
  Quote,
  Target,
  Twitter,
  Music2,
  Map,
  Navigation,
  BookOpen,
  Trophy,
  Reply,
  ToggleLeft,
  ToggleRight,
  Monitor,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/restaurant")({
  head: () => ({
    meta: [
      { title: `Restaurant CMS · ${i18n.t("common.appName")}` },
    ],
  }),
  component: RestaurantCMSPage,
});

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return reject(new Error("Cloudinary configuration missing in .env file"));
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, true);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          if (resp.secure_url) resolve(resp.secure_url);
          else reject(new Error("Missing secure_url in Cloudinary response"));
        } catch { reject(new Error("Failed to parse Cloudinary response")); }
      } else {
        try {
          const errResp = JSON.parse(xhr.responseText);
          reject(new Error(errResp.error?.message || "Cloudinary upload failed"));
        } catch { reject(new Error("Cloudinary upload failed")); }
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}

function DropZone({ onFiles, label = "Drop files here", maxSize = 5, multiple = false }: { onFiles: (f: File[]) => void; label?: string; maxSize?: number; multiple?: boolean }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const valid = files.filter((f) => f.size <= maxSize * 1024 * 1024);
    if (valid.length !== files.length) toast.error(`Some files exceed ${maxSize}MB limit`);
    if (valid.length) onFiles(valid);
  }, [onFiles, maxSize]);
  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
        const files = Array.from(e.target.files || []);
        const valid = files.filter((f) => f.size <= maxSize * 1024 * 1024);
        if (valid.length !== files.length) toast.error(`Some files exceed ${maxSize}MB limit`);
        if (valid.length) onFiles(valid);
        e.target.value = "";
      }} />
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"><Upload className="w-5 h-5 text-orange-600" /></div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP up to {maxSize}MB</p>
      </div>
    </div>
  );
}

function ImgPreview({ src, onDelete, onReplace }: { src: string; onDelete: () => void; onReplace?: () => void }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border bg-white shadow-sm">
      <img src={src} alt="" className="w-full h-28 object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        {onReplace && <button onClick={onReplace} className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"><RefreshCw className="w-3.5 h-3.5 text-slate-700" /></button>}
        <button onClick={onDelete} className="w-7 h-7 rounded-full bg-red-500/90 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-white" /></button>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-sm h-9" />
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function RestaurantCMSPage() {
  const { t } = useTranslation();
  const { shop } = useShop();
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = `Restaurant CMS · ${t("common.appName")}`; }, [t]);
  useEffect(() => {
    if (!shop) return;
    const hash = window.location.hash.replace("#", "");
    if (["branding","details","gallery","contact","theme","announcements","reviews","faq"].includes(hash)) setActiveTab(hash);
    setLoading(false);
  }, [shop]);

  if (loading) return <div className="space-y-4 max-w-6xl"><Skeleton className="h-10 w-64"/><Skeleton className="h-10 w-full"/><Skeleton className="h-96 w-full"/></div>;
  if (!shop) return null;

  const tabs = [
    { value:"branding", label:"Branding", icon:Sparkles },
    { value:"details", label:"Details", icon:ChefHat },
    { value:"gallery", label:"Gallery", icon:ImageIcon },
    { value:"contact", label:"Contact", icon:Phone },
    { value:"theme", label:"Theme", icon:Palette },
    { value:"announcements", label:"Announcements", icon:Megaphone },
    { value:"reviews", label:"Reviews", icon:Star },
    { value:"faq", label:"FAQ", icon:HelpCircle },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      <div>
        <h1 className="font-display text-3xl font-bold">Restaurant CMS</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage everything your customers see — no developer needed.</p>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); window.location.hash = v; }} className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start mb-6 gap-1 bg-transparent">
          {tabs.map((tab) => { const Icon = tab.icon; return (
            <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 rounded-xl px-3 py-2 text-xs sm:text-sm">
              <Icon className="w-4 h-4 mr-1.5"/>{tab.label}
            </TabsTrigger>
          ); })}
        </TabsList>
        <TabsContent value="branding"><BrandingSection shopId={shop.id}/></TabsContent>
        <TabsContent value="details"><DetailsSection shopId={shop.id}/></TabsContent>
        <TabsContent value="gallery"><GallerySection shopId={shop.id}/></TabsContent>
        <TabsContent value="contact"><ContactSection shopId={shop.id}/></TabsContent>
        <TabsContent value="theme"><ThemeSection shopId={shop.id}/></TabsContent>
        <TabsContent value="announcements"><AnnouncementsSection shopId={shop.id}/></TabsContent>
        <TabsContent value="reviews"><ReviewsSection shopId={shop.id}/></TabsContent>
        <TabsContent value="faq"><FAQSection shopId={shop.id}/></TabsContent>
      </Tabs>
    </div>
  );
}

// ─── SECTION 1: BRANDING ──────────────────────────────────────────────
function BrandingSection({ shopId }: { shopId: string }) {
  const [data, setData] = useState<any>({ restaurantLogo:"", coverBanner:"", restaurantName:"", restaurantTagline:"", shortDescription:"", loaderLogo:"", loaderAnimation:true, loaderSpeed:1, loaderColor:"#F97316", themeColor:"#F97316", accentColor:"#10B981", primaryFont:"Inter", secondaryFont:"Sora", enableAnimatedHeader:true, animatedRestaurantName:true, scrollingSpeed:3, favicon:"" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string|null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { (async () => { const snap = await getDoc(doc(getDb(), COL.branding, shopId)); if (snap.exists()) setData((p:any) => ({ ...p, ...snap.data() })); setLoaded(true); })(); }, [shopId]);
  const update = (k:string, v:any) => setData((p:any) => ({ ...p, [k]:v }));
  const handleUpload = async (file:File, field:string, folder:string) => {
    setUploading(field);
    try { const url = await uploadToCloudinary(file); update(field, url); toast.success(`${folder} uploaded`); }
    catch (e:any) { toast.error(e.message); } finally { setUploading(null); }
  };
  const save = async () => { setSaving(true); try { await setDoc(doc(getDb(), COL.branding, shopId), { ...data, updatedAt:serverTimestamp() }, { merge:true }); toast.success("Branding saved"); } catch (e:any) { toast.error(e.message); } finally { setSaving(false); } };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Restaurant Branding</h2>
        <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}Save</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft"><CardHeader><CardTitle className="text-base">Logos & Images</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div><Label className="text-sm font-semibold mb-2 block">Restaurant Logo</Label>
              {data.restaurantLogo ? (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border group">
                  <img src={data.restaurantLogo} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => update("restaurantLogo","")} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-white"/></button>
                  </div>
                </div>
              ) : <DropZone onFiles={(f) => handleUpload(f[0],"restaurantLogo","logo")} label="Drop logo here"/>}
              {uploading === "restaurantLogo" && <div className="flex items-center gap-2 text-sm text-orange-600 mt-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</div>}
            </div>
            <div><Label className="text-sm font-semibold mb-2 block">Cover Banner</Label>
              {data.coverBanner ? (
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border group">
                  <img src={data.coverBanner} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => update("coverBanner","")} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-white"/></button>
                  </div>
                </div>
              ) : <DropZone onFiles={(f) => handleUpload(f[0],"coverBanner","banner")} label="Drop banner here"/>}
              {uploading === "coverBanner" && <div className="flex items-center gap-2 text-sm text-orange-600 mt-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</div>}
            </div>
            <div><Label className="text-sm font-semibold mb-2 block">Loader Logo</Label>
              {data.loaderLogo ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border group">
                  <img src={data.loaderLogo} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => update("loaderLogo","")} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-white"/></button>
                  </div>
                </div>
              ) : <DropZone onFiles={(f) => handleUpload(f[0],"loaderLogo","loader")} maxSize={2} label="Drop loader logo"/>}
            </div>
            <div><Label className="text-sm font-semibold mb-2 block">Favicon</Label>
              {data.favicon ? (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border group">
                  <img src={data.favicon} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => update("favicon","")} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3 h-3 text-white"/></button>
                  </div>
                </div>
              ) : <DropZone onFiles={(f) => handleUpload(f[0],"favicon","favicon")} maxSize={1} label="Drop favicon (32x32)"/>}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft"><CardHeader><CardTitle className="text-base">Text & Typography</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Restaurant Name</Label><Input value={data.restaurantName} onChange={(e) => update("restaurantName",e.target.value)} placeholder="Your Restaurant Name"/></div>
            <div className="space-y-1.5"><Label>Tagline</Label><Input value={data.restaurantTagline} onChange={(e) => update("restaurantTagline",e.target.value)} placeholder="e.g. Taste the Tradition"/></div>
            <div className="space-y-1.5"><Label>Short Description</Label><Textarea value={data.shortDescription} onChange={(e) => update("shortDescription",e.target.value)} rows={3} placeholder="Brief description..."/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Primary Font</Label>
                <select value={data.primaryFont} onChange={(e) => update("primaryFont",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  {["Inter","Sora","Poppins","Playfair Display","DM Sans","Space Grotesk"].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Secondary Font</Label>
                <select value={data.secondaryFont} onChange={(e) => update("secondaryFont",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  {["Inter","Sora","Poppins","Playfair Display","DM Sans","Space Grotesk"].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base">Colors</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColorField label="Theme Color" value={data.themeColor} onChange={(v) => update("themeColor",v)}/>
          <ColorField label="Accent Color" value={data.accentColor} onChange={(v) => update("accentColor",v)}/>
          <ColorField label="Loader Color" value={data.loaderColor} onChange={(v) => update("loaderColor",v)}/>
        </div></CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base">Header & Animation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label className="text-sm font-medium">Enable Animated Header</Label><p className="text-xs text-slate-400">Scrolling header with restaurant name</p></div>
            <Switch checked={data.enableAnimatedHeader} onCheckedChange={(v) => update("enableAnimatedHeader",v)}/>
          </div>
          {data.enableAnimatedHeader && (<>
            <div className="flex items-center justify-between"><div><Label className="text-sm font-medium">Animated Restaurant Name</Label></div><Switch checked={data.animatedRestaurantName} onCheckedChange={(v) => update("animatedRestaurantName",v)}/></div>
            <div className="space-y-1.5"><Label>Scrolling Speed (seconds)</Label><div className="flex items-center gap-4"><Slider value={[data.scrollingSpeed]} onValueChange={([v]) => update("scrollingSpeed",v)} min={1} max={10} step={0.5} className="flex-1"/><span className="text-sm font-mono w-12 text-right">{data.scrollingSpeed}s</span></div></div>
          </>)}
          <div className="flex items-center justify-between"><div><Label className="text-sm font-medium">Loader Animation</Label></div><Switch checked={data.loaderAnimation} onCheckedChange={(v) => update("loaderAnimation",v)}/></div>
          {data.loaderAnimation && (<div className="space-y-1.5"><Label>Loader Speed</Label><div className="flex items-center gap-4"><Slider value={[data.loaderSpeed]} onValueChange={([v]) => update("loaderSpeed",v)} min={0.5} max={3} step={0.1} className="flex-1"/><span className="text-sm font-mono w-12 text-right">{data.loaderSpeed}x</span></div></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECTION 2: DETAILS ───────────────────────────────────────────────
function DetailsSection({ shopId }: { shopId: string }) {
  const [data, setData] = useState<any>({ aboutRestaurant:"", story:"", establishedYear:new Date().getFullYear(), founderName:"", ownerName:"", managerName:"", signatureQuote:"", mission:"", vision:"", cuisineType:"", vegNonVeg:"both", pureVeg:false, seatingCapacity:0, acAvailable:false, parkingAvailable:false, freeWifi:false, homeDelivery:false, takeAway:false, outdoorSeating:false, headChefName:"", chefDescription:"", chefPhoto:"", awards:"", certifications:"", hygieneRating:5, googleRating:4.5, totalReviews:0, totalCustomersServed:0, openingTime:"09:00", closingTime:"22:00", weeklyHolidays:"" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { (async () => { const snap = await getDoc(doc(getDb(), COL.details, shopId)); if (snap.exists()) setData((p:any) => ({ ...p, ...snap.data() })); setLoaded(true); })(); }, [shopId]);
  const update = (k:string, v:any) => setData((p:any) => ({ ...p, [k]:v }));
  const save = async () => { setSaving(true); try { await setDoc(doc(getDb(), COL.details, shopId), { ...data, updatedAt:serverTimestamp() }, { merge:true }); toast.success("Details saved"); } catch (e:any) { toast.error(e.message); } finally { setSaving(false); } };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Restaurant Details</h2><Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}Save</Button></div>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4"/> Restaurant Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>About Restaurant</Label><Textarea value={data.aboutRestaurant} onChange={(e) => update("aboutRestaurant",e.target.value)} rows={4} placeholder="Tell your story..."/></div>
          <div className="space-y-1.5"><Label>Story</Label><Textarea value={data.story} onChange={(e) => update("story",e.target.value)} rows={3} placeholder="The story behind your restaurant..."/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Established Year</Label><Input type="number" value={data.establishedYear} onChange={(e) => update("establishedYear",parseInt(e.target.value)||new Date().getFullYear())}/></div>
            <div className="space-y-1.5"><Label>Founder Name</Label><Input value={data.founderName} onChange={(e) => update("founderName",e.target.value)} placeholder="Founder name"/></div>
            <div className="space-y-1.5"><Label>Owner Name</Label><Input value={data.ownerName} onChange={(e) => update("ownerName",e.target.value)} placeholder="Owner name"/></div>
            <div className="space-y-1.5"><Label>Manager Name</Label><Input value={data.managerName} onChange={(e) => update("managerName",e.target.value)} placeholder="Manager name"/></div>
          </div>
          <div className="space-y-1.5"><Label className="flex items-center gap-2"><Quote className="w-4 h-4"/> Signature Quote</Label><Input value={data.signatureQuote} onChange={(e) => update("signatureQuote",e.target.value)} placeholder="e.g. Good food, good mood"/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Target className="w-4 h-4"/> Mission</Label><Textarea value={data.mission} onChange={(e) => update("mission",e.target.value)} rows={2} placeholder="Our mission..."/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Eye className="w-4 h-4"/> Vision</Label><Textarea value={data.vision} onChange={(e) => update("vision",e.target.value)} rows={2} placeholder="Our vision..."/></div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Utensils className="w-4 h-4"/> Restaurant Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Cuisine Type</Label><Input value={data.cuisineType} onChange={(e) => update("cuisineType",e.target.value)} placeholder="e.g. Indian, Italian, Chinese"/></div>
            <div className="space-y-1.5"><Label>Veg / Non-Veg</Label><select value={data.vegNonVeg} onChange={(e) => update("vegNonVeg",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="both">Both</option><option value="veg">Pure Veg</option><option value="nonveg">Non-Veg</option></select></div>
          </div>
          <div className="flex items-center justify-between"><div><Label className="text-sm font-medium">Pure Veg Restaurant</Label></div><Switch checked={data.pureVeg} onCheckedChange={(v) => update("pureVeg",v)}/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-1.5"><Label>Seating Capacity</Label><Input type="number" value={data.seatingCapacity} onChange={(e) => update("seatingCapacity",parseInt(e.target.value)||0)}/></div></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[{key:"acAvailable",label:"AC Available",icon:Wind},{key:"parkingAvailable",label:"Parking",icon:Car},{key:"freeWifi",label:"Free WiFi",icon:Wifi},{key:"homeDelivery",label:"Home Delivery",icon:Home},{key:"takeAway",label:"Take Away",icon:Bell},{key:"outdoorSeating",label:"Outdoor Seating",icon:MapPin}].map(({key,label,icon:Icon}) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-sm"><Icon className="w-4 h-4 text-slate-500"/>{label}</span>
                <Switch checked={(data as any)[key]} onCheckedChange={(v) => update(key,v)}/>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><ChefHat className="w-4 h-4"/> Chef</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Head Chef Name</Label><Input value={data.headChefName} onChange={(e) => update("headChefName",e.target.value)} placeholder="Chef name"/></div>
            <div className="space-y-1.5"><Label>Chef Photo</Label>
              {data.chefPhoto ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border group">
                  <img src={data.chefPhoto} alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => update("chefPhoto","")} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3 h-3 text-white"/></button>
                  </div>
                </div>
              ) : <DropZone onFiles={async (f) => { setUploading(true); try { const url = await uploadToCloudinary(f[0]); update("chefPhoto",url); } catch (e:any) { toast.error(e.message); } setUploading(false); }} label="Upload chef photo" maxSize={2}/>}
              {uploading && <div className="text-sm text-orange-600">Uploading...</div>}
            </div>
          </div>
          <div className="space-y-1.5"><Label>Chef Description</Label><Textarea value={data.chefDescription} onChange={(e) => update("chefDescription",e.target.value)} rows={2} placeholder="About the chef..."/></div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4"/> Achievements</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Awards</Label><Textarea value={data.awards} onChange={(e) => update("awards",e.target.value)} rows={2} placeholder="List awards..."/></div>
            <div className="space-y-1.5"><Label>Certifications</Label><Textarea value={data.certifications} onChange={(e) => update("certifications",e.target.value)} rows={2} placeholder="List certifications..."/></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label>Hygiene Rating</Label><div className="flex items-center gap-2"><Slider value={[data.hygieneRating]} onValueChange={([v]) => update("hygieneRating",v)} min={0} max={5} step={0.5} className="flex-1"/><span className="text-sm font-bold w-8">{data.hygieneRating}</span></div></div>
            <div className="space-y-1.5"><Label>Google Rating</Label><div className="flex items-center gap-2"><Slider value={[data.googleRating]} onValueChange={([v]) => update("googleRating",v)} min={0} max={5} step={0.1} className="flex-1"/><span className="text-sm font-bold w-8"><Star className="w-3 h-3 inline text-yellow-500 fill-yellow-500"/>{data.googleRating}</span></div></div>
            <div className="space-y-1.5"><Label>Total Reviews</Label><Input type="number" value={data.totalReviews} onChange={(e) => update("totalReviews",parseInt(e.target.value)||0)}/></div>
            <div className="space-y-1.5"><Label>Customers Served</Label><Input type="number" value={data.totalCustomersServed} onChange={(e) => update("totalCustomersServed",parseInt(e.target.value)||0)}/></div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4"/> Business Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Opening Time</Label><Input type="time" value={data.openingTime} onChange={(e) => update("openingTime",e.target.value)}/></div>
            <div className="space-y-1.5"><Label>Closing Time</Label><Input type="time" value={data.closingTime} onChange={(e) => update("closingTime",e.target.value)}/></div>
          </div>
          <div className="space-y-1.5"><Label>Weekly Holidays</Label><Input value={data.weeklyHolidays} onChange={(e) => update("weeklyHolidays",e.target.value)} placeholder="e.g. Monday, Tuesday"/></div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECTION 3: GALLERY ───────────────────────────────────────────────
function GallerySection({ shopId }: { shopId: string }) {
  const [galleryTab, setGalleryTab] = useState("restaurant");
  const [images, setImages] = useState<Record<string,string[]>>({ restaurant:[], food:[], interior:[], exterior:[], team:[] });
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { (async () => { const snap = await getDoc(doc(getDb(), COL.gallery, shopId)); if (snap.exists()) setImages((p) => ({ ...p, ...snap.data() })); setLoaded(true); })(); }, [shopId]);
  const saveImages = async (updated:Record<string,string[]>) => { await setDoc(doc(getDb(), COL.gallery, shopId), updated, { merge:true }); };
  const handleUpload = async (files:File[]) => {
    setUploading(true);
    try {
      const urls:string[] = [];
      for (const file of files) { urls.push(await uploadToCloudinary(file)); }
      const updated = { ...images, [galleryTab]:[...images[galleryTab], ...urls] }; setImages(updated); await saveImages(updated); toast.success(`${urls.length} image(s) uploaded`);
    } catch (e:any) { toast.error(e.message); } finally { setUploading(false); }
  };
  const removeImage = async (tab:string, index:number) => { const updated = { ...images, [tab]:images[tab].filter((_,i) => i !== index) }; setImages(updated); await saveImages(updated); };
  const replaceImage = async (tab:string, index:number) => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      try {
        const url = await uploadToCloudinary(file);
        const items = [...images[tab]]; items[index] = url; const updated = { ...images, [tab]:items }; setImages(updated); await saveImages(updated);
      } catch (e:any) { toast.error(e.message); }
    }; input.click();
  };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Gallery</h2>
      <Tabs value={galleryTab} onValueChange={setGalleryTab}>
        <TabsList className="flex flex-wrap h-auto w-full justify-start mb-4 gap-1 bg-transparent">
          {[{value:"restaurant",label:"Restaurant Photos",icon:ImageIcon},{value:"food",label:"Food Photos",icon:Utensils},{value:"interior",label:"Interior",icon:Home},{value:"exterior",label:"Exterior",icon:MapPin},{value:"team",label:"Team Photos",icon:Users}].map(({value,label,icon:Icon}) => (
            <TabsTrigger key={value} value={value} className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 rounded-xl px-3 py-1.5 text-xs"><Icon className="w-3.5 h-3.5 mr-1.5"/>{label}</TabsTrigger>
          ))}
        </TabsList>
        {["restaurant","food","interior","exterior","team"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card className="shadow-soft"><CardContent className="pt-6 space-y-4">
              <DropZone onFiles={handleUpload} multiple label={`Drop ${tab} photos here`}/>
              {uploading && <div className="flex items-center gap-2 text-sm text-orange-600"><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</div>}
              {images[tab].length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images[tab].map((url,idx) => <ImgPreview key={url} src={url} onDelete={() => removeImage(tab,idx)} onReplace={() => replaceImage(tab,idx)}/>)}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400"><ImagePlus className="w-12 h-12 mx-auto mb-2 opacity-50"/><p className="text-sm">No images yet.</p></div>
              )}
            </CardContent></Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ─── SECTION 4: CONTACT ───────────────────────────────────────────────
function ContactSection({ shopId }: { shopId: string }) {
  const [data, setData] = useState<any>({ phone:"", whatsapp:"", email:"", website:"", address:"", googleMapsLink:"", latitude:"", longitude:"", instagram:"", facebook:"", youtube:"", x:"", threads:"" });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { (async () => { const snap = await getDoc(doc(getDb(), COL.contact, shopId)); if (snap.exists()) setData((p:any) => ({ ...p, ...snap.data() })); setLoaded(true); })(); }, [shopId]);
  const update = (k:string, v:any) => setData((p:any) => ({ ...p, [k]:v }));
  const save = async () => { setSaving(true); try { await setDoc(doc(getDb(), COL.contact, shopId), { ...data, updatedAt:serverTimestamp() }, { merge:true }); toast.success("Contact saved"); } catch (e:any) { toast.error(e.message); } finally { setSaving(false); } };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Contact & Social</h2><Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}Save</Button></div>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Phone className="w-4 h-4"/> Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> Phone</Label><Input value={data.phone} onChange={(e) => update("phone",e.target.value)} placeholder="+1 234 567 890"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-500"/> WhatsApp</Label><Input value={data.whatsapp} onChange={(e) => update("whatsapp",e.target.value)} placeholder="+1 234 567 890"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> Email</Label><Input value={data.email} onChange={(e) => update("email",e.target.value)} placeholder="contact@restaurant.com"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400"/> Website</Label><Input value={data.website} onChange={(e) => update("website",e.target.value)} placeholder="https://restaurant.com"/></div>
          </div>
          <div className="space-y-1.5"><Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400"/> Address</Label><Textarea value={data.address} onChange={(e) => update("address",e.target.value)} rows={2} placeholder="Full address"/></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Map className="w-4 h-4 text-red-500"/> Google Maps URL</Label><Input value={data.googleMapsLink} onChange={(e) => update("googleMapsLink",e.target.value)} placeholder="https://maps.google.com/?q=..."/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Navigation className="w-4 h-4 text-slate-400"/> Latitude</Label><Input value={data.latitude} onChange={(e) => update("latitude",e.target.value)} placeholder="28.6139"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Navigation className="w-4 h-4 text-slate-400"/> Longitude</Label><Input value={data.longitude} onChange={(e) => update("longitude",e.target.value)} placeholder="77.2090"/></div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4"/> Social Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500"/> Instagram</Label><Input value={data.instagram} onChange={(e) => update("instagram",e.target.value)} placeholder="https://instagram.com/yourpage"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600"/> Facebook</Label><Input value={data.facebook} onChange={(e) => update("facebook",e.target.value)} placeholder="https://facebook.com/yourpage"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-600"/> YouTube</Label><Input value={data.youtube} onChange={(e) => update("youtube",e.target.value)} placeholder="https://youtube.com/@channel"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Twitter className="w-4 h-4 text-slate-400"/> X (Twitter)</Label><Input value={data.x} onChange={(e) => update("x",e.target.value)} placeholder="https://x.com/profile"/></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-2"><Music2 className="w-4 h-4 text-slate-400"/> Threads</Label><Input value={data.threads} onChange={(e) => update("threads",e.target.value)} placeholder="https://threads.net/@profile"/></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECTION 5: THEME ─────────────────────────────────────────────────
function ThemeSection({ shopId }: { shopId: string }) {
  const [data, setData] = useState<any>({ primaryColor:"#F97316", secondaryColor:"#1E293B", accentColor:"#10B981", background:"#FFFFFF", cards:"#FFFFFF", buttons:"#F97316", font:"Inter", borderRadius:12, darkMode:false, glassEffect:false, animationSpeed:1 });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { (async () => { const snap = await getDoc(doc(getDb(), COL.theme, shopId)); if (snap.exists()) setData((p:any) => ({ ...p, ...snap.data() })); setLoaded(true); })(); }, [shopId]);
  const update = (k:string, v:any) => setData((p:any) => ({ ...p, [k]:v }));
  const save = async () => { setSaving(true); try { await setDoc(doc(getDb(), COL.theme, shopId), { ...data, updatedAt:serverTimestamp() }, { merge:true }); toast.success("Theme saved"); } catch (e:any) { toast.error(e.message); } finally { setSaving(false); } };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Theme & Appearance</h2><Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}Save</Button></div>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Palette className="w-4 h-4"/> Colors</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorField label="Primary Color" value={data.primaryColor} onChange={(v) => update("primaryColor",v)}/>
          <ColorField label="Secondary Color" value={data.secondaryColor} onChange={(v) => update("secondaryColor",v)}/>
          <ColorField label="Accent Color" value={data.accentColor} onChange={(v) => update("accentColor",v)}/>
          <ColorField label="Background" value={data.background} onChange={(v) => update("background",v)}/>
          <ColorField label="Cards" value={data.cards} onChange={(v) => update("cards",v)}/>
          <ColorField label="Buttons" value={data.buttons} onChange={(v) => update("buttons",v)}/>
        </div></CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Layout className="w-4 h-4"/> Style Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Font</Label><select value={data.font} onChange={(e) => update("font",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">{["Inter","Sora","Poppins","Playfair Display","DM Sans","Space Grotesk"].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
          <div className="space-y-1.5"><Label>Border Radius: {data.borderRadius}px</Label><Slider value={[data.borderRadius]} onValueChange={([v]) => update("borderRadius",v)} min={0} max={32} step={1}/></div>
          <div className="space-y-1.5"><Label>Animation Speed</Label><div className="flex items-center gap-4"><Slider value={[data.animationSpeed]} onValueChange={([v]) => update("animationSpeed",v)} min={0.5} max={3} step={0.1} className="flex-1"/><span className="text-sm font-mono w-12 text-right">{data.animationSpeed}x</span></div></div>
          <div className="flex items-center justify-between"><div><Label className="text-sm font-medium">Dark Mode</Label><p className="text-xs text-slate-400">Enable dark theme</p></div><Switch checked={data.darkMode} onCheckedChange={(v) => update("darkMode",v)}/></div>
          <div className="flex items-center justify-between"><div><Label className="text-sm font-medium">Glass Effect</Label><p className="text-xs text-slate-400">Frosted glass UI elements</p></div><Switch checked={data.glassEffect} onCheckedChange={(v) => update("glassEffect",v)}/></div>
        </CardContent>
      </Card>
      <Card className="shadow-soft"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4"/> Live Preview</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ fontFamily:data.font, background:data.background, borderRadius:data.borderRadius }}>
            <div className="p-6 text-white text-center" style={{ background:`linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}>
              <h3 className="text-xl font-bold">Your Restaurant</h3><p className="text-sm opacity-80 mt-1">Taste the Tradition</p>
            </div>
            <div className="p-4 space-y-3" style={{ background:data.cards }}>
              <div className="flex gap-2"><button className="flex-1 py-2 text-sm font-semibold text-white" style={{ background:data.buttons, borderRadius:data.borderRadius }}>Order Now</button><button className="flex-1 py-2 text-sm font-semibold" style={{ border:`2px solid ${data.buttons}`, color:data.buttons, borderRadius:data.borderRadius }}>View Menu</button></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECTION 6: ANNOUNCEMENTS ────────────────────────────────────────
function AnnouncementsSection({ shopId }: { shopId: string }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [editing, setEditing] = useState<any|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const unsub = onSnapshot(query(collection(getDb(), COL.announcements), where("shopId","==",shopId), orderBy("createdAt","desc")), (snap) => { setAnnouncements(snap.docs.map((d) => ({ id:d.id, ...d.data() }))); setLoaded(true); });
    return () => unsub();
  }, [shopId]);
  const deleteItem = async (id:string) => { await deleteDoc(doc(getDb(), COL.announcements, id)); toast.success("Deleted"); };
  const toggleStatus = async (item:any) => { await updateDoc(doc(getDb(), COL.announcements, item.id), { active:!item.active }); };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Announcements</h2><Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-2"/>New Announcement</Button></div>
      {showForm && <AnnouncementForm shopId={shopId} edit={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); }}/>}
      <div className="space-y-3">
        {announcements.length === 0 && <Card className="shadow-soft"><CardContent className="py-12 text-center text-slate-400"><Megaphone className="w-12 h-12 mx-auto mb-2 opacity-50"/><p>No announcements yet.</p></CardContent></Card>}
        {announcements.map((item) => (
          <Card key={item.id} className={`shadow-soft ${item.active ? "" : "opacity-60"}`}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    {item.pinned && <Pin className="w-3 h-3 text-orange-500"/>}
                    <Badge className={item.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>{item.active ? "Active" : "Inactive"}</Badge>
                    {item.priority === "high" && <Badge className="bg-red-100 text-red-700">High</Badge>}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{item.startDate || "No date"}</span>
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3"/>{item.display || "Both"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(item)}>{item.active ? <ToggleRight className="w-4 h-4 text-green-600"/> : <ToggleLeft className="w-4 h-4 text-slate-400"/>}</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}><Edit3 className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnnouncementForm({ shopId, edit, onClose, onSaved }: { shopId:string; edit:any|null; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState<any>({ title:edit?.title||"", message:edit?.message||"", bannerImage:edit?.bannerImage||"", priority:edit?.priority||"normal", startDate:edit?.startDate||"", endDate:edit?.endDate||"", buttonText:edit?.buttonText||"", buttonUrl:edit?.buttonUrl||"", backgroundColor:edit?.backgroundColor||"#F97316", active:edit?.active??true, pinned:edit?.pinned??false, display:edit?.display||"both" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const update = (k:string, v:any) => setForm((p:any) => ({ ...p, [k]:v }));
  const save = async () => {
    setSaving(true);
    try { const p = { ...form, shopId, updatedAt:serverTimestamp() }; if (edit?.id) { await updateDoc(doc(getDb(), COL.announcements, edit.id), p); toast.success("Updated"); } else { await addDoc(collection(getDb(), COL.announcements), { ...p, createdAt:serverTimestamp() }); toast.success("Created"); } onSaved(); }
    catch (e:any) { toast.error(e.message); } finally { setSaving(false); }
  };
  return (
    <Card className="shadow-soft border-orange-100">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-semibold">{edit ? "Edit" : "New"} Announcement</h3><Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4"/></Button></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => update("title",e.target.value)} placeholder="Announcement title"/></div>
          <div className="space-y-1.5"><Label>Priority</Label><select value={form.priority} onChange={(e) => update("priority",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></div>
        </div>
        <div className="space-y-1.5"><Label>Message</Label><Textarea value={form.message} onChange={(e) => update("message",e.target.value)} rows={3} placeholder="Announcement message..."/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => update("startDate",e.target.value)}/></div>
          <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => update("endDate",e.target.value)}/></div>
          <div className="space-y-1.5"><Label>Button Text</Label><Input value={form.buttonText} onChange={(e) => update("buttonText",e.target.value)} placeholder="Learn More"/></div>
          <div className="space-y-1.5"><Label>Button URL</Label><Input value={form.buttonUrl} onChange={(e) => update("buttonUrl",e.target.value)} placeholder="https://..."/></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorField label="Background Color" value={form.backgroundColor} onChange={(v) => update("backgroundColor",v)}/>
          <div className="space-y-1.5"><Label>Display On</Label><select value={form.display} onChange={(e) => update("display",e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="both">Both</option><option value="home">Home</option><option value="portal">Portal</option></select></div>
        </div>
        <div className="space-y-1.5">
          <Label>Banner Image</Label>
          {form.bannerImage ? (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border group">
              <img src={form.bannerImage} alt="" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => update("bannerImage","")} className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-white"/></button>
              </div>
            </div>
          ) : <DropZone onFiles={async (f) => { setUploading(true); try { const url = await uploadToCloudinary(f[0]); update("bannerImage",url); } catch (e:any) { toast.error(e.message); } setUploading(false); }} label="Upload banner"/>}
          {uploading && <div className="text-sm text-orange-600">Uploading...</div>}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => update("active",v)}/><Label className="text-sm">Active</Label></div>
          <div className="flex items-center gap-2"><Switch checked={form.pinned} onCheckedChange={(v) => update("pinned",v)}/><Label className="text-sm">Pinned</Label></div>
        </div>
        <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}{edit ? "Update" : "Create"} Announcement</Button>
      </CardContent>
    </Card>
  );
}

// ─── SECTION 7: REVIEWS ──────────────────────────────────────────────
function ReviewsSection({ shopId }: { shopId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loaded, setLoaded] = useState(false);
  const [replyText, setReplyText] = useState<Record<string,string>>({});
  useEffect(() => {
    const unsub = onSnapshot(query(collection(getDb(), COL.reviews), where("shopId","==",shopId), orderBy("createdAt","desc")), (snap) => { setReviews(snap.docs.map((d) => ({ id:d.id, ...d.data() }))); setLoaded(true); });
    return () => unsub();
  }, [shopId]);
  const updateStatus = async (id:string, status:string) => { await updateDoc(doc(getDb(), COL.reviews, id), { status, updatedAt:serverTimestamp() }); toast.success(`Review ${status}`); };
  const submitReply = async (id:string) => { const text = replyText[id]?.trim(); if (!text) return; await updateDoc(doc(getDb(), COL.reviews, id), { reply:text, repliedAt:serverTimestamp() }); setReplyText((p) => ({ ...p, [id]:"" })); toast.success("Reply posted"); };
  const deleteReview = async (id:string) => { await deleteDoc(doc(getDb(), COL.reviews, id)); toast.success("Deleted"); };
  const togglePin = async (item:any) => { await updateDoc(doc(getDb(), COL.reviews, item.id), { pinned:!item.pinned }); };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);
  const avg = reviews.length ? (reviews.reduce((s,r) => s + (r.rating||0), 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex items-center gap-3 text-sm"><span className="text-slate-500">Avg:</span><span className="font-bold flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>{avg}</span><span className="text-slate-400">({reviews.length})</span></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["pending","approved","rejected","all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {f.charAt(0).toUpperCase()+f.slice(1)} {f !== "all" && <span className="ml-1 opacity-70">({reviews.filter((r) => r.status === f).length})</span>}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <Card className="shadow-soft"><CardContent className="py-12 text-center text-slate-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50"/><p>No reviews found.</p></CardContent></Card>}
        {filtered.map((item) => (
          <Card key={item.id} className={`shadow-soft ${item.pinned ? "border-orange-200 ring-1 ring-orange-100" : ""}`}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.name || "Anonymous"}</h3>
                    <div className="flex items-center gap-0.5">{Array.from({length:5}).map((_,i) => <Star key={i} className={`w-3 h-3 ${i < (item.rating||0) ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}`}/>)}</div>
                    {item.pinned && <Pin className="w-3 h-3 text-orange-500"/>}
                    <Badge className={item.status === "approved" ? "bg-green-100 text-green-700" : item.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.review}</p>
                  {item.photo && <img src={item.photo} alt="" className="w-16 h-16 rounded-xl object-cover mt-2 border"/>}
                  {item.reply && <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100"><p className="text-xs font-semibold text-slate-500 mb-1">Your Reply:</p><p className="text-sm text-slate-700">{item.reply}</p></div>}
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={replyText[item.id]||""} onChange={(e) => setReplyText((p) => ({ ...p, [item.id]:e.target.value }))} placeholder="Write a reply..." className="h-8 text-xs rounded-lg"/>
                    <Button size="sm" variant="outline" onClick={() => submitReply(item.id)} className="h-8 text-xs"><Reply className="w-3 h-3 mr-1"/>Reply</Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.status === "pending" && (<><Button variant="ghost" size="sm" onClick={() => updateStatus(item.id,"approved")}><Check className="w-4 h-4 text-green-600"/></Button><Button variant="ghost" size="sm" onClick={() => updateStatus(item.id,"rejected")}><X className="w-4 h-4 text-red-500"/></Button></>)}
                  <Button variant="ghost" size="sm" onClick={() => togglePin(item)}><Pin className={`w-4 h-4 ${item.pinned ? "text-orange-500" : "text-slate-400"}`}/></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteReview(item.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 8: FAQ ─────────────────────────────────────────────────
function FAQSection({ shopId }: { shopId: string }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any|null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const unsub = onSnapshot(query(collection(getDb(), COL.faqs), where("shopId","==",shopId), orderBy("displayOrder","asc")), (snap) => { setFaqs(snap.docs.map((d) => ({ id:d.id, ...d.data() }))); setLoaded(true); });
    return () => unsub();
  }, [shopId]);
  const deleteFaq = async (id:string) => { await deleteDoc(doc(getDb(), COL.faqs, id)); toast.success("Deleted"); };
  const moveItem = async (index:number, dir:"up"|"down") => {
    const items = [...faqs]; const target = dir === "up" ? index-1 : index+1;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    for (let i = 0; i < items.length; i++) await updateDoc(doc(getDb(), COL.faqs, items[i].id), { displayOrder:i });
    setFaqs(items);
  };
  if (!loaded) return <Skeleton className="h-96 w-full"/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">FAQ</h2><Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-2"/>Add FAQ</Button></div>
      {showForm && <FAQForm shopId={shopId} edit={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); }} nextOrder={faqs.length}/>}
      <div className="space-y-2">
        {faqs.length === 0 && <Card className="shadow-soft"><CardContent className="py-12 text-center text-slate-400"><HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50"/><p>No FAQs yet.</p></CardContent></Card>}
        {faqs.map((item, idx) => (
          <Card key={item.id} className={`shadow-soft ${!item.active ? "opacity-60" : ""}`}>
            <CardContent className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">#{idx+1}</span>
                    <h3 className="font-medium text-sm">{item.question}</h3>
                    {item.category && <Badge variant="outline" className="text-[10px]">{item.category}</Badge>}
                    {!item.active && <Badge className="bg-slate-100 text-slate-500 text-[10px]">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => moveItem(idx,"up")} disabled={idx === 0}><ChefHat className="w-3 h-3 rotate-90"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => moveItem(idx,"down")} disabled={idx === faqs.length-1}><ChefHat className="w-3 h-3 -rotate-90"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}><Edit3 className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteFaq(item.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FAQForm({ shopId, edit, onClose, onSaved, nextOrder }: { shopId:string; edit:any|null; onClose:()=>void; onSaved:()=>void; nextOrder:number }) {
  const [form, setForm] = useState<any>({ question:edit?.question||"", answer:edit?.answer||"", category:edit?.category||"", displayOrder:edit?.displayOrder??nextOrder, active:edit?.active??true });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try { const p = { ...form, shopId, updatedAt:serverTimestamp() }; if (edit?.id) { await updateDoc(doc(getDb(), COL.faqs, edit.id), p); toast.success("FAQ updated"); } else { await addDoc(collection(getDb(), COL.faqs), { ...p, createdAt:serverTimestamp() }); toast.success("FAQ added"); } onSaved(); }
    catch (e:any) { toast.error(e.message); } finally { setSaving(false); }
  };
  return (
    <Card className="shadow-soft border-orange-100">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-semibold">{edit ? "Edit" : "Add"} FAQ</h3><Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4"/></Button></div>
        <div className="space-y-1.5"><Label>Question</Label><Input value={form.question} onChange={(e) => setForm((p:any) => ({ ...p, question:e.target.value }))} placeholder="Frequently asked question"/></div>
        <div className="space-y-1.5"><Label>Answer</Label><Textarea value={form.answer} onChange={(e) => setForm((p:any) => ({ ...p, answer:e.target.value }))} rows={3} placeholder="Answer..."/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((p:any) => ({ ...p, category:e.target.value }))} placeholder="e.g. Orders, Delivery"/></div>
          <div className="space-y-1.5"><Label>Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm((p:any) => ({ ...p, displayOrder:parseInt(e.target.value)||0 }))}/></div>
        </div>
        <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm((p:any) => ({ ...p, active:v }))}/><Label className="text-sm">Active</Label></div>
        <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}{edit ? "Update" : "Add"} FAQ</Button>
      </CardContent>
    </Card>
  );
}