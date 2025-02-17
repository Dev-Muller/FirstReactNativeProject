import React, { useEffect, useState } from "react";
import "@/global.css";
import { GluestackUIProvider, StyledProvider } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { Routes } from "./src/routes";

import { AuthContext, AuthContextProvider } from "./src/contexts/AuthContext";

import { Loading } from "./src/components/Loading";

import { config } from "./config/gluestack-ui.config";

// import { OneSignal } from "react-native-onesignal";

// OneSignal.initialize("66de8c0d-ff57-4fc4-9687-7a5a9eaec13f")

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <StyledProvider config={config}>
      <GluestackUIProvider config={config}>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <AuthContextProvider>
          {fontLoaded ? <Routes /> : <Loading />}
        </AuthContextProvider>
      </GluestackUIProvider>
    </StyledProvider>
  );
}
