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
  Image,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import logo_transparent from "../../../src/assets/logo/logo_transparent.png";

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

  const { themeState } = allStates;

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
        const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=${
          import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        }`;
        const { data } = await axios.get(fetchUrlFromGenericSearch);

        allStates.responseState.startIndex = 0;
        allStates.responseState.searchTerm = searchTerm;
        allStates.responseState.searchResults = data as ApiResponseVolume;

        //initializes localforage keys to initial responseState values for some, and fetched values for others
        await localforage.setItem<ResponseState["startIndex"]>(
          "byblos-startIndex",
          allStates.responseState.startIndex
        );

        await localforage.setItem<ResponseState["searchTerm"]>(
          "byblos-searchTerm",
          allStates.responseState.searchTerm
        );
        await localforage.setItem<ResponseState["searchResults"]>(
          "byblos-searchResults",
          data as ApiResponseVolume
        );

        allDispatches.responseDispatch({
          type: responseActions.setAll,
          payload: { responseState: { ...allStates.responseState } },
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
    <Grid.Col span={3} style={{ display: `${width < 576 ? "none" : ""}` }}>
      <Link to={"/"}>
        <Image
          src={logo_transparent}
          alt="Byblos logo"
          width={width < 992 ? 50 : 75}
          data-cy="logo-header"
        />
      </Link>
    </Grid.Col>,

    <Grid.Col span={width < 768 ? 3 : 4}>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Grid.Col>,
  ];

  const displayOnMobile = (
    <Grid.Col span={6}>
      <Flex direction="row" align="center" justify="space-evenly">
        <Link to={`/`}>
          <Image
            src={logo_transparent}
            alt="Byblos logo"
            width={50}
            height={50}
            data-cy="logo-header"
          />
        </Link>
        <Popover
          width={350}
          position="bottom"
          withArrow
          shadow="md"
          opened={popoverOpened}
          onChange={setPopoverOpened}
          data-cy="dropdownArrow"
        >
          <Popover.Target>
            <Button variant="subtle" data-cy="dropdownArrow-button">
              <BsChevronBarDown
                size={26}
                onClick={() => setPopoverOpened((open) => !open)}
                data-cy="dropdownArrow-icon"
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
                data-cy="searchInput-mobile"
                data-autofocus
                color={themeState.theme === "light" ? "dark.6" : "gray.5"}
                style={{
                  color: "GrayText",
                }}
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
              data-cy="burger-header"
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
              onChange={handleThemeSwitchClick}
              data-cy="themeSwitch"
            />
            <Space w="sm" />
            <Text color={themeState.theme === "light" ? "dark.6" : "gray.5"}>
              {width < 576
                ? ""
                : `${allStates.themeState.theme[0].toUpperCase()}${allStates.themeState.theme.slice(
                    1
                  )}`}
            </Text>
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
      const fetchUrlFromGenericSearch = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40&startIndex=0&key=${
        import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      }`;
      const { data } = await axios.get(fetchUrlFromGenericSearch);

      responseState.startIndex = 0;
      responseState.searchTerm = searchTerm;
      responseState.searchResults = data as ApiResponseVolume;

      //initializes localforage keys to initial responseState values for some, and fetched values for others
      await localforage.setItem<ResponseState["startIndex"]>(
        "byblos-startIndex",
        responseState.startIndex
      );

      await localforage.setItem<ResponseState["searchTerm"]>(
        "byblos-searchTerm",
        responseState.searchTerm
      );

      await localforage.setItem<ResponseState["searchResults"]>(
        "byblos-searchResults",
        data as ApiResponseVolume
      );

      responseDispatch({
        type: responseActions.setAll,
        payload: { responseState: { ...responseState } },
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
