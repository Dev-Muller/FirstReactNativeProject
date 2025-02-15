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
  set,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "axios";
import { api } from "@services/api";

import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import Logo from "@assets/logo_basic.png";
import { Input } from "@components/input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const singUpSchema = yup.object({
  name: yup.string().required("Nome é obrigatório."),
  email: yup
    .string()
    .required("E-mail é obrigatório.")
    .email("E-mail inválido."),
  password: yup
    .string()
    .required("password é obrigatória")
    .min(6, "Mínimo de 6 caracteres."),
  passwordConfirm: yup
    .string()
    .required("Confirme a password.")
    .oneOf([yup.ref("password"), ""], "Senhas não conferem."),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(singUpSchema),
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  function handleGoBackLogin() {
    navigation.navigate("signIn");
  }

  //   fetch('http://192.168.56.1:3333/users', {
  //   // fetch('https://10.10.12.131:3333/users', {

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await api.post("/users", { name, email, password });

      await signIn(email, password);
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cadastrar o  usuário";

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

          <Center gap="$2" flex={1}>
            <Heading color="$green500" fontSize={"$4xl"} fontFamily="$heading">
              Crie sua conta
            </Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Name"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="password"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirmar a password"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors.passwordConfirm?.message}
                />
              )}
            />

            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>

          <Button
            title="Voltar para o Login"
            variant="outline"
            mt="$12"
            onPress={handleGoBackLogin}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
