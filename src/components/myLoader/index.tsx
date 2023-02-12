import { Flex, Grid, Loader, Progress, Space, Text } from "@mantine/core";
import React from "react";

import { useWindowSize } from "../../hooks/useWindowSize";

type MyLoaderProps = {
  children?: React.ReactNode;
  componentName: string;
};

export default function MyLoader({ children, componentName }: MyLoaderProps) {
  const { width = 0 } = useWindowSize();

  return (
    <Grid columns={10}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="sm" />
      ))}
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={8}>
        <Flex direction="column" align="center" justify="center">
          <Loader size={width < 576 ? "lg" : "xl"} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Space key={i} h="sm" />
          ))}

          <Text> Please wait ... </Text>
          <Text>⬛⬛⬛⬜⬜</Text>
          <Text>loading {componentName}</Text>
          <Text> </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
    </Grid>
  );
}
