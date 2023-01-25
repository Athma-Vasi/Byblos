import { Title } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AllActions, AllDispatches, AllStates } from "../../types";
import { Search } from "../search";

type WelcomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Welcome({ children, allStates, allActions, allDispatches }: WelcomeProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Title order={1} data-cy="welcome-title">
        Byblos
      </Title>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      <Title
        order={3}
      >{`Search the world's most comprehensive list of volumes powered by Google Books`}</Title>
    </div>
  );
}

export { Welcome };
