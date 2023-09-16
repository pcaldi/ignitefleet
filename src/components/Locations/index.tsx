import {Car, FlagCheckered} from 'phosphor-react-native'
import {LocationInfo, locationAddressProps} from '../LocationInfo'

import {Container, Line} from './styles';

type Props = {
  departure: locationAddressProps;
  arrival: locationAddressProps;

}

export function Locations({departure, arrival}: Props) {
  return (
    <Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      <Line/>

      <LocationInfo
        icon={FlagCheckered}
        label={arrival.label}
        description={arrival.description}
      />

    </Container>
  );
}
