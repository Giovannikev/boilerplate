"use client";

import type React from "react";

import loginLogo from '@/assets/login.png'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import { signIn } from "@/services/auth";
import type { SignInFormData } from "@/types/auth.types";
import { useFormInput } from "@/hooks/use-form-input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

const INITIAL_FORM_STATE: SignInFormData = {
  email: "",
  password: "",
};

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, updateField } = useFormInput(INITIAL_FORM_STATE);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await signIn(
        formData.email,
        formData.password
      );
      if (authError) {
        setError(
          authError.message || t('auth.signInError')
        );
        return;
      }

      if (data?.user) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(t('auth.unexpectedError'));
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
      toast.success(t('auth.signInSuccess'));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {t('auth.signInTitle')}
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {t('auth.signInDescription')}
                </p>
              </div>

              {error && (
                <div
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

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

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                  <Link
                    to={ROUTES.RESET_PASSWORD}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                </div>
              </Field>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    {t('auth.signingIn')}
                  </>
                ) : (
                  t('auth.signIn')
                )}
              </Button>

              <div className="text-center text-sm">
                {t('auth.noAccount')}{" "}
                <Link to={ROUTES.SIGNUP} className="underline underline-offset-4">
                  {t('auth.signUp')}
                </Link>
              </div>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={loginLogo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center text-xs text-muted-foreground">
        {t('auth.termsText')}{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          {t('auth.termsOfService')}
        </a>{" "}
        {t('auth.and')}{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          {t('auth.privacyPolicy')}
        </a>
        .
      </div>
    </div>
  );
}
