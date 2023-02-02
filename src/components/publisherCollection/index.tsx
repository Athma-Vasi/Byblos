import { Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";

type PublisherCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function PublisherCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: PublisherCollectionProps) {
  const {
    responseState: { selectedVolume },
  } = allStates;
  const { volumeId } = useParams();

  const [publisherCollection, setPublisherCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchPublisherVolumes = async () => {
      try {
        const fetchUrlWithPublisher = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inpublisher:${selectedVolume?.volumeInfo.publisher}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithPublisher: ", fetchUrlWithPublisher);

        const { data } = await axios.get(fetchUrlWithPublisher);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.publisherCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithPublisher;
        allStates.responseState.activePage = 1;

        try {
          // await localforage
          //   .setItem("byblos-publisherCollection", itemsWithCustomId)
          //   .then((value) => {
          //     setPublisherCollection(value);
          //   });

          await localforage.setItem(
            "byblos-searchResults",
            allStates.responseState.searchResults
          );

          await localforage.setItem(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
          );

          await localforage.setItem(
            "byblos-activePage",
            allStates.responseState.activePage
          );
        } catch (error) {
          console.error(
            "Error saving publisherCollection to localforage: ",
            error
          );
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });

          setPublisherCollection(itemsWithCustomId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPublisherVolumes();
  }, []);

  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other editions of ${
              allStates.responseState.selectedVolume ??
              publisherCollection[0]?.volumeInfo.title ??
              ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other editions of ${
                allStates.responseState.selectedVolume ??
                publisherCollection[0]?.volumeInfo.title ??
                ""
              }`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        parentPath={`/home/displayVolume/${volumeId}/publisherCollection/`}
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default PublisherCollection;
