// // import { ProfileForm } from "~/components/settings/";
// import { Separator } from "@radix-ui/react-dropdown-menu";

// function License() {
//   return (
//     <div className="tw-space-y-6">
//       <div>
//         <h3 className="tw-text-lg tw-font-medium">License</h3>
//         <p className="tw-text-sm tw-text-muted-foreground">License.</p>
//       </div>
//       <Separator />
//       {/* <ProfileForm /> */}
//     </div>
//   );
// }

// export { License };

import { TProfile, profileSchema } from "@/schema/eur/license";
import { Form, FormControl, FormField, FormItem, Input } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export function LicenseForm() {
  // const { account } = useLoaderData() as TAccount;

  const form = useForm<TProfile>({
    resolver: zodResolver(profileSchema),
    // defaultValues: {
    //   email: account.profile.email,
    //   firstName: account.profile.firstName,
    //   lastName: account.profile.lastName,
    //   password: account.profile.password,
    // },
  });

  const onSubmit = (values: TProfile) => {
    console.log(values);
    // window.config.saveAccount(values);
  };

  // useEffect(() => {
  //   const btn = props.submitBtnRef.current;
  //   const listener = () => {
  //     form.handleSubmit(onSubmit)();
  //   };

  //   if (btn) {
  //     btn.addEventListener("click", listener);
  //   }

  //   return () => {
  //     btn?.removeEventListener("click", listener);
  //   };
  // }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-1 tw-gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <label>
                  <span className="tw-block tw-text-sm tw-text-gray-600 tw-mb-1">
                    Ім&apos;я
                  </span>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <label>
                  <span className="tw-block tw-text-sm tw-text-gray-600 tw-mb-1">
                    Прізвище
                  </span>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label>
                  <span className="tw-block tw-text-sm tw-text-gray-600 tw-mb-1">
                    Email
                  </span>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <label>
                  <span className="tw-block tw-text-sm tw-text-gray-600 tw-mb-1">
                    Пароль
                  </span>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </label>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
