import {
  Burger,
  Button,
  Grid,
  Header,
  MediaQuery,
  Popover,
  Switch,
  Text,
  Title,
  Space,
  useMantineTheme,
  Flex,
  TextInput,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

import { Search } from "../search";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  ResponseActions,
  ResponseDispatch,
  ResponseState,
} from "../../types";
import localforage from "localforage";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Fragment, useState } from "react";
import { BsChevronBarDown } from "react-icons/bs";
import axios from "axios";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine, RiSearchEyeLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { responseActions } from "../../state/responseState";
import { GrSearchAdvanced } from "react-icons/gr";
import { MdManageSearch, MdOutlineManageSearch } from "react-icons/md";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [popoverOpened, setPopoverOpened] = useState(false);

  const theme = useMantineTheme();
  const { width = 0 } = useWindowSize();
  const navigate = useNavigate();

  async function handleThemeSwitchClick(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (allStates.themeState.theme === "light") {
      allDispatches.themeDispatch({
        type: allActions.themeActions.setDarkTheme,
        payload: {
          themeState: {
            theme: "dark",
          },
        },
      });
    } else {
      allDispatches.themeDispatch({
        type: allActions.themeActions.setLightTheme,
        payload: {
          themeState: {
            theme: "light",
          },
        },
      });
    }
  }

  async function handleEnterKeyInput(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      //set popover to closed
      setPopoverOpened((open) => !open);

      window.scrollTo(0, 0);

      try {
        const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;
        const { data } = await axios.get(fetchUrlFromGenericSearch);

        allStates.responseState.startIndex = 0;
        allStates.responseState.searchTerm = searchTerm;
        allStates.responseState.searchResults = data as ApiResponseVolume;
        allStates.responseState.fetchUrl = fetchUrlFromGenericSearch;

        //initializes localforage keys to initial responseState values for some, and fetched values for others
        await localforage.setItem("byblos-fetchUrl", fetchUrlFromGenericSearch);
        await localforage.setItem(
          "byblos-searchTerm",
          allStates.responseState.searchTerm
        );
        await localforage.setItem(
          "byblos-searchResults",
          data as ApiResponseVolume
        );
        await localforage.setItem(
          "byblos-selectedVolume",
          allStates.responseState.selectedVolume
        );
        await localforage.setItem(
          "byblos-selectedAuthor",
          allStates.responseState.selectedAuthor
        );
        await localforage.setItem(
          "byblos-selectedPublisher",
          allStates.responseState.selectedPublisher
        );
        allDispatches.responseDispatch({
          type: responseActions.setAll,
          payload: { responseState: allStates.responseState },
        });

        navigate(`/home/displayResults/1`);
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "handleEnterKeyInput()",
        });

        console.group("Error in header search eventHandler");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    }
  }

  const displayOnDesktop = [
    <Grid.Col span={2} style={{ display: `${width < 576 ? "none" : ""}` }}>
      <Link to={"/"}>
        <Title order={1}>Byblos</Title>
      </Link>
    </Grid.Col>,

    <Grid.Col span={width < 768 ? 4 : 5}>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Grid.Col>,
  ];

  const displayOnMobile = (
    <Grid.Col span={6}>
      <Flex direction="row" align="center" justify="center">
        <Popover
          width={350}
          position="bottom"
          withArrow
          shadow="md"
          opened={popoverOpened}
          onChange={setPopoverOpened}
        >
          <Popover.Target>
            <Button variant="subtle">
              <BsChevronBarDown
                size={26}
                onClick={() => setPopoverOpened((open) => !open)}
              />
            </Button>
          </Popover.Target>

          <Popover.Dropdown>
            <Flex gap="md" justify="center" align="center">
              <TextInput
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.currentTarget.value);
                }}
                size="lg"
                rightSection={rightInputSection(
                  searchTerm,
                  setSearchTerm,
                  setPopoverOpened,
                  allStates.responseState,
                  allDispatches.responseDispatch,
                  responseActions
                )}
                rightSectionWidth={100}
                onKeyDown={handleEnterKeyInput}
                data-textinput="search"
                data-autofocus
              />

              <Link
                to={`/home/advancedSearch`}
                style={{
                  textDecoration: "none",
                  color: "GrayText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RiSearchEyeLine
                  size={22}
                  style={{ color: "GrayText" }}
                  onClick={() => {
                    setPopoverOpened((open) => !open);
                    window.scrollTo(0, 0);
                  }}
                />
              </Link>
            </Flex>
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </Grid.Col>
  );

  return (
    <Header height={{ base: 75, md: 100 }} p="md">
      <Grid columns={9} align="center">
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

        {/*  */}
        {width < 576 ? displayOnMobile : displayOnDesktop}
        {/*  */}

        <Grid.Col span={2}>
          <Flex align="center" justify="flex-end">
            <Switch
              size={width < 992 ? "md" : "lg"}
              label={
                width < 576
                  ? ""
                  : `${allStates.themeState.theme[0].toUpperCase()}${allStates.themeState.theme.slice(
                      1
                    )}`
              }
              onChange={handleThemeSwitchClick}
            />
          </Flex>
        </Grid.Col>
      </Grid>
    </Header>
  );
}

