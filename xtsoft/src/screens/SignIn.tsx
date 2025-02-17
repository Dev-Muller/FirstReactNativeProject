import * as React from 'react';
import {
  VStack,
  Image,
  Center,
  Heading,
  Text,
  ScrollView,
  useToast,
  Toast,
  ToastTitle,
} from "@gluestack-ui/themed";

import { Controller, useForm } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { useAuth } from "@hooks/useAuth";

import Logo from "@assets/logo_basic.png";
import { Input } from "@components/input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const [ isLoading, setIsLoading ] = useState(false);

  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível realizar o login, tente novamente mais tarde.";

      setIsLoading(false);

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline" backgroundColor="$red500">
            <ToastTitle color="white">{title}</ToastTitle>
          </Toast>
        ),
      });

    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      w={"$full"}
    >
      <VStack flex={1} w={"$full"}>
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$16">
            <Image
              w={"$80"}
              h={"$48"}
              source={Logo}
              defaultSource={Logo}
              alt="Logo PJ Mais"
              rounded={"$lg"}
            />
          </Center>

          <Center gap="$2">
            <Heading color="$green500" fontSize={"$4xl"} fontFamily="$heading">
              Acesse a sua conta
            </Heading>

            <Controller
              control={control}
              name="email"
              rules={{ required: "Informe o e-mail" }}
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: "Informe a senha" }}
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text
              color="$green500"
              fontSize="$md"
              mb="$3"
              fontFamily="$heading"
            >
              Ainda não tem acesso?
            </Text>

            <Button
              title="Criar Conta"
              variant="outline"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
