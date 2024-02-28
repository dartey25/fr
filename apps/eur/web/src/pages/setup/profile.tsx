import {
  Button,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Label,
} from "@/ui";
import { TTabProps } from "./license";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TProfile, profileSchema } from "@/schema/eur/license";

export function Profile(props: TTabProps) {
  const profileForm = useForm<TProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: props.values?.profile?.firstName,
      lastName: props.values?.profile?.lastName,
      email: props.values?.profile?.email,
    },
  });

  const onSubmit = (v: TProfile) => {
    props.onSubmit(v);
    props.onNext && props.onNext();
  };

  return (
    <Form {...profileForm}>
      <CardContent className="tw-px-8">
        <div className="tw-mb-2">
          <h3 className="tw-font-medium tw-mb-0">Персональна інформація</h3>
        </div>
        <form
          onSubmit={profileForm.handleSubmit(onSubmit)}
          className="tw-space-y-2 tw-mb-4 tw-min-w-[280px]"
        >

          {/*   <FormField */}
          {/*     control={profileForm.control} */}
          {/*     name="firstName" */}
          {/*     render={({ field }) => ( */}
          {/*       <FormItem> */}
          {/*         <Label>Ім&apos;я</Label> */}
          {/*         <FormControl> */}
          {/*           <Input placeholder="Ваше ім'я" {...field} /> */}
          {/*         </FormControl> */}
          {/*       </FormItem> */}
          {/*     )} */}
          {/*   /> */}
          {/* </div> */}
          {/* <div> */}
          {/*   <FormField */}
          {/*     control={profileForm.control} */}
          {/*     name="lastName" */}
          {/*     render={({ field }) => ( */}
          {/*       <FormItem> */}
          {/*         <Label>Прізвище</Label> */}
          {/*         <FormControl> */}
          {/*           <Input placeholder="Ваше прізвище" {...field} /> */}
          {/*         </FormControl> */}
          {/*       </FormItem> */}
          {/*     )} */}
          {/*   /> */}
          {/* </div> */}
          <div>
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label required requiredPos="right">
                    Email
                  </Label>
                  <FormControl>
                    <Input placeholder="Ваш email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={profileForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label required requiredPos="right">
                    Пароль
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Ваш пароль"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="tw-flex tw-justify-between tw-items-center">
        <Button
          onClick={() => {
            props.onPrev && props.onPrev();
          }}
          variant="light"
        >
          Назад
        </Button>
        <Button onClick={profileForm.handleSubmit(onSubmit)}>Далі</Button>
      </CardFooter>
    </Form>
  );
}
