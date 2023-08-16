import { IconBox, IconBoxProps } from '../IconBox';
import {
  Container,
  Info,
  Description,
  Label
} from './styles';


export type locationAddressProps ={
  label:string;
  description:string;
}

type Props = locationAddressProps & {
  icon: IconBoxProps
}


export function LocationInfo({label, icon, description}: Props) {
  return (
    <Container>

      <IconBox
        icon={icon}
      />
      <Info>
        <Label numberOfLines={1}>
           {label}
          </Label>
        <Description numberOfLines={1}>
            {description}
          </Description>
      </Info>
    </Container>
  );
}

/* numberOfLines = Propriedade para não passar o texto de 1 linha. */
