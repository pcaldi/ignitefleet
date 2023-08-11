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

type Props = locationAddressProps;


export function LocationInfo({label, description}: Props) {
  return (
    <Container>
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
