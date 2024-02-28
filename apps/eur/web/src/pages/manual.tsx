import { Card, CardContent, CardHeader, CardTitle, ErrorFallback } from "@/ui";
import { Loader } from "@mdoffice/md-component-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Manual() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["manual_html"],
    queryFn: () =>
      axios
        .get(
          "https://www.mdoffice.com.ua/ua/core.page.manual_api?p_service=eur1",
        )
        .then((res) => res.data),
  });
  return (
    <div className="page-content">
      <div className="content-wrapper">
        <div className="content-inner">
          <div className="content content-boxed">
            <Card className="tw-m-auto tw-max-w-[1085px]">
              <CardHeader>
                <CardTitle className="tw-text-[20px]">
                  Настанова користувача
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isError ? (
                  <ErrorFallback />
                ) : isLoading ? (
                  <Loader />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.data
                        .replace(
                          /".\/ua\//gi,
                          '"https://www.mdoffice.com.ua/ua/',
                        )
                        .replace(/<h1>/gi, '<h1 class="tw-text-[26px]">')
                        .replace(
                          /<h6>/gi,
                          '<h6 class="tw-text-[16px] text-primary tw-my-3">',
                        )
                        .replace(/<td /gi, '<td class="p-0 tw-mr-1" '),
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Manual };
