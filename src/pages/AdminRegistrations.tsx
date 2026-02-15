import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Download, LogOut, Shield, Pencil, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string | null;
  participants_count: number;
  workshop_date: string;
  amount_paid: number;
  currency: string;
  paypal_order_id: string;
  payment_status: string;
  created_at: string;
}

const AdminRegistrations = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Registration>>({});

  // Check if user is already logged in and is admin
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      setIsAuthenticated(true);
      await fetchRegistrations();
    } else {
      setIsAuthenticated(false);
      toast({
        title: "אין הרשאה",
        description: "אין לך הרשאת אדמין לצפות בדף זה.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "שגיאת התחברות",
        description: "אימייל או סיסמה שגויים",
        variant: "destructive",
      });
      setLoginLoading(false);
      return;
    }

    if (data.user) {
      await checkAdminRole(data.user.id);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setRegistrations([]);
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הנתונים",
        variant: "destructive",
      });
      return;
    }

    setRegistrations((data as Registration[]) || []);
  };

  const startEditing = (reg: Registration) => {
    setEditingId(reg.id);
    setEditData({
      participant_name: reg.participant_name,
      participant_email: reg.participant_email,
      participant_phone: reg.participant_phone || "",
      participants_count: reg.participants_count,
      workshop_date: reg.workshop_date,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("registrations")
      .update({
        participant_name: editData.participant_name,
        participant_email: editData.participant_email,
        participant_phone: editData.participant_phone,
        participants_count: editData.participants_count,
        workshop_date: editData.workshop_date,
      })
      .eq("id", editingId);

    if (error) {
      console.error("Error updating registration:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הפרטים",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "עודכן בהצלחה" });
    setEditingId(null);
    setEditData({});
    await fetchRegistrations();
  };

  const filteredRegistrations = filterDate
    ? registrations.filter((r) => r.workshop_date.includes(filterDate))
    : registrations;

  const totalParticipants = filteredRegistrations.reduce(
    (sum, r) => sum + r.participants_count,
    0
  );
  const totalRevenue = filteredRegistrations.reduce(
    (sum, r) => sum + Number(r.amount_paid),
    0
  );

  const exportCSV = () => {
    const headers = [
      "שם", "אימייל", "טלפון", "משתתפים", "תאריך סדנה",
      "סכום", "מזהה PayPal", "סטטוס", "תאריך הרשמה",
    ];
    const rows = filteredRegistrations.map((r) => [
      r.participant_name,
      r.participant_email,
      r.participant_phone || "",
      r.participants_count,
      r.workshop_date,
      r.amount_paid,
      r.paypal_order_id,
      r.payment_status,
      new Date(r.created_at).toLocaleString("he-IL"),
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
        <div className="w-full max-w-sm bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">כניסת אדמין</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">אימייל</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password">סיסמה</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "התחבר"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">ניהול נרשמים</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-2" />
            התנתק
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">סה״כ הרשמות</p>
            <p className="text-2xl font-bold text-foreground">
              {filteredRegistrations.length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">סה״כ משתתפים</p>
            <p className="text-2xl font-bold text-foreground">
              {totalParticipants}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground">סה״כ הכנסות</p>
            <p className="text-2xl font-bold text-primary">
              ₪{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <Label>סינון לפי תאריך סדנה</Label>
            <Input
              placeholder="למשל 05.03"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-48"
            />
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 ml-2" />
            ייצוא CSV
          </Button>
          <Button variant="outline" onClick={fetchRegistrations}>
            רענון
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">משתתפים</TableHead>
                <TableHead className="text-right">תאריך סדנה</TableHead>
                <TableHead className="text-right">סכום</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך הרשמה</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-8"
                  >
                    אין הרשמות עדיין
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">
                      {editingId === reg.id ? (
                        <Input value={editData.participant_name || ""} onChange={(e) => setEditData({ ...editData, participant_name: e.target.value })} className="h-8 w-32" />
                      ) : reg.participant_name}
                    </TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {editingId === reg.id ? (
                        <Input value={editData.participant_email || ""} onChange={(e) => setEditData({ ...editData, participant_email: e.target.value })} className="h-8 w-44" dir="ltr" />
                      ) : reg.participant_email}
                    </TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {editingId === reg.id ? (
                        <Input value={editData.participant_phone || ""} onChange={(e) => setEditData({ ...editData, participant_phone: e.target.value })} className="h-8 w-28" dir="ltr" />
                      ) : reg.participant_phone || "-"}
                    </TableCell>
                    <TableCell>
                      {editingId === reg.id ? (
                        <Input type="number" value={editData.participants_count || 1} onChange={(e) => setEditData({ ...editData, participants_count: parseInt(e.target.value) || 1 })} className="h-8 w-16" />
                      ) : reg.participants_count}
                    </TableCell>
                    <TableCell>
                      {editingId === reg.id ? (
                        <Input value={editData.workshop_date || ""} onChange={(e) => setEditData({ ...editData, workshop_date: e.target.value })} className="h-8 w-24" />
                      ) : reg.workshop_date}
                    </TableCell>
                    <TableCell>
                      ₪{Number(reg.amount_paid).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {reg.payment_status === "completed" ? "שולם" : reg.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(reg.created_at).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell>
                      {editingId === reg.id ? (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={saveEditing} className="h-8 w-8">
                            <Check className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={cancelEditing} className="h-8 w-8">
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => startEditing(reg)} className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
