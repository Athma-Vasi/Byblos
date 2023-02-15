import { Button, Flex, Footer, Space, Text } from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { AllActions, AllDispatches, AllStates } from "../../types";

type MyFooterProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyFooter({ allStates }: MyFooterProps) {
  const [isFooterVisible, setIsFooterVisible] = useState<boolean | null>(null);

  const {
    themeState: { theme },
  } = allStates;

  useEffect(() => {
    const fetchFooterVisibility = async () => {
      try {
        const footerVisibility = await localforage.getItem("byblos-footer");

        if (footerVisibility === "hidden") setIsFooterVisible(false);
        else setIsFooterVisible(true);
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "fetchFooterVisibility()",
        });

        console.group("Error in footer useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchFooterVisibility();
  }, []);

  async function handleFooterHideBttnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    try {
      setIsFooterVisible(false);

      await localforage.setItem("byblos-footer", "hidden");
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleFooterHideBttnClick()",
      });

      console.group("Error in footer eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  return isFooterVisible ? (
    <Footer height={60} px="md" py="xs">
      <Flex direction="row" justify="space-evenly" align="center">
        <Text color={theme === "light" ? "dark.5" : "gray.5"}>Made by</Text>
        <Button variant="subtle">
          <a
            href="https://github.com/Athma-Vasi"
            target="_blank"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Athma Vasi
          </a>
        </Button>

        <Text color={theme === "light" ? "dark.5" : "gray.5"}>
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

        <Button variant="light" onClick={handleFooterHideBttnClick}>
          Hide
        </Button>
      </Flex>
    </Footer>
  ) : (
    <Fragment />
  );
}

export default MyFooter;
