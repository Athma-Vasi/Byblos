import { Card, Grid, Space, Container, Text, Image } from "@mantine/core";
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
  const { width = 0 } = useWindowSize();
  const selectedVolume = allStates.responseState.selectedVolume;

  const [selectedVolumeForage, setSelectedVolumeForage] =
    useState<VolumeWithCustomId | null>(null);

  useEffect(() => {
    const fetchSelectedVolumeFromLocalForage = async () => {
      try {
        localforage
          .getItem<ResponseState["selectedVolume"]>("byblos-selectedVolume")
          .then((value) => {
            if (value) {
              setSelectedVolumeForage(value);
            }
          });
      } catch (error) {
        console.error(error);
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
    ? selectedVolume?.volumeInfo.industryIdentifiers?.map((id) => (
        <Text key={id.identifier}>
          {id.type.includes("ISBN")
            ? `${id.type.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id.identifier.toLowerCase().includes(":")
            ? id.identifier.split(":")[1]
            : id.identifier.toLowerCase()}
          <Space h="xs" />
        </Text>
      ))
    : selectedVolumeForage?.volumeInfo.industryIdentifiers?.map((id) => (
        <Text key={id.identifier}>
          {id.type.includes("ISBN")
            ? `${id.type.split("_").join("-")}`
            : "Other"}
          :{" "}
          {id.identifier.toLowerCase().includes(":")
            ? id.identifier.split(":")[1]
            : id.identifier.toLowerCase()}
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
    ? `https://www.amazon.ca/gp/search?index=books&keywords=${selectedVolume?.volumeInfo.industryIdentifiers[0].identifier}`
    : `https://www.amazon.ca/gp/search?index=books&keywords=${selectedVolumeForage?.volumeInfo.industryIdentifiers[0].identifier}`;

  const chaptersLink = selectedVolume
    ? `https://www.chapters.indigo.ca/en-ca/books/product/${selectedVolume?.volumeInfo.industryIdentifiers[0].identifier}-item.html?s_campaign=Google_BookSearch_organic`
    : `https://www.chapters.indigo.ca/en-ca/books/product/${selectedVolumeForage?.volumeInfo.industryIdentifiers[0].identifier}-item.html?s_campaign=Google_BookSearch_organic`;

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
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Image
                width={width < 576 ? "50%" : "75%"}
                src={imageSrc}
                alt={imageAlt}
              />
            </Card.Section>
          </Grid.Col>

          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              {industryIdentifiers}
              <Text>
                Published: {publishedDate}
                <Space h="xs" />
              </Text>
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
            </Card.Section>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
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
            </Card.Section>
          </Grid.Col>
        </Grid>
      </Card>

      <Space h="lg" />
      <Space h="lg" />

      <Text align="start" size="lg">
        Get book
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Grid columns={width < 576 ? 1 : 2}>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Container>
                <AiOutlineAmazon size={50} />
                <Text>Amazon.ca</Text>
                <a href={amazonLink}>Search Amazon.ca</a>
              </Container>

              <Container>
                <AiFillBook size={50} />
                <Text>Chapters Indigo</Text>
                <a href={chaptersLink}>Search Chapters Indigo</a>
              </Container>

              <Container>
                <AiOutlineGoogle size={50} />
                <Text>Google Books</Text>
                <a href={googleBooksLink}>Search Google Books</a>
              </Container>
            </Card.Section>
          </Grid.Col>
        </Grid>
      </Card>

      <Space h="lg" />

      <Text align="start" size="lg">
        Previews
      </Text>

      <Card shadow="sm" radius="md" style={{ width: "100%" }}>
        <Grid columns={width < 576 ? 1 : 2}>
          <Grid.Col span={1}>
            <Card.Section p={width < 576 ? "sm" : "lg"}>
              <Text>{"Google Books (may require authorization)"}</Text>

              <Container>
                <BiBookReader size={50} />
                <a href={googleBooksPreview}>View sample preview online</a>
              </Container>

              <Container>
                <IoReaderOutline size={50} />
                <a href={googleBooksWebReader}>
                  View sample using Google's web reader
                </a>
              </Container>

              <Container>
                <HiOutlineBookOpen size={50} />
                <a href={googleBooksEpub}>Download link to free epub sample</a>
              </Container>
            </Card.Section>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
}

export default Overview;
