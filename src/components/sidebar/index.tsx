import { Aside, MediaQuery, Text } from "@mantine/core";

type SidebarProps = {
  children?: React.ReactNode;
};

function Sidebar({ children }: SidebarProps) {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        <Text>Application sidebar</Text>
      </Aside>
    </MediaQuery>
  );
}

export { Sidebar };
