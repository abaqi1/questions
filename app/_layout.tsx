import { Stack } from "expo-router";
import CreateGroup from './CreateGroup';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="CreateGroup"
        options={{
          title: "Create Group"
        }}
      />
    </Stack>
  );
}
