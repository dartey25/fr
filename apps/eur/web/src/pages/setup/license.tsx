import { Card, Form } from "@/ui";
import {
  TLicense,
  TProfile,
  TToken,
  licenseSchema,
} from "@/schema/eur/license";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Token } from "./token";
import { Profile } from "./profile";
import { Confirmation } from "./confirmation";
import { useState } from "react";
import { axios } from "../../utils/axios";
import { useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

export type TTabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit: (v: TToken | TProfile) => void;
  values?: TLicense;
  loading?: boolean;
};

export default function LicenseSetup(): JSX.Element {
  const form = useForm<TLicense>({
    resolver: zodResolver(licenseSchema),
  });

  const [tab, setTab] = useState<"token" | "profile" | "confirmation">("token");
  const router = useRouter();
  const searchParams = useSearch({ strict: false }) as { redirect: string };
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: TLicense) {
    setLoading(true);
    toast.promise(
      axios
        .post("/license/validate", values, { timeout: 5000 })
        .then((r) => r.data),
      {
        loading: "Перевірка...",
        success: (response) => {
          if (response.valid) {
            router.history.push(searchParams.redirect);
          }
          return `Успішно перевірено`;
        },
        error: (e) => e.response?.data?.message ?? e.message ?? "Помилка",
        finally: () => setLoading(false),
      },
    );
  }

  return (
    <Form {...form}>
      <div className="tw-flex tw-mt-[10%] tw-justify-center tw-h-full">
        <Card className="tw-w-fit tw-h-fit tw-px">
          <form
            className="tw-select-none"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {tab === "token" && (
              <Token
                values={form.getValues()}
                onNext={() => setTab("profile")}
                onSubmit={(v) => form.setValue("license", v as TToken)}
              />
            )}
            {tab === "profile" && (
              <Profile
                values={form.getValues()}
                onNext={() => setTab("confirmation")}
                onPrev={() => setTab("token")}
                onSubmit={(v) => form.setValue("profile", v as TProfile)}
              />
            )}
            {tab === "confirmation" && (
              <Confirmation
                values={form.getValues()}
                onPrev={() => setTab("profile")}
                onSubmit={() => form.handleSubmit(onSubmit)()}
                loading={loading}
              />
            )}
          </form>
        </Card>
      </div>
    </Form>
  );
}
