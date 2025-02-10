import { Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null;
  isInvalid?: boolean;
  isReadOnly?: boolean;
}

export function Input({ isReadOnly = false, errorMessage = null, isInvalid = false, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$2">
      <GluestackInput
        isInvalid={invalid}
        h="$12"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 2,
          borderColor: invalid ? "$red500" : "$green500",
        }}
        $invalid={{
          borderWidth: 2,
          borderColor: "$red500",
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          bg="$black"
          px="$4"
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$white"
          {...rest}
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color="$red500">{errorMessage}</FormControlErrorText>
      </FormControlError>

    </FormControl>
  );
}
