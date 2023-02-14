import { Flex, Grid, Image, Space, Title } from "@mantine/core";
import React, { Fragment } from "react";
import logo_transparent_dark from "../../../src/assets/logo/logo_transparent.png";

import logo_transparent_light from "../../../src/assets/logo-light/logo_transparent.png";
import { useWindowSize } from "../../hooks/useWindowSize";

import { AllActions, AllDispatches, AllStates } from "../../types";
import ErrorFallback from "../errorFallback";
import MyLoader from "../myLoader";
import { Search } from "../search";

type WelcomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Welcome({ allStates, allActions, allDispatches }: WelcomeProps) {
  const { width = 0 } = useWindowSize();

  let { theme } = allStates.themeState;

  return (
    <Flex direction="column" align="center" justify="center">
      <Grid columns={7}>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Space key={i} h="sm" />
          ))}

          <Flex
            direction="column"
            align="center"
            justify="center"
            style={{ outline: "1px solid GrayText", position: "relative" }}
          >
            <Image
              src={logo_transparent_dark}
              alt="Byblos logo"
              radius="md"
              data-cy="logo-welcome"
            />

            <Fragment>
              <Title
                order={width < 576 ? 2 : 1}
                size={width < 576 ? "20px" : width < 768 ? "32px" : "48px"}
                color={
                  allStates.themeState.theme === "light" ? "dark.5" : "gray.5"
                }
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                Byblos
              </Title>

              <Title
                order={width < 576 ? 4 : 3}
                size={width < 576 ? "7px" : width < 768 ? "12px" : "16px"}
                color={
                  allStates.themeState.theme === "light" ? "dark.5" : "gray.5"
                }
                style={{
                  position: "absolute",
                  top: "77%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                Your library, always open
              </Title>
            </Fragment>
          </Flex>
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
            color={allStates.themeState.theme === "light" ? "dark.5" : "gray.5"}
            data-cy="slogan-welcome"
          >{`Search the world's most comprehensive list of volumes`}</Title>

          <Space h="xs" />

          <Title
            order={5}
            color={allStates.themeState.theme === "light" ? "dark.5" : "gray.5"}
          >
            {" "}
            Powered by Google Books
          </Title>
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
