import { Button, CardContent, CardFooter } from "@/ui";
import { TTabProps } from "./license";

export function Confirmation(props: TTabProps) {
  return (
    <>
      <CardContent className="tw-px-8">
        <div className="tw-space-y-4">
          <h3 className="tw-font-medium">Підтвердження</h3>
          <table className="tw-w-full tw-text-left">
            <thead>
              <tr>
                <th className="tw-text-gray-600 tw-text-xs tw-uppercase tw-font-medium">
                  Поле
                </th>
                <th className="tw-text-gray-600 tw-text-xs tw-uppercase tw-font-medium">
                  Інформація
                </th>
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-gray-200">
              <tr>
                <td className="tw-py-3 tw-pt-5 tw-pr-3">Імя</td>
                <td className="tw-py-3 tw-pt-5 tw-select-text">
                  {props.values?.profile?.firstName}
                </td>
              </tr>
              <tr>
                <td className="tw-py-3 tw-pr-3">Прізвище</td>
                <td className="tw-py-3 tw-select-text">
                  {props.values?.profile?.lastName}
                </td>
              </tr>
              <tr>
                <td className="tw-py-3 tw-pr-3">Email</td>
                <td className="tw-py-3 tw-select-text">
                  {props.values?.profile?.email}
                </td>
              </tr>
              <tr>
                <td className="tw-py-3 tw-pr-3">Ключ ліцензії</td>
                <td className="tw-py-3 tw-select-text">
                  {props.values?.license?.token}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="tw-flex tw-items-center tw-justify-between">
        <Button
          onClick={() => props.onPrev && props.onPrev()}
          disabled={props.loading}
          variant="light"
        >
          Назад
        </Button>
        <Button disabled={props.loading}>Підтвердити</Button>
      </CardFooter>
    </>
  );
}
