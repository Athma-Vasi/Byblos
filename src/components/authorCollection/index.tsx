import { Text } from "@mantine/core";
import axios from "axios";
import { Fragment, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useWindowSize } from "../../hooks/useWindowSize";
import { AllActions, AllDispatches, AllStates } from "../../types";
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

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchAuthorCollection = async () => {
      console.log("author:", selectedVolume?.volumeInfo.authors[0]);
      try {
        const fetchUrlWithAuthor = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inauthor:${selectedVolume?.volumeInfo.authors[0]}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        allStates.responseState.authorCollection = itemsWithCustomId;
        allDispatches.responseDispatch({
          type: allActions.responseActions.setAll,
          payload: { responseState: allStates.responseState },
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthorCollection();
  }, []);
  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other volumes of ${allStates.responseState.selectedAuthor}`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other volumes of ${allStates.responseState.selectedAuthor}`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
            volumes={allStates.responseState.authorCollection ?? []}
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
