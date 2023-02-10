import {
  Burger,
  Button,
  Grid,
  Header,
  MediaQuery,
  Switch,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";

import { Search } from "../search";
import { AllActions, AllDispatches, AllStates } from "../../types";
import localforage from "localforage";

type MyHeaderProps = {
  children?: React.ReactNode;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyHeader({
  opened,
  setOpened,
  allStates,
  allActions,
  allDispatches,
}: MyHeaderProps) {
  const theme = useMantineTheme();

  return (
    <Header height={{ base: 75, md: 100 }} p="md">
      <Grid columns={6} align="center">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Grid.Col span={1}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="sm"
            />
          </Grid.Col>
        </MediaQuery>

        <Grid.Col span={1}>
          <Link to={"/"}>
            <Title order={1}>Byblos</Title>
          </Link>
        </Grid.Col>

        <Grid.Col span={3}>
          <Search
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Grid.Col>

        <Grid.Col span={1}>
          <Switch label="theme" />
        </Grid.Col>
      </Grid>
    </Header>
  );
}

export { MyHeader };
