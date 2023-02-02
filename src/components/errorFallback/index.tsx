import { Button, Flex, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

type ErrorFallbackProps = {
  children?: React.ReactNode;
  error?: any;
  componentName: string;
};

function ErrorFallback({ children, componentName, error }: ErrorFallbackProps) {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text>(╯°□°)╯︵ ɹoɹɹƎ</Text>
      <Text>Something went wrong when retrieving {componentName}</Text>
      <pre>{error.message}</pre>
      <Button>
        <Link to={"/"}>Try again 🔁</Link>
      </Button>
    </Flex>
  );
}

export default ErrorFallback;
