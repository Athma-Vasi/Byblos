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
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{
          position: "relative",
        }}
      >
        <Image
          src={logo_transparent_dark}
          alt="Byblos logo"
          radius="md"
          data-cy="logo-welcome"
          width={
            width < 576 ? 250 : width < 768 ? 350 : width < 992 ? 400 : 500
          }
        />

        <Fragment>
          <Title
            order={width < 576 ? 2 : 1}
            size={width < 576 ? "32px" : width < 768 ? "48px" : "48px"}
            color={allStates.themeState.theme === "light" ? "dark.5" : "gray.5"}
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
            size={width < 576 ? "10px" : width < 768 ? "14px" : "16px"}
            color={allStates.themeState.theme === "light" ? "dark.5" : "gray.5"}
            style={{
              position: "absolute",
              top: "78%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Your library, always open
          </Title>
        </Fragment>
      </Flex>

      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="xs" />
      ))}

      <Flex
        style={{
          width: "100%",
          paddingLeft: "2rem",
          paddingRight: "1rem",
        }}
        justify="center"
        align="center"
      >
        <Search
          allStates={allStates}
          allActions={allActions}
          allDispatches={allDispatches}
        />
      </Flex>

      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="xs" />
      ))}

      <Flex
        direction="column"
        justify="center"
        align="start"
        p={width < 576 ? "2rem" : "3rem"}
      >
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
      </Flex>

      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
    </Flex>
  );
}

export { Welcome };
