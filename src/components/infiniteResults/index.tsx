import { useInView } from "react-intersection-observer";
import DisplayGeneric from "../displayGeneric";

type InfiniteResultsProps = {};

function InfiniteResults({}: InfiniteResultsProps) {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  return <div ref={ref}></div>;
}

export default InfiniteResults;
