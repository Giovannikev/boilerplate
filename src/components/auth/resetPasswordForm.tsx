"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import { sendPasswordResetEmail, updateUserPassword } from "@/services/auth";
import { getSupabaseClient } from "@/services/supabase";
import type { ResetPasswordFormData } from "@/types/auth.types";
import { useFormInput } from "@/hooks/use-form-input";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

const INITIAL_FORM_STATE: ResetPasswordFormData = {
  email: "",
  newPassword: "",
  confirmNewPassword: "",
  message: "",
};

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, updateField } = useFormInput(INITIAL_FORM_STATE);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const supabase = getSupabaseClient();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordRecovery(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const validatePasswordMatch = (): boolean => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return false;
    }
    return true;
  };

  const handleSendResetEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}${ROUTES.RESET_PASSWORD}`;
      const { error: authError } = await sendPasswordResetEmail(
        formData.email,
        redirectUrl
      );

      if (authError) {
        setError(authError.message || t('auth.resetPasswordError') || "Error");
        return;
      }

      updateField(
        "message",
        t('auth.resetPasswordEmailSent')
      );
    } catch (err) {
      setError(t('auth.unexpectedError'));
      console.error("Reset email error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validatePasswordMatch()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await updateUserPassword(
        formData.newPassword
      );

      if (authError) {
        setError(
          authError.message || t('auth.passwordUpdateError') || "Error"
        );
        return;
      }

      updateField(
        "message",
        t('auth.passwordUpdateSuccess')
      );
      setTimeout(() => navigate(ROUTES.SIGNIN), 2000);
    } catch (err) {
      setError(t('auth.unexpectedError'));
      console.error("Update password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = isPasswordRecovery
    ? handleUpdatePassword
    : handleSendResetEmail;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {isPasswordRecovery
                    ? t('auth.updatePassword')
                    : t('auth.resetPasswordTitle')}
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {isPasswordRecovery
                    ? t('auth.updatePasswordDescription') || "Enter your new password below."
                    : t('auth.resetPasswordDescription')}
                </p>
              </div>

              {formData.message && (
                <div
                  className="rounded-md bg-green-500/10 p-3 text-center text-sm text-green-600"
                  role="status"
                  aria-live="polite"
                >
                  {formData.message}
                </div>
              )}

              {error && (
                <div
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

              {!isPasswordRecovery ? (
                <Field>
                  <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    disabled={isLoading}
                  />
                </Field>
              ) : (
                <>
                  <Field>
                    <FieldLabel htmlFor="new-password">
                      {t('auth.newPassword')}
                    </FieldLabel>
                    <Input
                      id="new-password"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={(e) =>
                        updateField("newPassword", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-new-password">
                      {t('auth.confirmNewPassword')}
                    </FieldLabel>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      required
                      value={formData.confirmNewPassword}
                      onChange={(e) =>
                        updateField("confirmNewPassword", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </Field>
                </>
              )}

              <Field>
                <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
                  {isLoading
                    ? t('auth.processing') || "Processing..."
                    : isPasswordRecovery
                    ? t('auth.updatePassword')
                    : t('auth.sendResetLink') || "Send Reset Link"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link to={ROUTES.SIGNIN}>{t('auth.backToSignIn')}</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t('auth.termsText')}{" "}
        <a href="#">{t('auth.termsOfService')}</a> {t('auth.and')}{" "}
        <a href="#">{t('auth.privacyPolicy')}</a>.
      </FieldDescription>
    </div>
  );
}
