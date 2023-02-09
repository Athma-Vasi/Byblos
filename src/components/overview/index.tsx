import {
  Card,
  Grid,
  Space,
  Container,
  Text,
  Image,
  Flex,
  Button,
} from "@mantine/core";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { AiOutlineAmazon, AiFillBook, AiOutlineGoogle } from "react-icons/ai";
import { BiBookReader } from "react-icons/bi";
import { IoReaderOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { getLanguageFromCode } from "../../utils";
import { useNavigate } from "react-router-dom";

type OverviewProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Overview({
  children,
  allStates,
  allActions,
  allDispatches,
}: OverviewProps) {
  const {
    responseState: {
      fetchUrl,
      searchTerm,
      searchResults,
      selectedVolume,
      selectedAuthor,
      selectedPublisher,
    },
  } = allStates;
  const { responseDispatch } = allDispatches;
  const {
    responseActions: {
      setFetchUrl,
      setSearchTerm,
      setSearchResults,
      setSelectedVolume,
      setSelectedAuthor,
      setSelectedPublisher,
    },
  } = allActions;

  const navigate = useNavigate();
  const { width = 0 } = useWindowSize();

  console.log("selectedVolume from overview", selectedVolume);

  const [selectedVolumeForage, setSelectedVolumeForage] =
    useState<VolumeWithCustomId | null>(null);

  useEffect(() => {
    const fetchSelectedVolumeFromLocalForage = async () => {
      try {
        await localforage
          .getItem<ResponseState["selectedVolume"]>("byblos-selectedVolume")
          .then((value) => {
            if (value) {
              setSelectedVolumeForage(value);
            }
          });

        console.log("selectedVolumeForage from overview", selectedVolumeForage);
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "fetchSelectedVolumeFromLocalForage()",
        });

        console.group("Error in overview useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchSelectedVolumeFromLocalForage();
  }, []);

  const imageSrc =
    selectedVolume?.volumeInfo.imageLinks?.thumbnail ??
    selectedVolumeForage?.volumeInfo.imageLinks?.thumbnail ??
    "";
  const imageAlt = selectedVolume
    ? selectedVolume?.volumeInfo.title
      ? `thumbnail of ${selectedVolume?.volumeInfo.title}`
      : "thumbnail unavailable"
    : selectedVolumeForage?.volumeInfo.title
    ? `thumbnail of ${selectedVolumeForage?.volumeInfo.title}`
    : "thumbnail unavailable";

  const industryIdentifiers = selectedVolume
    ? selectedVolume?.volumeInfo?.industryIdentifiers?.map((id) => (
        <Text key={id?.identifier}>
          {id?.type?.includes("ISBN")
            ? `${id?.type?.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id?.identifier?.toLowerCase().includes(":")
            ? id?.identifier?.split(":")[1]
            : id?.identifier?.toLowerCase()}
          <Space h="xs" />
        </Text>
      ))
    : selectedVolumeForage?.volumeInfo?.industryIdentifiers?.map((id) => (
        <Text key={id?.identifier}>
          {id?.type?.includes("ISBN")
            ? `${id?.type?.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id?.identifier?.toLowerCase().includes(":")
            ? id?.identifier?.split(":")[1]
            : id?.identifier?.toLowerCase()}
          <Space h="xs" />
        </Text>
      ));

  const publishedDate = selectedVolume
    ? Number.isNaN(
        new Date(selectedVolume?.volumeInfo?.publishedDate ?? "").getFullYear()
      )
      ? "Unavailable"
      : new Date(selectedVolume?.volumeInfo?.publishedDate ?? "")
          .getFullYear()
          .toString()
    : Number.isNaN(
        new Date(
          selectedVolumeForage?.volumeInfo?.publishedDate ?? ""
        ).getFullYear()
      )
    ? "Unavailable"
    : new Date(selectedVolumeForage?.volumeInfo?.publishedDate ?? "")
        .getFullYear()
        .toString();

  const publisher = selectedVolume
    ? selectedVolume?.volumeInfo.publisher ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.publisher ?? "Unavailable";

  const pageCount = selectedVolume
    ? selectedVolume?.volumeInfo.pageCount ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.pageCount ?? "Unavailable";

  const authors = selectedVolume
    ? selectedVolume?.volumeInfo.authors?.join(", ") ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.authors?.join(", ") ?? "Unavailable";

  const printType = selectedVolume
    ? `${selectedVolume?.volumeInfo?.printType.slice(
        0,
        1
      )}${selectedVolume?.volumeInfo.printType.toLowerCase().slice(1)}` ??
      "Unavailable"
    : `${selectedVolumeForage?.volumeInfo?.printType.slice(
        0,
        1
      )}${selectedVolumeForage?.volumeInfo.printType.toLowerCase().slice(1)}` ??
      "Unavailable";

  const categories = selectedVolume
    ? selectedVolume?.volumeInfo.categories?.join(", ") ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.categories?.join(", ") ?? "Unavailable";

  const language = selectedVolume
    ? getLanguageFromCode(selectedVolume?.volumeInfo.language) ?? "Unavailable"
    : getLanguageFromCode(selectedVolumeForage?.volumeInfo.language ?? "") ??
      "Unavailable";

  const averageRating = selectedVolume
    ? selectedVolume?.volumeInfo.averageRating ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.averageRating ?? "Unavailable";

  const ratingsCount = selectedVolume
    ? selectedVolume?.volumeInfo.ratingsCount ?? "Unavailable"
    : selectedVolumeForage?.volumeInfo.ratingsCount ?? "Unavailable";

  const maturityRating = selectedVolume
    ? `${selectedVolume?.volumeInfo.maturityRating.slice(
        0,
        1
      )}${selectedVolume?.volumeInfo.maturityRating
        .toLowerCase()
        .split("_")
        .join(" ")
        .slice(1)}` ?? "Unavailable"
    : `${selectedVolumeForage?.volumeInfo.maturityRating.slice(
        0,
        1
      )}${selectedVolumeForage?.volumeInfo.maturityRating
        .toLowerCase()
        .split("_")
        .join(" ")
        .slice(1)}` ?? "Unavailable";

  const amazonLink = selectedVolume
    ? `https://www.amazon.ca/gp/search?index=books&keywords=${
        selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier
          : selectedVolume?.volumeInfo.title
      }`
    : `https://www.amazon.ca/gp/search?index=books&keywords=${
        selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]
              ?.identifier
          : selectedVolumeForage?.volumeInfo.title
      }`;

  const chaptersLink = selectedVolume
    ? `https://www.chapters.indigo.ca/en-ca/books/product/${
        selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolume?.volumeInfo?.industryIdentifiers?.[0]?.identifier
          : selectedVolume?.volumeInfo.title
      }-item.html?s_campaign=Google_BookSearch_organic`
    : `https://www.chapters.indigo.ca/en-ca/books/product/${
        selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]?.identifier.includes(
          "ISBN"
        )
          ? selectedVolumeForage?.volumeInfo?.industryIdentifiers?.[0]
              ?.identifier
          : selectedVolumeForage?.volumeInfo.title
      }-item.html?s_campaign=Google_BookSearch_organic`;

  const googleBooksLink = selectedVolume
    ? selectedVolume?.volumeInfo.canonicalVolumeLink
    : selectedVolumeForage?.volumeInfo.canonicalVolumeLink;

  const googleBooksPreview = selectedVolume
    ? selectedVolume?.volumeInfo.previewLink
    : selectedVolumeForage?.volumeInfo.previewLink;

  const googleBooksEpub = selectedVolume
    ? selectedVolume?.accessInfo?.epub?.isAvailable
      ? selectedVolume?.accessInfo?.epub?.acsTokenLink
      : "Unavailable"
    : selectedVolumeForage?.accessInfo?.epub?.isAvailable
    ? selectedVolumeForage?.accessInfo?.epub?.acsTokenLink
    : "Unavailable";

  const googleBooksWebReader = selectedVolume
    ? selectedVolume?.accessInfo?.webReaderLink
    : selectedVolumeForage?.accessInfo?.webReaderLink;

  return (
    <div>
      <Text align="start" size="lg">
        About this edition
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Grid columns={width < 576 ? 1 : 3}>
          <Grid.Col span={1}>
            <Image
              width={width < 576 ? "50%" : "75%"}
              src={imageSrc}
              alt={imageAlt}
              radius="xs"
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <Grid columns={width < 576 ? 2 : 1}>
              <Grid.Col span={1}>
                {industryIdentifiers}
                <Text>
                  Published: {publishedDate}
                  <Space h="xs" />
                </Text>
              </Grid.Col>

              <Grid.Col span={1}>
                <Text>
                  Publisher: {publisher}
                  <Space h="xs" />
                </Text>
                <Text>
                  Pages: {pageCount}
                  <Space h="xs" />
                </Text>
                <Text>
                  Author: {authors}
                  <Space h="xs" />
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={1}>
            <Grid columns={width < 576 ? 2 : 1}>
              <Grid.Col span={1}>
                <Text>
                  Print type: {printType}
                  <Space h="xs" />
                </Text>
                <Text>
                  Categories: {categories}
                  <Space h="xs" />
                </Text>
                <Text>
                  Language: {language}
                  <Space h="xs" />
                </Text>
              </Grid.Col>

              <Grid.Col span={1}>
                <Text>
                  Average rating: {averageRating}
                  <Space h="xs" />
                </Text>
                <Text>
                  Ratings count: {ratingsCount}
                  <Space h="xs" />
                </Text>
                <Text>
                  Maturity rating: {maturityRating}
                  <Space h="xs" />
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Card>

      <Space h="lg" />
      <Space h="lg" />

      <Text align="start" size="lg">
        Get book
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <AiOutlineAmazon size={50} />
            <Space w="xl" />
            <Text>Amazon.ca</Text>
          </Flex>

          <a href={amazonLink} target="_blank">
            <Button variant="outline" radius="lg">
              {" "}
              Search Amazon.ca
            </Button>
          </a>
        </Flex>

        <Space h="sm" />

        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <AiFillBook size={50} />
            <Space w="xl" />
            <Text>Chapters Indigo</Text>
          </Flex>

          <a href={chaptersLink} target="_blank">
            <Button variant="outline" radius="lg">
              {" "}
              Search Chapters Indigo
            </Button>
          </a>
        </Flex>

        <Space h="sm" />

        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <AiOutlineGoogle size={50} />
            <Space w="xl" />
            <Text>Google Books</Text>
          </Flex>

          <a href={googleBooksLink} target="_blank">
            <Button variant="outline" radius="lg">
              {" "}
              Search Google Books
            </Button>
          </a>
        </Flex>
      </Card>

      <Space h="lg" />
      <Space h="lg" />

      <Text align="start" size="lg">
        Previews
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Text>{"Google Books (may require authorization)"}</Text>

        <Space h="sm" />

        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <BiBookReader size={50} />
            <Space w="xl" />
            <Text>Sample preview</Text>
          </Flex>

          <a href={googleBooksPreview} target="_blank">
            <Button variant="outline" radius="xl">
              View sample preview online
            </Button>
          </a>
        </Flex>

        <Space h="sm" />

        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <HiOutlineBookOpen size={50} />
            <Space w="xl" />
            <Text>Web reader</Text>
          </Flex>

          <a href={googleBooksWebReader} target="_blank">
            <Button variant="outline" radius="xl">
              View sample using Google's web reader
            </Button>
          </a>
        </Flex>

        <Space h="sm" />

        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{ outline: "1px solid GrayText" }}
          >
            <IoReaderOutline size={50} />
            <Space w="xl" />
            <Text>Epub sample</Text>
          </Flex>

          <a href={googleBooksEpub} target="_blank">
            <Button variant="outline" radius="xl">
              Free epub sample download
            </Button>
          </a>
        </Flex>
      </Card>
    </div>
  );
}

export default Overview;
