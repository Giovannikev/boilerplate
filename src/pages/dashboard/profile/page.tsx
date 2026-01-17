import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@supabase/supabase-js";
import { useProfile, type ProfileForm } from "@/hooks/useProfile";

export default function ProfilePage() {
  const {
    user,
    form,
    saving,
    password,
    confirmPassword,
    changingPwd,
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
  } = useProfile();

  return (
    <div className="flex flex-col gap-4">
      <ProfileInfoCard form={form} user={user} saving={saving} uploadingAvatar={uploadingAvatar} onSave={handleSaveProfile} onReset={handleReset} update={update} onFileChange={setAvatarFile} onUpload={handleUploadAvatar} />
      <ProfileSecurityCard password={password} confirmPassword={confirmPassword} setPassword={setPassword} setConfirmPassword={setConfirmPassword} changingPwd={changingPwd} onChangePassword={handleChangePassword} />
      <ProfileSessionCard email={user?.email} onSignOut={handleSignOut} />
    </div>
  );
}

function ProfileInfoCard({
  form,
  user,
  saving,
  uploadingAvatar,
  onSave,
  onReset,
  update,
  onFileChange,
  onUpload,
}: {
  form: ProfileForm;
  user: User | null;
  saving: boolean;
  uploadingAvatar: boolean;
  onSave: () => void;
  onReset: () => void;
  update: (key: keyof ProfileForm, value: string) => void;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className="text-start">
      <CardHeader>
        <CardTitle>{t('profile.infoTitle')}</CardTitle>
        <CardDescription>{t('profile.infoDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16 rounded-lg self-center sm:self-auto">
            <AvatarImage src={form.avatarUrl} alt={form.fullName || user?.email || ""} />
            <AvatarFallback className="rounded-lg text-lg">
              {(form.fullName || user?.email || "").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Field className="flex-1">
            <FieldGroup>
              <FieldLabel>{t('profile.avatarUrlLabel')}</FieldLabel>
              <Input
                value={form.avatarUrl}
                onChange={(e) => update('avatarUrl', e.target.value)}
                placeholder={t('profile.avatarUrlPlaceholder')}
              />
            </FieldGroup>
          </Field>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <Field className="flex-1">
            <FieldGroup>
              <FieldLabel>{t('profile.photoLabel')}</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              />
            </FieldGroup>
          </Field>
          <div className="flex gap-2">
            <Button onClick={onUpload} disabled={uploadingAvatar} aria-busy={uploadingAvatar}>
              {uploadingAvatar ? <Spinner /> : t('profile.uploadAction')}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldGroup>
              <FieldLabel>{t('profile.fullNameLabel')}</FieldLabel>
              <Input
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <FieldLabel>{t('profile.emailLabel')}</FieldLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder={t('profile.emailPlaceholder')}
              />
            </FieldGroup>
          </Field>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSave} disabled={saving} aria-busy={saving}>
            {saving ? <Spinner /> : t('profile.saveAction')}
          </Button>
          <Button variant="outline" onClick={onReset} disabled={saving}>
            {t('profile.resetAction')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSecurityCard({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  changingPwd,
  onChangePassword,
}: {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  changingPwd: boolean;
  onChangePassword: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className="text-start">
      <CardHeader>
        <CardTitle>{t('profile.securityTitle')}</CardTitle>
        <CardDescription>{t('profile.securityDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldGroup>
              <FieldLabel>{t('profile.newPasswordLabel')}</FieldLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <FieldLabel>{t('profile.confirmPasswordLabel')}</FieldLabel>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FieldGroup>
          </Field>
        </div>
        <div className="flex gap-2">
          <Button onClick={onChangePassword} disabled={changingPwd} aria-busy={changingPwd}>
            {changingPwd ? <Spinner /> : t('profile.updatePasswordAction')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSessionCard({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  const { t } = useTranslation();
  return (
    <Card className="text-start">
      <CardHeader>
        <CardTitle>{t('profile.sessionTitle')}</CardTitle>
        <CardDescription>{t('profile.sessionDescription', { email })}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={onSignOut}>
          {t('profile.signOutAction')}
        </Button>
      </CardFooter>
    </Card>
  );
}
