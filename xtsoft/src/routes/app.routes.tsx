import * as React from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import HomeSvg from "@assets/home.svg";
import ProfileSvg from "@assets/profile.svg";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { ItemInfo } from "@screens/ItemInfo";
import { Platform } from "react-native";
import { View } from "@gluestack-ui/themed";
import CreateItemForm from "@screens/CreateItemForm";

type AppRoutes = {
  home: undefined;
  profile: undefined;
  itemInfo: { itemId: string };
  createItemForm: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space["6"];
  
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.trueGray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.trueGray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: tokens.space["10"],
          paddingTop: tokens.space["4"],
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >

      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <HomeSvg fill={color} width={iconSize} height={iconSize} />
            </View>
          ),
        }}
      />

      <Screen
        name="itemInfo"
        component={ItemInfo}
        options={{
          tabBarButton: () => null,
          tabBarIcon: () => null,
        }}
      />

      <Screen
        name="createItemForm"
        component={CreateItemForm}
        options={{
          tabBarButton: () => null,
          tabBarIcon: () => null,
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ProfileSvg fill={color} width={iconSize} height={iconSize} />
            </View>
          ),
        }}
      />
    </Navigator>
  );
}
