import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { ChevronRight} from "lucide-react-native"

import image2 from "@assets/2.png";

import { api } from "@services/api";

import { ItemDTO } from "../dtos/ItemDTO";

type Props = TouchableOpacityProps & {
  data: ItemDTO
};

export function Cards({ data, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bgColor="$trueGray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{ uri: `${api.defaults.baseURL}/item/thumb/${data.thumb}` }}
          alt="image2"
          w="$16"
          h="$16"
          mr="$4"
          resizeMode="cover"
          rounded="$md"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data.name}
          </Heading>
          <Text fontSize="$sm" color="$trueGray200" mt="$1" numberOfLines={2}>
            {data.series} séries x {data.repetitions}
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$trueGray300" />
      </HStack>
    </TouchableOpacity>
  );
}
