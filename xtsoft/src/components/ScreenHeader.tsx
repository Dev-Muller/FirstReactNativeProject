import { Center, Heading } from "@gluestack-ui/themed";

type Props = {
  title: string
}

export function ScreenHeader({ title }: Props) {
  return (
    <Center bg="$trueGray600" pb="$6" pt="$16">
      <Heading color="$white" fontSize="$xl" fontFamily="$heading">
        {title}
      </Heading>
    </Center>
  );
}