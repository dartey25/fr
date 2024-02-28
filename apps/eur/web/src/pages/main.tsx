import { Card, CardContent } from "@/ui";
import { DataTable } from "../components/eur/data-table";

console.log(import.meta.env);

function Main() {
  return (
    <div className="page-content ">
      <div className="content-wrapper">
        <div className="content-inner">
          <div className="content">
            <Card>
              <div className="page-header page-header-xs">
                <div className="page-header-content header-elements-inline ">
                  <div className="page-title py-3">
                    <h4 className="tw-text-[19px]">
                      <span className="font-weight-semibold">
                        Сертифікати EUR.1
                      </span>
                    </h4>
                  </div>
                </div>
              </div>

              <div className="px-3 text-muted">
                Дозволяє створити, роздрукувати і зробити електронну копію
                заявки на митницю EUR.1 або EUR-MED
              </div>
              <DataTable />
            </Card>
            <Card>
              <CardContent>
                <p>
                  <a
                    href="https://www.mdoffice.com.ua/ua/aMDODocFolder.FindHelp?p_file=101&amp;p_page=2544&amp;p_dlawfld_id=01200102"
                    target="_blank"
                    className="text-primary"
                  >
                    Статтею 544
                  </a>{" "}
                  Митного кодексу України до основних завдань митниці ДФС
                  віднесено <b>видачу</b> у випадках, встановлених чинними
                  міжнародними договорами, сертифікатів походження.
                  <br />
                  Відповідно до міжнародних зобов’язань України (Угода про
                  вільну торгівлю між Україною та державами{" "}
                  <a
                    href="http://www.mdoffice.com.ua/pls/MDOffice/aMDODoc.FindDoc?p_type=7&amp;p_code=240610"
                    target="_blank"
                    className="text-primary"
                  >
                    ЄАВТ,
                  </a>{" "}
                  ратифікованої Законом України від 7 грудня 2011 року{" "}
                  <a
                    href="http://www.mdoffice.com.ua/MDOffice/aMDODoc.FindHelpAdv?p_file=71_878"
                    target="_blank"
                    className="text-primary"
                  >
                    № 4091-VI
                  </a>
                  , Угода про вільну торгівлю між Урядом України та Урядом
                  Чорногорії, ратифікованої Законом України від 16 жовтня 2012
                  року{" "}
                  <a
                    href="http://www.mdoffice.com.ua/MDOffice/aMDODoc.FindHelpAdv?p_file=82_788"
                    target="_blank"
                    className="text-primary"
                  >
                    № 5445-VI
                  </a>
                  ), митниці ДФС з 1 червня 2014 року здійснюють видачу
                  сертифікатів з перевезення форми “EUR.1”.
                  <br />
                  27 червня 2014 року укладено Угоду про асоціацію між Україною,
                  з однієї сторони, та Європейським Союзом, Європейським
                  співтовариством з атомної енергії і їхніми державами-членами,
                  з іншої сторони, ратифіковану Законом України від 16 вересня
                  2014 року{" "}
                  <a
                    href="http://www.mdoffice.com.ua/MDOffice/aMDODoc.FindHelpAdv?p_file=11_6505"
                    target="_blank"
                    className="text-primary"
                  >
                    № 1678-VII
                  </a>{" "}
                  (далі - Угода).
                  <br />З 01 січня 2016 року в рамках цієї Угоди митниці ДФС
                  здійснюють видачу сертифікатів з перевезення форми “EUR.1” при
                  експорті товарів з України до країн ЄС.
                  <br />
                  Сертифікати з перевезення товарів з України за формою “EUR.1”
                  видаються на товари, що експортуються до країн ЄС та які
                  задовольняють вимогам Протоколу 1 до Угоди (Правила
                  походження).
                  <br />
                  Сертифікат з перевезення товарів з України за формою “EUR.1”
                  видається під час або після здійснення експорту товару.{" "}
                  <u>Термін дії сертифіката складає 4 місяці</u>.
                  <br />
                  <a
                    href="https://www.mdoffice.com.ua/ua/aMDODoc.FindDoc?p_type=17&amp;p_code=1390321"
                    target="_blank"
                    className="text-primary"
                  >
                    Наказ Мінфін <b>№ 139 від 02.03.2021</b> "Про затвердження
                    Порядку заповнення та видачі митницею сертифіката з
                    перевезення (походження) товару EUR.1 або EUR-MED"
                  </a>
                  <br />
                  Грузія - СТ-1, EUR.1 на сьогодні.{" "}
                  <a
                    href="https://www.mdoffice.com.ua/ua/aSNewsDic.getNews?dat=27102020&amp;num_c=747499"
                    target="_blank"
                    className="text-primary"
                  >
                    {" "}
                    Митницями Держмитслужби розпочато видачу сертифікатів з
                    перевезення товару EUR.1 на експорт товарів українського
                    походження до Грузії
                  </a>
                  <br />
                  Молдова - СТ-1, EUR.1
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Main };
