import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  ScrollView,
  Toast,
  ToastTitle,
  useToast,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySVG from "@assets/body.svg";
import image2 from "@assets/2.png";
import { Button } from "@components/Button";
import { Input } from "@components/input";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ItemDTO } from "../dtos/ItemDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  itemId: string;
};

export function ItemInfo() {
  const [item, setItem] = useState<ItemDTO>({} as ItemDTO);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const route = useRoute();

  const { itemId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchItem() {
    try {
      setIsLoading(true);
      const response = await api.get(`/item/${itemId}`);
      setItem(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : "Erro ao carregar detales do item";

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline" backgroundColor="$red500">
            <ToastTitle color="white">{message}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$trueGray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          pb="$8"
        >
          <Heading
            color="$trueGray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {item.name}
          </Heading>
          <HStack alignItems="center">
            <BodySVG />

            <Text color="$trueGray200" ml="$1" textTransform="capitalize">
              {item.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 36 }}
        >
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/item/thumb/${item.thumb}`,
                }}
                alt="image 2"
                rounded="$lg"
                resizeMode="cover"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$trueGray600" rounded="$md" pb="$4" px="$4">
              <VStack alignItems="center" mb="$6" mt="$5" w="$full">
                <VStack w="$full" alignItems="flex-start" mb="$4" gap="$2">
                  <Text color="$white">{item.series} series</Text>
                  <Input placeholder="Nome" isReadOnly />
                </VStack>
                <VStack w="$full" alignItems="flex-start" mb="$4" gap="$2">
                  <Text color="white">{item.repetitions} repetixoes</Text>
                  <Input placeholder="Data" isReadOnly />
                </VStack>

                <VStack w="$full" alignItems="flex-start" mb="$4" gap="$2">
                  <Text color="white">Itens:</Text>
                  <Input placeholder="Itens" isReadOnly />
                </VStack>
              </VStack>
              <Button title="Edit" />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
