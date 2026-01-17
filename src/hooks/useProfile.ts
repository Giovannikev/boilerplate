import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/services/supabase";
import { updateUserPassword, signOut } from "@/services/auth";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export type ProfileForm = {
  email: string;
  fullName: string;
  avatarUrl: string;
};

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function computeInitialForm(user: User | null): ProfileForm {
  return {
    email: user?.email || "",
    fullName:
      ((user?.user_metadata as Record<string, unknown>)?.full_name as string) || "",
    avatarUrl:
      ((user?.user_metadata as Record<string, unknown>)?.avatar_url as string) || "",
  };
}

export function useProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const initial: ProfileForm = useMemo(() => computeInitialForm(user), [user]);

  const [form, setForm] = useState<ProfileForm>(initial);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const update = useCallback((key: keyof ProfileForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setForm(initial);
  }, [initial]);

  const handleSaveProfile = useCallback(async () => {
    try {
      setSaving(true);
      const supabase = getSupabaseClient();
      const updates: Parameters<typeof supabase.auth.updateUser>[0] = {
        data: {
          full_name: form.fullName,
          avatar_url: form.avatarUrl,
        },
      };
      if (form.email && form.email !== user?.email) {
        updates.email = form.email;
      }
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      toast.success(t('profile.success.profileUpdated'));
    } catch (err) {
      const msg = typeof err === "object" && err && (err as { message?: string }).message
        ? (err as { message: string }).message
        : t('profile.errors.updateProfileError');
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [form.fullName, form.avatarUrl, form.email, t, user?.email]);

  const handleChangePassword = useCallback(async () => {
    try {
      if (!password || password !== confirmPassword) {
        toast.error(t('profile.errors.passwordMismatch'));
        return;
      }
      setChangingPwd(true);
      const { error } = await updateUserPassword(password);
      if (error) throw error;
      setPassword("");
      setConfirmPassword("");
      toast.success(t('profile.success.passwordUpdated'));
    } catch (err) {
      const msg = typeof err === "object" && err && (err as { message?: string }).message
        ? (err as { message: string }).message
        : t('profile.errors.updatePasswordError');
      toast.error(msg);
    } finally {
      setChangingPwd(false);
    }
  }, [password, confirmPassword, t]);

  const handleUploadAvatar = useCallback(async () => {
    try {
      if (!avatarFile || !user?.id) {
        toast.error(t('profile.errors.updateProfileError'));
        return;
      }
      if (!avatarFile.type?.startsWith("image/")) {
        toast.error("Le fichier sélectionné n'est pas une image.");
        return;
      }
      if (avatarFile.size > MAX_AVATAR_SIZE) {
        toast.error("Image trop lourde (max 5 Mo).");
        return;
      }
      setUploadingAvatar(true);
      const supabase = getSupabaseClient();
      const safeName = avatarFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `${user.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, avatarFile, { contentType: avatarFile.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      setForm((f) => ({ ...f, avatarUrl: publicUrl }));
      const { error: profileError } = await supabase.auth.updateUser({
        data: {
          full_name: form.fullName,
          avatar_url: publicUrl,
        },
        email: form.email && form.email !== user.email ? form.email : undefined,
      });
      if (profileError) throw profileError;
      toast.success(t('profile.success.profileUpdated'));
      setAvatarFile(null);
    } catch (err) {
      const msg = typeof err === "object" && err && (err as { message?: string }).message
        ? (err as { message: string }).message
        : t('profile.errors.updateProfileError');
      toast.error(msg);
    } finally {
      setUploadingAvatar(false);
    }
  }, [avatarFile, form.fullName, form.email, t, user?.id, user?.email]);

  const handleSignOut = useCallback(async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(t('profile.errors.signOutError'));
      return;
    }
    navigate("/signin");
    toast.info(t('profile.success.signedOut'));
  }, [navigate, t]);

  return {
    user,
    form,
    saving,
    password,
    confirmPassword,
    changingPwd,
    avatarFile,
    uploadingAvatar,
    update,
    handleReset,
    handleSaveProfile,
    handleChangePassword,
    setPassword,
    setConfirmPassword,
    setAvatarFile,
    handleUploadAvatar,
    handleSignOut,
  } as const;
}

