import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Heading,
  HStack,
  Text,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";

import { api } from "@services/api";
import { ItemDTO } from "../dtos/ItemDTO";

import { Group } from "@components/Group";
import { Cards } from "@components/Cards";
import { HomeHeader } from "../components/HomeHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import AddButton from "@components/AddButton";

export function Home() {
  const [itens, setItens] = useState<ItemDTO[]>([]);
  const [groups, setGroups] = useState<String[]>([]);
  const [groupSelected, setGroupSelected] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenCardDetails(itemId: string) {
    navigation.navigate("itemInfo", { itemId });
  }

  function handleCreateItem() {
    navigation.navigate("createItemForm");
  }

  async function fetchGroups() {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : "Erro ao buscar grupos";

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline" backgroundColor="$red500">
            <ToastTitle color="white">{message}</ToastTitle>
          </Toast>
        ),
      });
    }
  }

  async function fetchItensByGroup() {
    try {
      setIsLoading(true);
      const response = await api.get(`/item/bygroup/${groupSelected}`);
      setItens(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : "Erro ao buscar itens";

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
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItensByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups as string[]}
        keyExtractor={(item: string) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" alignItems="center" mb="$5">
            <Heading>
              {groupSelected === "home" ? (
                <Heading
                  color="$green500"
                  fontSize="$xl"
                  justifyContent="space-between"
                  mb="$4"
                >
                  DASHBOARD
                </Heading>
              ) : (
                <Heading
                  color="$green500"
                  fontSize="$xl"
                  justifyContent="space-between"
                  mb="$4"
                >
                  {groupSelected.toUpperCase()}
                </Heading>
              )}
            </Heading>

            <Text fontSize="$sm" color="$trueGray200" fontFamily="$body">
              {itens.length}
            </Text>
          </HStack>

          <FlatList
            data={itens}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Cards
                onPress={() => handleOpenCardDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
      <HStack>
        <AddButton title="Criar Novo Item" onPress={handleCreateItem} />
      </HStack>
    </VStack>
  );
}
