import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import defaultUserPhotoImg from "../assets/userPhotoDefault.png";

import { LogOut } from "lucide-react-native";
import { useAuth } from "@hooks/useAuth";
import { TouchableOpacity } from "react-native";

import { api } from '@services/api';

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack
      bg="$trueGray600"
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
    >
      <UserPhoto
        source={
          user.avatar  
          ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
          : defaultUserPhotoImg
        }
        alt="Imagem do Usuario"
        w="$16"
        h="$16"
      />

      <VStack flex={1}>
        <Text color="$trueGray100" fontSize={"$sm"}>
          Olá,
        </Text>

        <Heading color="$trueGray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$trueGray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
