import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";

import { MyFooter } from "../footer";
import { MyHeader } from "../header";
import { MyNavBar } from "../navbar";
import { Sidebar } from "../sidebar";
import { AllActions, AllDispatches, AllStates, Volume } from "../types";

type HomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Home({ children, allStates, allActions, allDispatches }: HomeProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<MyNavBar opened={opened} />}
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
    >
      {children}
      {allStates.responseState.searchResults?.items.map((item: Volume) => (
        <div key={item.id}>
          <h1>{item.volumeInfo.title}</h1>
          <p>{item.volumeInfo.description}</p>
        </div>
      ))}
    </AppShell>
  );
}

export { Home };
