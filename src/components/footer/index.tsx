import { Flex, Footer, Space, Text } from "@mantine/core";

type MyFooterProps = { children?: React.ReactNode };

function MyFooter({ children }: MyFooterProps) {
  return (
    <Footer height={60} p="md">
      <Flex direction="row" justify="center" align="center">
        <Text>
          Made by <a href="https://github.com/Athma-Vasi">Athma Vasi</a>
        </Text>

        <Space w="xl" />

        <Text>
          <a href="https://github.com/Athma-Vasi/Byblos">View code</a>
        </Text>
      </Flex>
    </Footer>
  );
}

export { MyFooter };
