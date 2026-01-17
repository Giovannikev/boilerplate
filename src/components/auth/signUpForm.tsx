"use client";

import type React from "react";

import signupLogo from "@/assets/login.png";
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
import { type FormEvent, useState } from "react";
import { signUp } from "@/services/auth";
import type { SignUpFormData } from "@/types/auth.types";
import { useFormInput } from "@/hooks/use-form-input";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

const INITIAL_FORM_STATE: SignUpFormData = {
  email: "",
  password: "",
  fullName: "",
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, handleChange } = useFormInput(INITIAL_FORM_STATE);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (authError) {
        setError(
          authError.message || t('auth.signUpError')
        );
        return;
      }

      if (data?.user) {
        setSuccessMessage(
          t('auth.signUpSuccess')
        );
        setTimeout(() => navigate(ROUTES.SIGNIN), 3000);
      }
    } catch (err) {
      setError(t('auth.unexpectedError'));
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('auth.signUpTitle')}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {t('auth.signUpDescription')}
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

              {successMessage && (
                <div
                  className="rounded-md bg-green-500/10 p-3 text-sm text-green-600"
                  role="status"
                  aria-live="polite"
                >
                  {successMessage}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="fullName">{t('auth.fullName')}</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pr-10"
                  />
                </div>
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
                  {isLoading ? t('auth.signingIn') : t('auth.signUp')}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                {t('auth.alreadyHaveAccount')}{" "}
                <Link to={ROUTES.SIGNIN}>{t('auth.signIn')}</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={signupLogo}
              alt={t('auth.signUpImageAlt')}
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
