import { Container, Flex, TextInput, useMantineTheme } from "@mantine/core";
import { Fragment, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  Volume,
} from "../types";

type SearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Search({
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: SearchProps) {
  const [search, setSearch] = useState("");
  const { width = 0 } = useWindowSize();
  const theme = useMantineTheme();

  async function handleEnterKeyInput(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      responseState.searchTerm = search;
      responseDispatch({
        type: responseActions.setSearchTerm,
        payload: {
          responseState,
        },
      });

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${search}`,
      );
      const data: ApiResponseVolume = await response.json();

      responseState.searchResults = data;
      responseDispatch({
        type: responseActions.setSearchResults,
        payload: {
          responseState,
        },
      });

      console.log(responseState.searchResults.items);
    }
  }

  return (
    <Flex gap="md" justify="flex-end">
      <TextInput
        value={search}
        onChange={(event) => {
          setSearch(event.currentTarget.value);
        }}
        size={`${width < 576 ? "xs" : width < 768 ? "sm" : width < 992 ? "md" : "lg"}`}
        rightSection={rightInputSection(search)}
        rightSectionWidth={search === "" ? 50 : 100}
        onKeyDown={handleEnterKeyInput}
      />
    </Flex>
  );
}

export { Search };

function rightInputSection(search: string) {
  async function handleSearchIconClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    //
  }

  return (
    <Flex gap="sm">
      {search === "" ? (
        ""
      ) : (
        <RiCloseLine
          style={{ color: "GrayText", transform: "scale(1.5)", cursor: "pointer" }}
        />
      )}
      {search === "" ? (
        ""
      ) : (
        <RxDividerVertical style={{ color: "GrayText", transform: "scale(1.5)" }} />
      )}
      <CgSearch
        style={{ color: "GrayText", transform: "scale(1.25)", cursor: "pointer" }}
        onClick={handleSearchIconClick}
      />
    </Flex>
  );
}
