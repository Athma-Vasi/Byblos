import {
  Burger,
  Flex,
  Grid,
  Header,
  MediaQuery,
  Title,
  useMantineTheme,
} from "@mantine/core";

import { Search } from "../search";
import { AllActions, AllDispatches, AllStates } from "../types";

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

  return (
    <Header height={{ base: 75, md: 100 }} p="md">
      <Grid>
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

        <Grid.Col span={3}>
          <Title order={1}>Byblos</Title>
        </Grid.Col>

        <Grid.Col span={5} offset={3}>
          <Search
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Grid.Col>
      </Grid>
    </Header>
  );
}

export { MyHeader };
