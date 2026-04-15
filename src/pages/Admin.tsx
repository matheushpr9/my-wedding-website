import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Trash2, Plus, LogOut, Upload, Eye, EyeOff, Gift, Camera, ArrowLeft, ImagePlus, Pencil, X } from "lucide-react";

import { toast, Toaster } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type Tab = "gifts" | "photos";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.checkAuth().then(() => setAuthed(true)).catch(() => {}).finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

// ==================== LOGIN ====================
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login(username, password);
      onSuccess();
    } catch {
      toast.error("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-8 w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl text-primary text-center">Admin</h1>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" className="w-full px-3 py-2 border border-input rounded-md text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha" className="w-full px-3 py-2 border border-input rounded-md text-sm" />
        <button disabled={loading} className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("gifts");

  const handleLogout = async () => {
    await api.logout();
    onLogout();
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "gifts", label: "Presentes", icon: <Gift size={16} /> },
    { key: "photos", label: "Fotos", icon: <Camera size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Toaster />
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Voltar ao site
          </a>
          <span className="text-border">|</span>
          <h1 className="font-display text-xl text-primary">Painel Admin</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={16} /> Sair
        </button>
      </header>

      <div className="container max-w-5xl py-6 px-4">
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-background border border-border hover:bg-muted"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "gifts" && <GiftsTab />}
        {tab === "photos" && <PhotosTab />}
      </div>
    </div>
  );
}

// ==================== GIFTS TAB ====================
function GiftsTab() {
  const [gifts, setGifts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [editFileName, setEditFileName] = useState("");

  const load = useCallback(() => { api.getAdminGifts().then(setGifts).catch(() => toast.error("Erro ao carregar presentes")); }, []);
  useEffect(load, [load]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.createGift(form);
      toast.success("Presente criado!");
      setShowForm(false);
      setFileName("");
      load();
    } catch { toast.error("Erro ao criar presente"); }
  };

  const handleEdit = (gift: any) => {
    setEditing(gift);
    setEditFileName("");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    fd.append("active", String(editing.active));
    try {
      await api.updateGift(editing.id, fd);
      toast.success("Presente atualizado!");
      setEditing(null);
      load();
    } catch { toast.error("Erro ao atualizar presente"); }
  };

  const handleToggle = async (gift: any) => {
    const fd = new FormData();
    fd.append("active", gift.active ? "0" : "1");
    await api.updateGift(gift.id, fd);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este presente?")) return;
    await api.deleteGift(id);
    toast.success("Excluído!");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg">Presentes ({gifts.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-background border border-border rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <input name="name" placeholder="Nome do presente" required className="px-3 py-2 border border-input rounded-md text-sm" />
          <input name="price" type="number" step="0.01" placeholder="Preço" required className="px-3 py-2 border border-input rounded-md text-sm" />
          <label className="flex items-center gap-1.5 px-3 py-2 border border-input rounded-md text-sm cursor-pointer hover:border-primary/40 truncate">
            <ImagePlus size={16} className="shrink-0" />
            <span className="truncate">{fileName || "Selecionar imagem"}</span>
            <input name="image" type="file" accept="image/*" required className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </label>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Salvar</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {gifts.map((g) => (
          <div key={g.id} className={`bg-background border border-border rounded-lg p-3 flex gap-3 ${!g.active ? "opacity-50" : ""}`}>
            <img src={`${API_URL}${g.image}`} alt={g.name} className="w-16 h-16 object-cover rounded-md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{g.name}</p>
              <p className="text-xs text-muted-foreground">R$ {Number(g.price).toFixed(2)}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleEdit(g)} className="text-xs text-muted-foreground hover:text-foreground" title="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleToggle(g)} className="text-xs text-muted-foreground hover:text-foreground" title={g.active ? "Desativar" : "Ativar"}>
                  {g.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleDelete(g.id)} className="text-xs text-destructive hover:text-destructive/80" title="Excluir">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setEditing(null)}>
              <X size={20} />
            </button>
            <h3 className="font-display text-lg text-primary mb-4">Editar Presente</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input name="name" defaultValue={editing.name} placeholder="Nome" required className="w-full px-3 py-2 border border-input rounded-md text-sm" />
              <input name="price" type="number" step="0.01" defaultValue={editing.price} placeholder="Preço" required className="w-full px-3 py-2 border border-input rounded-md text-sm" />
              <label className="flex items-center gap-1.5 px-3 py-2 border border-input rounded-md text-sm cursor-pointer hover:border-primary/40 truncate">
                <ImagePlus size={16} className="shrink-0" />
                <span className="truncate">{editFileName || "Trocar imagem (opcional)"}</span>
                <input name="image" type="file" accept="image/*" className="hidden" onChange={(e) => setEditFileName(e.target.files?.[0]?.name || "")} />
              </label>
              <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PHOTOS TAB ====================
function PhotosTab() {
  const [photos, setPhotos] = useState<any[]>([]);

  const load = useCallback(() => { api.getAdminPhotos().then(setPhotos).catch(() => toast.error("Erro ao carregar fotos")); }, []);
  useEffect(load, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("alt", file.name.replace(/\.[^.]+$/, ""));
      await api.uploadPhoto(fd);
    }
    toast.success("Fotos enviadas!");
    load();
    e.target.value = "";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta foto?")) return;
    await api.deletePhoto(id);
    toast.success("Foto excluída!");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg">Fotos ({photos.length})</h2>
        <label className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm cursor-pointer">
          <Upload size={16} /> Enviar
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p) => (
          <div key={p.id} className="relative group">
            <img src={`${API_URL}${p.filename}`} alt={p.alt} className="w-full aspect-square object-cover rounded-lg" />
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

