import { Flex, Grid, Image, Space, Title } from "@mantine/core";
import React from "react";
import main_welcome_logo from "../../assets/library_magnifying_glass_logo.avif";
import { useWindowSize } from "../../hooks/useWindowSize";

import { AllActions, AllDispatches, AllStates } from "../../types";
import { Search } from "../search";

type WelcomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Welcome({
  children,
  allStates,
  allActions,
  allDispatches,
}: WelcomeProps) {
  const { width = 0 } = useWindowSize();
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ outline: "2px solid GrayText" }}
    >
      <Flex direction="row" align="center" justify="center">
        <Title order={1} data-cy="welcome-title" size="4rem">
          Byblos
        </Title>
      </Flex>

      <Grid columns={7}>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={3}>
          <Image src={main_welcome_logo} alt="Byblos logo" radius="md" />
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>

      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="sm" />
      ))}

      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />

      <Space h="lg" />

      <Grid columns={width < 992 ? 7 : 11}>
        <Grid.Col span={1}></Grid.Col>
        <Grid.Col span={width < 992 ? 5 : 9}>
          <Title
            order={3}
          >{`Search the world's most comprehensive list of volumes powered by Google Books`}</Title>
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
      </Grid>

      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
    </Flex>
  );
}

export { Welcome };
