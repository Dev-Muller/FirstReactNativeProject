import { ComponentProps } from "react"
import { Image } from "@gluestack-ui/themed"

type Props = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: Props) {
  return <Image rounded="$full" borderWidth="$2" borderColor="$trueGray400" backgroundColor="$trueGray500" {...rest} />
}