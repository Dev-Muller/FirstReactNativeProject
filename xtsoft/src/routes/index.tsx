import { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";

import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { Loading } from "@components/Loading";

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.trueGray700;

  if(isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="$trueGray700">
      <NavigationContainer theme={theme}>
       {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
