import { AllStates, AllActions, AllDispatches } from "../../types";

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
  return <div>AuthorCollection</div>;
}

export default AuthorCollection;
