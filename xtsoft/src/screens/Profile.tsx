import { Button } from "@components/Button";
import { Input } from "@components/input";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  Heading,
  Text,
  Toast,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { ToastTitle } from "@gluestack-ui/themed";


import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
import axios from "axios";

type ProfileFormDataProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  confirmPassword: string;
};

const ProfileSchema = yup.object({
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .min(6, "Password must have at least 6 characters")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password confirmation does not match.")
    .when("password", (password, schema) =>
      password
        ? schema
            .required("Inform the password confirmation.")
            .nullable()
            .transform((value) => (!!value ? value : null))
        : schema
    ),
});

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    // "https://github.com/Dev-Muller.png"
  );

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormDataProps>({
    defaultValues: { name: user.name, email: user.email },
    resolver: yupResolver(ProfileSchema as any),
  });

  async function handleSelectImage() {
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

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                description="This Image is too Big. Choose other with a limit of 5MB"
                title="error"
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }
  
        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", {
          uri: photoUri,
          type: photoSelected.assets[0].type, // ou o tipo correto da imagem
          name: photoSelected.assets[0].fileName, // ou o nome correto da imagem
        } as any );
        
        const avatarUpdatedResponse = await fetch(`https://apitx.vercel.app/users/avatar/${user.id}`, {
          method: "PUT",
          body: userPhotoUploadForm,
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        });

        // setUserPhoto(avatarUpdatedResponse.data.avatar);
        console.log(avatarUpdatedResponse);
        
  
        // const userUpdated = { ...user, avatar: avatarUpdatedResponse.data.avatar };
  
        // await updateUserProfile(userUpdated);

        // toast.show({
        //   placement: "top",
        //   render: () => (
        //     <Toast action="success" variant="outline" backgroundColor="$green500">
        //       <ToastTitle color="white">Foto Atualizada!</ToastTitle>
        //     </Toast>
        //   ),
        // });
      }
    } catch (error) {
      console.error(error);
      console.error("ta com erro aqui");
    }
  }

  async function handleProfileUpdate(data: ProfileFormDataProps) {
    try {      
      setIsLoading(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put(`/users/profile/${user.id}`, data);

      await updateUserProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            description="Profile updated successfully"
            title="success"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      console.error(error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            description="An error occurred while updating the profile"
            title="error"
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto 
            source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg} 
            alt="user photo" 
            size="xl" 
          />
          <TouchableOpacity onPress={handleSelectImage}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Change Photo
            </Text>
          </TouchableOpacity>

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
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  bg="$trueGray600"
                  isReadOnly
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            fontSize="$lg"
            mt="$12"
            mb="$2"
            color="$trueGray200"
          >
            Change Password
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="oldPassword"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Current Password"
                  onChangeText={onChange}
                  bg="$trueGray600"
                  secureTextEntry
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="New Password"
                  onChangeText={onChange}
                  bg="$trueGray600"
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirm New Password"
                  onChangeText={onChange}
                  bg="$trueGray600"
                  secureTextEntry
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title="Save Changes"
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
