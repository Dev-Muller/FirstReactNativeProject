import {
  Center,
  ScrollView,
  VStack,
  Text,
  useToast,
  Toast,
} from "@gluestack-ui/themed";
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

type ItemFormDataProps = {
  name: string;
  serie: string;
  repeticoes: string;
  group: string;
  image?: string;
};

const ItemSchema = yup.object({
  name: yup.string().required("Name is required"),
  serie: yup.string().required("Serie is required"),
  repeticoes: yup.string().required("Repeticoes is required"),
  group: yup.string().required("Group is required"),
});

export function CreateItemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [itemName, setItemName] = useState("");

  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormDataProps>({
    defaultValues: { name: itemName },
    resolver: yupResolver(ItemSchema as any),
  });

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

  // async function handleItemUpdate(data: ItemFormDataProps) {
  //   try {
  //     setIsLoading(true);

  //     await api.post("/item/:{id}", data);

  //   } catch (error) {
  //     console.error(error);
  //     toast.show({
  //       placement: "top",
  //       render: ({ id }) => (
  //         <ToastMessage
  //           id={id}
  //           description="An error occurred while updating the item"
  //           title="error"
  //           action="error"
  //           onClose={() => toast.close(id)}
  //         />
  //       ),
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <VStack>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
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
              name="serie"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="serie"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                />
              )}
            />

            <Controller
              control={control}
              name="repeticoes"
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
            // onPress={handleSubmit(handleItemUpdate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}

export default CreateItemForm;
