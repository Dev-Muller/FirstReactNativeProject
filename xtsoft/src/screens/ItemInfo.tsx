import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, Alert } from "react-native";
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
  // Alert,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import React from "react";

import BodySVG from "@assets/body.svg";
import { Button } from "@components/Button";
import { Input } from "@components/input";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ItemDTO } from "../dtos/ItemDTO";
import { Loading } from "@components/Loading";
import DeleteButton from "@components/DeleteButton";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type RouteParamsProps = {
  itemId: string;
};

type ItemFormDataProps = {
  name: string;
  series: string;
  repetitions: string;
  group: string;
  image?: string;
  location?: string;
};

const ItemSchema = yup.object({
  name: yup.string().required("Name is required"),
  series: yup.string().required("Serie is required"),
  repetitions: yup.string().required("Repeticoes is required"),
  group: yup.string().required("Group is required"),
});

export function ItemInfo() {
  const [item, setItem] = useState<ItemDTO>({} as ItemDTO);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ItemFormDataProps>({
    defaultValues: {
      repetitions: String(item.repetitions),
      group: item.group,
      series: String(item.series)
    },
    resolver: yupResolver(ItemSchema as any),
  });

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

      setValue("repetitions", String(response.data.repetitions));
      setValue("group", response.data.group);
      setValue("series", String(response.data.series));
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

  async function handleDeleteItem() {
    Alert.alert(
      "Confirmar Exclusão", 
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              setIsLoading(true);
              await api.delete(`/item/${itemId}`);
  
              toast.show({
                placement: "top",
                render: () => (
                  <Toast action="success" variant="outline" backgroundColor="$green500">
                    <ToastTitle color="white">Item deletado com sucesso!</ToastTitle>
                  </Toast>
                ),
              });
  
              navigation.navigate("home");
            } catch (error) {
              const isAppError = error instanceof AppError;
              const message = isAppError ? error.message : "Erro ao deletar item";
  
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
        }
      ]
    );
  }

  async function handleEditItem() {
    try {
      setIsLoading(true);
      const data = getValues();
      await api.put(`/item/${itemId}`, data);

      await fetchItem();
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="outline" backgroundColor="$green500">
            <ToastTitle color="white">Item atualizado com sucesso!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : "Erro ao atualizar item";

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
                  <Text color="$white">Número de Séries</Text>
                  <Controller
                    control={control}
                    name="series"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="series"
                        value={value}
                        onChangeText={onChange}
                        bg="$black"
                      />
                    )}
                  />
                </VStack>

                <VStack w="$full" alignItems="flex-start" mb="$4" gap="$2">
                  <Text color="white">Número de Repetições</Text>
                  <Controller
                    control={control}
                    name="repetitions"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="repeticoes"
                        value={value}
                        onChangeText={onChange}
                        bg="$black"
                      />
                    )}
                  />
                </VStack>

                <VStack w="$full" alignItems="flex-start" mb="$4" gap="$2">
                  <Text color="white">Grupo:</Text>
                  <Controller
                    control={control}
                    name="group"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Grupo"
                        value={value}
                        onChangeText={onChange}
                        bg="$black"
                      />
                    )}
                  />
                </VStack>
              </VStack>
              <Button title="Edit" onPress={handleEditItem} />
              <DeleteButton title="Delete" onPress={handleDeleteItem} />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
