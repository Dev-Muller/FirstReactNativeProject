import { useState } from "react";
import * as Location from "expo-location";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getLocation() {
    try {
      // Solicita permissão
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada");
        return null;
      }

      // Obtém a localização atual
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      return locationData;
    } catch (err) {
      console.error("Erro ao obter localização:", err);
      setError("Erro ao obter localização");
      return null;
    }
  }

  return { location, getLocation, error };
}
