import {
  Center,
  ScrollView,
  VStack,
  Text,
  useToast,
  Toast,
} from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { ToastTitle } from "@gluestack-ui/themed";
import { ToastMessage } from "@components/ToastMessage";
import { Input } from "@components/input";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import { AppError } from "@utils/AppError";
import { getAddressLocation } from "@utils/getAddress";
import { useLocation } from "@hooks/useLocation";

import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Icon } from "@gluestack-ui/themed";
// import { ItemPhoto } from "@components/ItemPhoto";
import React from "react";

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

export function CreateItemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const { getLocation, location, error } = useLocation();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormDataProps>({
    defaultValues: { name: itemName },
    resolver: yupResolver(ItemSchema as any),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  const handleGetLocation = async (onChange: (value: string) => void) => {
    try {
      const locationResponse = await getLocation();
      if (!locationResponse) {
        throw new Error("Não foi possível obter a localização");
      }
      const address = await getAddressLocation({
        latitude: locationResponse?.coords.latitude,
        longitude: locationResponse?.coords.longitude,
        altitude: locationResponse.coords.altitude,
        accuracy: locationResponse.coords.accuracy,
        altitudeAccuracy: locationResponse.coords.altitudeAccuracy,
        heading: locationResponse.coords.heading,
        speed: locationResponse.coords.speed,
      });
      onChange(address);
    } catch (error) {
      console.error("Error getting location:", error);

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline" backgroundColor="$red500">
            <ToastTitle color="white">{"Error getting location"}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  async function handleSelectImage(data: any) {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                description="This Image is too Big. Choose another with a limit of 5MB"
                title="error"
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }
        const fileExtension = photoUri.split(".").pop();
        const photoFile = {
          name: `${data.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `image/${fileExtension}`,
        };
        const itemPhotoUploadForm = new FormData();
        const photoBlob = await (await fetch(photoUri)).blob();
        itemPhotoUploadForm.append("itemImage", photoBlob, photoFile.name);
        const itemImageUpdatedResponse = await api.patch(
          "/items/image",
          itemPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.show({
          placement: "top",
          render: () => (
            <Toast
              action="success"
              variant="outline"
              backgroundColor="$green500"
            >
              <ToastTitle color="white">Image Added!</ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleItemCreate(data: ItemFormDataProps) {
    try {
      setIsLoading(true);
      await api.post("/item/create", data);

      navigation.navigate("home");

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="outline" backgroundColor="$green500">
            <ToastTitle color="white">Item Created!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : "Error creating item";

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

  return (
    <VStack>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <VStack px="$8" bg="$trueGray600" pt="$12" pb="$4">
          <TouchableOpacity onPress={handleGoBack}>
            <Icon as={ArrowLeft} color="$green500" size="xl" />
          </TouchableOpacity>
        </VStack>

        {/* <ItemPhoto
          source={
            data.thumb
              ? { uri: `${api.defaults.baseURL}/avatar/${data.thumb}` }
              : defaultUserPhotoImg
          }
          alt="user photo"
          size="xl"
        /> */}

        <Center mt="$6" px="$10">
          <Text
            fontSize="$lg"
            fontFamily="$heading"
            color="$trueGray200"
            mb="$6"
          >
            Create a new item
          </Text>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Name"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="series"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="series"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                />
              )}
            />

            <Controller
              control={control}
              name="repetitions"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="repeticoes"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                />
              )}
            />

            <Controller
              control={control}
              name="group"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Grupo"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <VStack w="$full" alignItems="center" gap="$2">
                  <Input
                    placeholder="Location"
                    value={value}
                    onChangeText={onChange}
                    w="$full"
                    bg="$trueGray600"
                  />
                  <Button
                    title="Get Location"
                    onPress={() => handleGetLocation(onChange)}
                    size="md"
                    variant="outline"
                    mr={2}
                  />
                </VStack>
              )}
            />
          </Center>

          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <TouchableOpacity onPress={handleSelectImage}>
                <Text
                  color="$green500"
                  fontFamily="$heading"
                  fontSize="$md"
                  mt="$2"
                  mb="$8"
                >
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          />

          <Button
            title="Create Item"
            onPress={handleSubmit(handleItemCreate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}

export default CreateItemForm;
