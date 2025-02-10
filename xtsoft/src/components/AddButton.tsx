import {
  Button as GluestackButton,
  ButtonText,
  ButtonGroup,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
};

const AddButton = ({ title, ...rest }: Props) => (
  <ButtonGroup alignItems="flex-end" justifyContent="flex-end" m="$4">
    <GluestackButton bg="$green500" rounded="$md" h="$12" w="$full" {...rest}>
      <ButtonText>{title}</ButtonText>
    </GluestackButton>
  </ButtonGroup>
);

export default AddButton;