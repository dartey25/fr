import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import * as pkg from "../../../server/package.json";
import { useAuth } from "../store/auth";
import { Icon } from "@iconify/react";
import { useConfig } from "../store/config";

type TConfig = {
  database: { type: string };
  application: {
    version: string;
    state: "Alpha" | "Beta" | "Stable";
    date: string;
  };
};

function formatDbProvider(provider?: string): string {
  if (!provider) {
    return "No provider";
  }

  if (/postgres.*/gi.test(provider)) {
    return "PostgreSQL";
  }

  if (/mysql/gi.test(provider)) {
    return "MySQL";
  }

  if (/sqlite/gi.test(provider)) {
    return "SQLite";
  }

  return "Provider failed to define";
}

function StateBadge(props: { version: string }) {
  if (import.meta.env.MODE !== "production") {
    return <Badge className="tw-bg-red-500 tw-relative -tw-top-2">Dev</Badge>;
  }

  const versionSplit = props.version.split(".");
  const major = parseInt(versionSplit[0]);
  const minor = parseInt(versionSplit[1]);

  if (major > 0) {
    return undefined;
  }

  if (minor > 0) {
    return (
      <Badge className="tw-bg-amber-500 tw-relative -tw-top-2">Beta</Badge>
    );
  }

  return <Badge className="tw-bg-red-500 tw-relative -tw-top-2">Alpha</Badge>;
}

export function Navbar(props: { config?: TConfig }) {
  const appVersion = pkg.version;
  let appDate;
  try {
    appDate = props.config?.application.date
      ? format(new Date(props.config?.application.date), "dd.MM.yyyy")
      : undefined;
  } catch {
    (() => {})();
  }

  const user = useAuth((s) => s.user);
  const database = useConfig((s) => s.database);
  return (
    <div className="tw-w-full">
      <div className="navbar navbar-dark navbar-expand-lg" data-service="eur1">
        <div className="navbar-brand d-none d-sm-inline-block">
          <Link to="/" className="d-inline-block" aria-label="Додому">
            <img src="/bar_logo.png" alt="" />
          </Link>
        </div>
        <div className="navbar-text wmin-200 py-1">
          <Link to="/" className="d-inline-block">
            MD EUR.1 Extended
            {database?.provider ? (
              <span
                className="tw-text-gray-300"
                title={`Використовуваний провайдер бази даних: ${formatDbProvider(
                  database?.provider,
                )}`}
              >
                {" "}
                [ {formatDbProvider(database?.provider)} ]
              </span>
            ) : (
              ""
            )}
            <StateBadge version={appVersion} />
          </Link>
          <div className="text-grey-300 font-size-xs">
            {appVersion ? `v. ${appVersion}` : ""}{" "}
            {appDate ? `вiд ${appDate}` : ""}
          </div>
        </div>
        <div className="d-lg-none">
          <button type="button" className="navbar-toggler">
            <i className="icon-paragraph-justify3"></i>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbar-mobile">
          <ul className="navbar-nav ml-md-auto">
            <li className="nav-item dropdown">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="navbar-nav-link dropdown-toggle"
                    title="Інформація"
                  >
                    <i className="icon-info22"></i>
                    <span className="d-lg-none ml-2">Інформація</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-fit">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="dropdown-item"
                      title="Настанова користувача"
                      asChild
                    >
                      <Link to={"/manual"}>Настанова користувача</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="dropdown-item"
                      title="Порядок заповнення"
                      asChild
                    >
                      <a
                        href={
                          "https://www.mdoffice.com.ua/ua/aMDODoc.FindDoc?p_type=17&p_code=9501117"
                        }
                        target="_blank"
                      >
                        Порядок заповнення
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="dropdown-item"
                      title="Форум"
                      asChild
                    >
                      <a
                        href={
                          "https://mdoffice.com.ua/ua/aMDOSForum.ForumByTypes?category=195"
                        }
                        target="_blank"
                      >
                        Форум
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="dropdown-item"
                      title="Заявка на доопрацювання"
                      asChild
                    >
                      <a
                        href={
                          "https://mdoffice.com.ua/ua/aMDOForumPO.Request?p_prog=eurex"
                        }
                        target="_blank"
                      >
                        Заявка на доопрацювання
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li
              className="nav-item dropdown"
              id="news-list"
              data-service="eur1"
              data-last-news="2023-06-26 14:47:06"
            >
              <a
                href="#"
                className="navbar-nav-link dropdown-toggle caret-0"
                data-toggle="dropdown"
                data-bs-toggle="dropdown"
                title="Новини сервісу"
              >
                <i className="icon-history"></i>
                <span className="d-lg-none ml-2">Новини</span>
                <span className="badge badge-mark bg-warning-300 border-warning-300 ml-auto ml-xl-2 d-none"></span>
              </a>
            </li>
            <li className="nav-item">
              <Link
                to={"/settings/database"}
                className="navbar-nav-link "
                title="Налаштування бази даних"
              >
                <Icon icon="mdi:database-cog" width={23} height={23} />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={"/settings"}
                className="navbar-nav-link"
                title="Кабінет"
                onClick={(ev) => ev.preventDefault()}
              >
                <i className="icon-user"></i>
                <span className="d-lg-none d-lg-inline-block ml-2">
                  {user?.username ?? user?.email ?? "Користувач"}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
