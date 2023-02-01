import { Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates, VolumeWithCustomId } from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";

type AuthorCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function AuthorCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: AuthorCollectionProps) {
  const {
    responseState: { selectedVolume },
  } = allStates;
  const [authorCollection, setAuthorCollection] = useState<VolumeWithCustomId[]>([]);

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchAuthorCollection = async () => {
      console.log("author:", selectedVolume?.volumeInfo.authors[0]);
      try {
        const fetchUrlWithAuthor = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inauthor:${selectedVolume?.volumeInfo.authors[0]}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.authorCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithAuthor;

        try {
          localforage
            .setItem("byblos-authorCollection", itemsWithCustomId)
            .then((value) => {
              setAuthorCollection(value);
            });

          localforage.setItem(
            "byblos-searchResults",
            allStates.responseState.searchResults,
          );

          localforage.setItem("byblos-fetchUrl", fetchUrlWithAuthor);
        } catch (error) {
          console.error("Error saving authorCollection to localforage: ", error);
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });
        }
      } catch (error) {
        console.error("Error fetching author collection", error);
      }
    };

    fetchAuthorCollection();
  }, []);

  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other volumes of ${
              allStates.responseState.selectedAuthor ??
              authorCollection[0]?.volumeInfo.authors[0] ??
              ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other volumes of ${
                allStates.responseState.selectedAuthor ??
                authorCollection[0]?.volumeInfo.authors[0] ??
                ""
              }`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
            volumes={allStates.responseState.authorCollection ?? authorCollection}
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

export default AuthorCollection;
