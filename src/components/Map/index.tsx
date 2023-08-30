import MapView, {PROVIDER_GOOGLE, MapViewProps, LatLng, Marker} from "react-native-maps";
import { Car, FlagCheckered } from "phosphor-react-native";

import { IconBox } from "../IconBox";

type Props = MapViewProps & {
  coordinates: LatLng[];
}

export function Map({coordinates, ...rest}: Props) {

  const lastCoordinate = coordinates[coordinates.length - 1];

  return (
   <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200}}
      region={{
        latitude: lastCoordinate.latitude,
        longitude: lastCoordinate.longitude,
        latitudeDelta:0.005,
        longitudeDelta:0.005,
      }}
      {...rest}
    >
      <Marker coordinate={coordinates[0]}>
        <IconBox
          icon={Car}
          size="SMALL"
        />
      </Marker>

      {
        coordinates.length > 1 && /* Fazemos a condição caso aja outra coordenada  */
        /* Aqui pegaremos a ultima coordenada. */
       <Marker coordinate={lastCoordinate}>
           <IconBox
              icon={FlagCheckered}
              size="SMALL"
           />
      </Marker>
      }


    </MapView>
  );
}
