import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({ title, variant = "solid", isLoading = false, ...rest }: Props) {
  return (
    <GluestackButton
      {...rest}
      w="$full"
      h="$12"
      bg={ variant === "outline" ? "transparent" : "$green500"}
      borderWidth={ variant === "outline" ? "$1" :"$0" }
      borderColor="$green400"
      rounded="$sm"
      $active-bg={ variant === "outline" ? "$green300" : "$green400" }
      disabled={isLoading}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text color={ variant === "outline" ? "$white" : "$white"} fontSize="$md" fontFamily="$heading">
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