function rightInputSection(
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
  responseState: ResponseState,
  responseDispatch: React.Dispatch<ResponseDispatch>,
  responseActions: ResponseActions
) {
  const navigate = useNavigate();

  async function handleSearchIconClick(
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) {
    //set popover to closed
    setPopoverOpened((open) => !open);

    window.scrollTo(0, 0);

    try {
      const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;
      const { data } = await axios.get(fetchUrlFromGenericSearch);

      responseState.startIndex = 0;
      responseState.searchTerm = searchTerm;
      responseState.searchResults = data as ApiResponseVolume;
      responseState.fetchUrl = fetchUrlFromGenericSearch;

      //initializes localforage keys to initial responseState values for some, and fetched values for others
      await localforage.setItem("byblos-fetchUrl", fetchUrlFromGenericSearch);
      await localforage.setItem("byblos-startIndex", 0);
      await localforage.setItem("byblos-searchTerm", responseState.searchTerm);
      await localforage.setItem(
        "byblos-searchResults",
        data as ApiResponseVolume
      );
      await localforage.setItem(
        "byblos-selectedVolume",
        responseState.selectedVolume
      );
      await localforage.setItem(
        "byblos-selectedAuthor",
        responseState.selectedAuthor
      );
      await localforage.setItem(
        "byblos-selectedPublisher",
        responseState.selectedPublisher
      );
      responseDispatch({
        type: responseActions.setAll,
        payload: { responseState },
      });

      navigate(`/home/displayResults/1`);
    } catch (error: any) {
      const error_ = new Error(error, {
        cause: "handleSearchIconClick()",
      });

      console.group("Error in header search rightInputSection() eventHandler");
      console.error("name: ", error_.name);
      console.error("message: ", error_.message);
      console.error("cause: ", error_.cause);
      console.groupCollapsed("stack trace");
      console.trace(error_);
      console.error("detailed stack trace", error_.stack);
      console.groupEnd();
    }
  }

  return (
    <Flex gap="xs">
      {searchTerm === "" ? (
        ""
      ) : (
        <RiCloseLine
          style={{
            color: "GrayText",
            transform: "scale(1.5)",
            cursor: "pointer",
          }}
          onClick={() => {
            setSearchTerm("");
          }}
        />
      )}
      {searchTerm === "" ? (
        ""
      ) : (
        <RxDividerVertical
          style={{ color: "GrayText", transform: "scale(1.5)" }}
        />
      )}
      <CgSearch
        style={{
          color: "GrayText",
          transform: "scale(1.25)",
          cursor: "pointer",
        }}
        onClick={handleSearchIconClick}
      />
    </Flex>
  );
}

export { MyHeader };
