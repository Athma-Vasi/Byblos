import { AppShell, Space, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { MyFooter } from "../footer";
import { MyHeader } from "../header";
import { MyNavBar } from "../navbar";
import { Sidebar } from "../sidebar";
import { AllActions, AllDispatches, AllStates, Volume } from "../../types";
import React from "react";

const Search = React.lazy(() => import("../search"));

type HomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Home({ children, allStates, allActions, allDispatches }: HomeProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <MyNavBar
          setOpened={setOpened}
          opened={opened}
          allStates={allStates}
          allActions={allActions}
          allDispatches={allDispatches}
        />
      }
      aside={<Sidebar />}
      header={
        <MyHeader
          opened={opened}
          setOpened={setOpened}
          allStates={allStates}
          allActions={allActions}
          allDispatches={allDispatches}
        />
      }
      footer={<MyFooter />}
      data-cy="home-appShell"
    >
      <Outlet />
    </AppShell>
  );
}

export { Home };
