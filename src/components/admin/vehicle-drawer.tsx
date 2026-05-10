"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { createVehicle, updateVehicle } from "@/app/actions/vehicle";
import { CATEGORY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from "@/lib/utils";
import { getPublicUrl } from "@/lib/supabase";

interface Vehicle {
  id?: string;
  brand?: string;
  model?: string;
  year?: number;
  category?: string;
  fuel?: string;
  transmission?: string;
  seats?: number;
  pricePerDay?: number;
  mileageLimit?: number;
  power?: number | null;
  torque?: number | null;
  acceleration?: number | null;
  topSpeed?: number | null;
  consumption?: number | null;
  trunkVolume?: number | null;
  description?: string | null;
  equipments?: string[];
  images?: string[];
  status?: string;
  isFeatured?: boolean;
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
}

export function VehicleDrawer({ open, onClose, vehicle }: DrawerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | Record<string, string[]> | null>(null);
  const [equipments, setEquipments] = useState<string[]>(vehicle?.equipments ?? []);
  const [newEquipment, setNewEquipment] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>(vehicle?.images ?? []);
  const [previewFiles, setPreviewFiles] = useState<{ file: File; url: string }[]>([]);

  const isEdit = !!vehicle?.id;

  useEffect(() => {
    if (open) {
      setEquipments(vehicle?.equipments ?? []);
      setExistingImages(vehicle?.images ?? []);
      setPreviewFiles([]);
      setError(null);
    }
  }, [open, vehicle]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function addEquipment() {
    const trimmed = newEquipment.trim();
    if (trimmed && !equipments.includes(trimmed)) {
      setEquipments([...equipments, trimmed]);
      setNewEquipment("");
    }
  }

  function removeEquipment(index: number) {
    setEquipments(equipments.filter((_, i) => i !== index));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviewFiles((prev) => [...prev, ...previews]);
  }

  function removePreview(index: number) {
    setPreviewFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    formData.set("equipments", JSON.stringify(equipments));
    formData.set("existingImages", JSON.stringify(existingImages));

    for (const { file } of previewFiles) {
      formData.append("images", file);
    }

    const result = isEdit
      ? await updateVehicle(formData)
      : await createVehicle(formData);

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setPending(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-white shadow-2xl overflow-y-auto"
        style={{ animation: "slideInRight 0.2s ease-out" }}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-md border-b border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {isEdit ? "Modifier le vehicule" : "Ajouter un vehicule"}
          </h2>
          <button onClick={onClose} className="p-xs rounded hover:bg-surface-container transition-colors">
            <X size={20} className="text-on-surface-variant" />
          </button>
        </div>

        <form ref={formRef} action={handleSubmit} className="p-md flex flex-col gap-md">
          {isEdit && <input type="hidden" name="id" value={vehicle?.id} />}

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Marque *</label>
              <input name="brand" defaultValue={vehicle?.brand ?? ""} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Modele *</label>
              <input name="model" defaultValue={vehicle?.model ?? ""} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-sm">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Annee *</label>
              <input name="year" type="number" defaultValue={vehicle?.year ?? new Date().getFullYear()} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Categorie *</label>
              <select name="category" defaultValue={vehicle?.category ?? "LUXURY"} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Carburant *</label>
              <select name="fuel" defaultValue={vehicle?.fuel ?? "PETROL"} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
                {Object.entries(FUEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-sm">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Transmission *</label>
              <select name="transmission" defaultValue={vehicle?.transmission ?? "AUTOMATIC"} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
                {Object.entries(TRANSMISSION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Places *</label>
              <input name="seats" type="number" defaultValue={vehicle?.seats ?? 5} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Prix/jour ($) *</label>
              <input name="pricePerDay" type="number" step="0.01" defaultValue={vehicle?.pricePerDay ?? ""} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <h3 className="font-label-bold text-label-bold text-on-surface mb-sm">Caracteristiques techniques</h3>
            <div className="grid grid-cols-3 gap-sm">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Puissance (ch)</label>
                <input name="power" type="number" defaultValue={vehicle?.power ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Couple (Nm)</label>
                <input name="torque" type="number" defaultValue={vehicle?.torque ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">0-100 (s)</label>
                <input name="acceleration" type="number" step="0.1" defaultValue={vehicle?.acceleration ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Vitesse max (km/h)</label>
                <input name="topSpeed" type="number" defaultValue={vehicle?.topSpeed ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Conso. (L ou kWh)</label>
                <input name="consumption" type="number" step="0.1" defaultValue={vehicle?.consumption ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Coffre (L)</label>
                <input name="trunkVolume" type="number" defaultValue={vehicle?.trunkVolume ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Description</label>
            <textarea name="description" rows={3} defaultValue={vehicle?.description ?? ""} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary resize-none" />
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Equipements</label>
            <div className="flex gap-xs mb-sm">
              <input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }}
                placeholder="Ajouter un equipement..."
                className="flex-1 bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={addEquipment} className="px-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 hover:bg-surface-container-high transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-xs">
              {equipments.map((eq, i) => (
                <span key={i} className="flex items-center gap-xs bg-primary/10 text-primary px-sm py-xs rounded font-label-sm text-label-sm">
                  {eq}
                  <button type="button" onClick={() => removeEquipment(i)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Photos</label>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-xs mb-sm">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getPublicUrl(img)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {previewFiles.length > 0 && (
              <div className="flex flex-wrap gap-xs mb-sm">
                {previewFiles.map((p, i) => (
                  <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePreview(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-xs px-sm py-sm bg-surface-container rounded-lg border border-dashed border-outline-variant/50 hover:bg-surface-container-high transition-colors font-label-sm text-label-sm text-on-surface-variant">
              <Upload size={14} />
              Ajouter des photos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Statut</label>
              <select name="status" defaultValue={vehicle?.status ?? "AVAILABLE"} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
                <option value="AVAILABLE">Disponible</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Hors service</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Vehicule Premium</label>
              <select name="isFeatured" defaultValue={vehicle?.isFeatured ? "true" : "false"} className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary">
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>
          </div>

          {error && typeof error === "string" && (
            <div className="bg-red-50 text-red-600 px-md py-sm rounded-lg font-body-md text-body-md">{error}</div>
          )}
          {error && typeof error === "object" && (
            <div className="bg-red-50 text-red-600 px-md py-sm rounded-lg font-body-md text-body-md">
              {Object.entries(error).map(([field, msgs]) => (
                <div key={field}>{msgs.join(", ")}</div>
              ))}
            </div>
          )}

          <div className="flex gap-sm pt-sm sticky bottom-0 bg-white pb-md">
            <button type="button" onClick={onClose} className="flex-1 px-md py-sm rounded-lg border border-outline-variant/30 font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-container transition-colors">Annuler</button>
            <button type="submit" disabled={pending} className="flex-1 bg-primary text-on-primary px-md py-sm rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {pending ? "Enregistrement..." : isEdit ? "Modifier" : "Creer"}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
