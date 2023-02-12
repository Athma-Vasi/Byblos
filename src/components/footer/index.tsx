import { Button, Flex, Footer, Space, Text } from "@mantine/core";
import { AllActions, AllDispatches, AllStates } from "../../types";

type MyFooterProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyFooter({
  children,
  allStates,
  allActions,
  allDispatches,
}: MyFooterProps) {
  const {
    themeState: { theme },
  } = allStates;

  return (
    <Footer height={60} p="md">
      <Flex direction="row" justify="center" align="center">
        <Text color={theme === "light" ? "dark.6" : "gray.5"}>
          Made by
          <Button variant="subtle">
            <a
              href="https://github.com/Athma-Vasi"
              target="_blank"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Athma Vasi
            </a>
          </Button>
        </Text>

        <Space w="xl" />

        <Text color={theme === "light" ? "dark.6" : "gray.5"}>
          <Button variant="subtle">
            <a
              href="https://github.com/Athma-Vasi/Byblos"
              target="_blank"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              View code
            </a>
          </Button>
        </Text>
      </Flex>
    </Footer>
  );
}

export { MyFooter };
