import {
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { Fragment, useState } from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ApiResponseVolume,
  Volume,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyPagination } from "../pagination";
import { Search } from "../search";

type DisplayResultsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayResults({
  children,
  allStates,
  allActions,
  allDispatches,
}: DisplayResultsProps) {
  const { width = 0 } = useWindowSize();
  const [modalOpened, setModalOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  //required because id from google books api is not unique
  const modifiedSearchResults = insertCustomId(
    allStates.responseState.searchResults?.items ?? [],
  );

  console.log(" modifiedSearchResults: ", modifiedSearchResults);
  return (
    <Fragment>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <MyModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        src={modalSrc}
        alt={modalAlt}
      />
      <Flex gap="xl" direction="column">
        {modifiedSearchResults.map((item) => (
          <Grid key={item.id} columns={9}>
            <Grid.Col span={width < 992 ? 2 : 1}>
              <Center>
                <Image
                  style={{ cursor: "pointer" }}
                  src={item.volumeInfo.imageLinks?.thumbnail}
                  alt="thumbnail of book cover"
                  onClick={() => {
                    setModalSrc(item.volumeInfo.imageLinks?.thumbnail ?? "");
                    setModalAlt(item.volumeInfo.title);
                    setModalOpened(true);
                  }}
                  withPlaceholder
                  placeholder={<Text align="center">No image available</Text>}
                />
              </Center>
            </Grid.Col>
            <Grid.Col span={width < 992 ? 7 : 8}>
              <Title order={3}>{item.volumeInfo.title}</Title>
              {item.volumeInfo.authors?.map((author) => (
                <Text key={author}>{author}</Text>
              ))}
              <Text>{new Date(item.volumeInfo.publishedDate).getFullYear()}</Text>
              <Text lineClamp={4}>{item.volumeInfo.description}</Text>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <MyPagination
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayResults;

type MyModalProps = {
  children?: React.ReactNode;
  src: string;
  alt: string;
  modalOpened: boolean;
  setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function MyModal({ modalOpened, setModalOpened, src, alt }: MyModalProps) {
  return (
    <Fragment>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="xs">
        <Image src={src} alt={alt} />
      </Modal>
    </Fragment>
  );
}
