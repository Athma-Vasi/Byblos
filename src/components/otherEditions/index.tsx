import { Text } from "@mantine/core";
import axios from "axios";
import React, { Suspense } from "react";
import { Fragment, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates, VolumeWithCustomId } from "../../types";
import { insertCustomId } from "../../utils";
import { MyImageModal } from "../myImageModal";
import { MyPagination } from "../pagination";

const DisplayGeneric = React.lazy(() => import("../displayGeneric"));

type OtherEditionsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function OtherEditions({
  children,
  allStates,
  allActions,
  allDispatches,
}: OtherEditionsProps) {
  const {
    responseState: { selectedVolume, fetchUrl },
  } = allStates;

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchOtherEditions = async () => {
      console.log("title:", selectedVolume?.volumeInfo.title);
      try {
        const fetchUrlWithName = `https://www.googleapis.com/books/v1/volumes?q=${selectedVolume?.volumeInfo.title}&+intitle:${selectedVolume?.volumeInfo.title}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        allStates.responseState.fetchUrl = fetchUrlWithName;

        const { data } = await axios.get(fetchUrlWithName);

        console.log("fetchUrl from otherEditions: ", allStates.responseState.fetchUrl);
        console.log("data: ", data);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.otherEditions = itemsWithCustomId;
        allDispatches.responseDispatch({
          type: allActions.responseActions.setAll,
          payload: { responseState: allStates.responseState },
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchOtherEditions();
  }, []);
  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other editions of ${allStates.responseState.selectedVolume}`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other editions of ${allStates.responseState.selectedVolume}`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
            volumes={allStates.responseState.otherEditions ?? []}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default OtherEditions;
