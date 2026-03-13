"use client";

import { useMyProfileQuery } from "@/queries/profile.queries";
import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Error from "./Error";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Pencil,
  Check,
  X,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploadCompact from "../compact-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useProfile } from "@/hooks/useProfile";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface ProfileData {
  id: string;
  userId: string;
  avatarUrl: string | null;
  bio: string | null;
  headline: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  location: string | null;
  user: { name: string; email: string; role: string };
}

interface ApiResponse {
  success: boolean;
  profile: ProfileData | null;
}

interface FormState {
  avatarUrl: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

const EMPTY_FORM: FormState = {
  avatarUrl: "",
  headline: "",
  bio: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  twitter: "",
};

/* ─── Field ───────────────────────────────────────────────────────────────── */
const Field = ({
  label,
  icon: Icon,
  value,
  onChange,
  isEditing,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
      <Icon className="w-3 h-3" strokeWidth={2} />
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-xs text-neutral-400 font-medium select-none z-10">
          {prefix}
        </span>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        placeholder={isEditing ? placeholder : "—"}
        className={`
          rounded-xl border-black/10 text-sm transition-all duration-200
          ${prefix ? "pl-28" : ""}
          ${
            !isEditing
              ? "bg-neutral-50 text-neutral-600 cursor-default disabled:opacity-100"
              : "bg-white focus-visible:ring-violet-300 focus-visible:border-violet-400"
          }
          ${!value && !isEditing ? "text-neutral-300" : ""}
        `}
      />
    </div>
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────────── */
const Profile = () => {
  const { editProfile } = useProfile();
  const { data, error, isLoading } = useMyProfileQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const profile = (data as ApiResponse | undefined)?.profile;
  const user = profile?.user;

  useEffect(() => {
    if (profile) {
      setForm({
        avatarUrl: profile.avatarUrl ?? "",
        headline: profile.headline ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        website: profile.website ?? "",
        github: profile.github ?? "",
        linkedin: profile.linkedin ?? "",
        twitter: profile.twitter ?? "",
      });
    }
  }, [profile]);

  const set = (key: keyof FormState) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    const avatarFile = images[0] ?? null;
    const res = await editProfile({
      image: avatarFile,
      headline: form.headline,
      bio: form.bio,
      location: form.location,
      website: form.website,
      github: form.github,
      linkedin: form.linkedin,
      twitter: form.twitter,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(
      profile
        ? {
            avatarUrl: profile.avatarUrl ?? "",
            headline: profile.headline ?? "",
            bio: profile.bio ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            github: profile.github ?? "",
            linkedin: profile.linkedin ?? "",
            twitter: profile.twitter ?? "",
          }
        : EMPTY_FORM,
    );
    setImages([]);
    setFileUploadKey((k) => k + 1);
    setIsEditing(false);
  };

  /* Avatar priority: new upload preview → saved URL → initials */
  const uploadedPreview = images[0]?.preview ?? null;
  const avatarSrc = uploadedPreview ?? (form.avatarUrl || null);
  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const roleBadge: Record<string, string> = {
    TEACHER: "bg-violet-100 text-violet-700 border-violet-200",
    STUDENT: "bg-sky-100 text-sky-700 border-sky-200",
    ADMIN: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
              Account
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-violet-600">
              My Profile
            </h1>
            <p className="text-sm text-neutral-400 font-medium mt-1">
              {profile
                ? "Manage your public profile"
                : "Set up your profile to get started"}
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2 rounded-xl border-black/10 text-sm font-semibold hover:bg-neutral-100 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>

        {/* Avatar + identity */}
        <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  className="w-18 h-18 rounded-2xl object-cover border border-black/10"
                />
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-violet-500 flex items-center justify-center border border-violet-400">
                  <span className="text-2xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
              {uploadedPreview && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold uppercase tracking-wider bg-violet-600 text-white px-1.5 py-0.5 rounded-full border-2 border-white">
                  New
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-neutral-900 truncate">
                  {user?.name ?? "Your Name"}
                </h2>
                {user?.role && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadge[user.role] ?? roleBadge.ADMIN}`}
                  >
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-400 mt-0.5 truncate">
                {user?.email ?? "—"}
              </p>
              {(form.headline || isEditing) && (
                <p className="text-xs text-neutral-500 font-medium mt-1 truncate">
                  {form.headline || (isEditing ? "Add a headline…" : "")}
                </p>
              )}
            </div>
          </div>

          {/* File upload — edit mode only */}
          {isEditing && (
            <div className="mt-5 pt-5 border-t border-black/5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Profile Photo
              </p>
              <FileUploadCompact
                key={fileUploadKey}
                maxFiles={1}
                accept="image/*"
                onFilesChange={(files) => setImages(files)}
              />
              {uploadedPreview && (
                <p className="text-[10px] text-violet-500 font-medium mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  New photo selected — will upload on Save
                </p>
              )}
            </div>
          )}
        </div>

        {/* Basic info */}
        <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm mb-4">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Basic Info
          </p>
          <div className="flex flex-col gap-4">
            <Field
              label="Headline"
              icon={Briefcase}
              value={form.headline}
              onChange={set("headline")}
              isEditing={isEditing}
              placeholder="e.g. Full Stack Developer · DSA Mentor"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-3 h-3" strokeWidth={2} />
                Bio
              </label>
              <Textarea
                value={form.bio}
                onChange={(e) => set("bio")(e.target.value)}
                disabled={!isEditing}
                placeholder={
                  isEditing ? "Tell others a bit about yourself…" : "—"
                }
                rows={3}
                className={`
                  rounded-xl border-black/10 text-sm resize-none transition-all duration-200
                  ${!isEditing ? "bg-neutral-50 text-neutral-600 cursor-default disabled:opacity-100" : "bg-white focus-visible:ring-violet-300 focus-visible:border-violet-400"}
                  ${!form.bio && !isEditing ? "text-neutral-300" : ""}
                `}
              />
            </div>
            <Field
              label="Location"
              icon={MapPin}
              value={form.location}
              onChange={set("location")}
              isEditing={isEditing}
              placeholder="e.g. Kozhikode, Kerala"
            />
          </div>
        </div>

        {/* Links */}
        <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Links
          </p>
          <div className="flex flex-col gap-4">
            <Field
              label="Website"
              icon={Globe}
              value={form.website}
              onChange={set("website")}
              isEditing={isEditing}
              placeholder="yoursite.com"
              prefix="https://"
            />
            <Field
              label="GitHub"
              icon={Github}
              value={form.github}
              onChange={set("github")}
              isEditing={isEditing}
              placeholder="username"
              prefix="github.com/"
            />
            <Field
              label="LinkedIn"
              icon={Linkedin}
              value={form.linkedin}
              onChange={set("linkedin")}
              isEditing={isEditing}
              placeholder="username"
              prefix="linkedin.com/in/"
            />
            <Field
              label="Twitter / X"
              icon={Twitter}
              value={form.twitter}
              onChange={set("twitter")}
              isEditing={isEditing}
              placeholder="username"
              prefix="x.com/"
            />
          </div>
        </div>

        {/* Save */}
        {isEditing && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all duration-200 gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
