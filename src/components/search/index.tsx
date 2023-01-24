import { Flex, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Link } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  Volume,
} from "../types";

///////
type SearchProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};
///////

function Search({
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { width = 0 } = useWindowSize();

  async function handleEnterKeyInput(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      responseState.searchTerm = searchTerm;
      responseDispatch({
        type: responseActions.setSearchTerm,
        payload: {
          responseState,
        },
      });

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`,
      );
      const data: ApiResponseVolume = await response.json();

      responseState.searchResults = data;
      responseDispatch({
        type: responseActions.setSearchResults,
        payload: {
          responseState,
        },
      });

      console.log(responseState.searchResults);
    }
  }

  return (
    <Flex gap="md" justify="flex-end">
      <TextInput
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.currentTarget.value);
        }}
        size={`${width < 576 ? "xs" : width < 768 ? "sm" : width < 992 ? "md" : "lg"}`}
        rightSection={rightInputSection(searchTerm)}
        rightSectionWidth={searchTerm === "" ? 50 : 100}
        onKeyDown={handleEnterKeyInput}
      />
      <Link to={`/home/advancedSearch`}>
        <Text>Advanced Search</Text>
      </Link>
    </Flex>
  );
}

export { Search };

function rightInputSection(searchTerm: string) {
  async function handleSearchIconClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    //
  }

  return (
    <Flex gap="xs">
      {searchTerm === "" ? (
        ""
      ) : (
        <RiCloseLine
          style={{ color: "GrayText", transform: "scale(1.5)", cursor: "pointer" }}
        />
      )}
      {searchTerm === "" ? (
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
