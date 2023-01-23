import { Navbar, Text } from "@mantine/core";

type MyNavBarProps = {
  children?: React.ReactNode;
  opened: boolean;
};

function MyNavBar({ children, opened }: MyNavBarProps) {
  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      <Text>Navbar</Text>
    </Navbar>
  );
}

export { MyNavBar };
