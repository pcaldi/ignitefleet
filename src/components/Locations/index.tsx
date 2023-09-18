import {Car, FlagCheckered} from 'phosphor-react-native'
import {LocationInfo, LocationAddressProps} from '../LocationInfo'

import {Container, Line} from './styles';

type Props = {
  departure: LocationAddressProps;
  arrival?: LocationAddressProps | null;

}

export function Locations({departure, arrival = null}: Props) {
  return (
    <Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />
      { arrival &&
        <>
            <Line/>

            <LocationInfo
              icon={FlagCheckered}
              label={arrival.label}
              description={arrival.description}
            />
        </>
      }
    </Container>
  );
}
