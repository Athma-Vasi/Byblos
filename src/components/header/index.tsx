import {
  Burger,
  Button,
  Flex,
  Grid,
  Header,
  MediaQuery,
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
  children,
  opened,
  setOpened,
  allStates,
  allActions,
  allDispatches,
}: MyHeaderProps) {
  const theme = useMantineTheme();

  async function handleClearLocalStorageBttnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    localforage.clear();
  }

  return (
    <Header height={{ base: 75, md: 100 }} p="md">
      <Grid columns={4}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Grid.Col span={1}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </Grid.Col>
        </MediaQuery>

        <Grid.Col span={2}>
          <Link to={"/"}>
            <Title order={1}>Byblos</Title>
          </Link>
        </Grid.Col>

        <Grid.Col span={1}>
          <Button onClick={handleClearLocalStorageBttnClick}>Clear Local Storage</Button>
        </Grid.Col>
      </Grid>
    </Header>
  );
}

export { MyHeader };
