import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location";

export async function getAddressLocation({ latitude, longitude }: LocationObjectCoords) {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude });

    if (addressResponse.length > 0) {
      return `${addressResponse[0].street}, ${addressResponse[0].city} - ${addressResponse[0].region}`;
    }

    return "Endereço não encontrado";
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return "Erro ao obter endereço";
  }
}
