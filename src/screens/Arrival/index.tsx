import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';
import { LatLng } from 'react-native-maps';

import { BSON } from 'realm';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Map } from '../../components/Map';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Locations } from '../../components/Locations';
import { ButtonIcon } from '../../components/ButtonIcon';

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  MessageAsync,
} from './styles';

import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage';


type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);

  const route = useRoute();
  const { id } = route.params as RouteParamsProps;

  const realm = useRealm();
  const historic = useObject(Historic, new BSON.UUID(id));

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  const { goBack } = useNavigation();

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Deseja cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () => {
          removeVehicleUsage();
        },
      },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        historic.status = 'arrival';
        historic.created_at = new Date();
        historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert('Chegada', 'Chegada registrada com sucesso!');

      goBack();
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.');
    }
  }

  async function getLocationInfo() {

    if(!historic){
      return;
    }

    const lastSync = await getLastSyncTimestamp();
    const updateAt = historic!.updated_at.getTime();
    setDataNotSynced(updateAt > lastSync);

    if(historic?.status === 'departure'){

      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(historic?.coords ?? [])
    }




  }




  useEffect(() => {
    getLocationInfo();
  }, [historic]);

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates}/>}

      <Content>
        <Locations
          departure={{ label: 'Saída', description: 'Saída Teste'}}
          arrival={{ label: 'Chegada', description: 'Chegada Teste' }}

        />

        <Label>Placa do Veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>

          <ButtonIcon
            icon={X}
            onPress={handleRemoveVehicleUsage}
          />

          <Button
            title="Registrar Chegada"
            onPress={handleArrivalRegister}
          />

        </Footer>
      )}

      {dataNotSynced && (
        <MessageAsync>
          Sincronização da
          {historic?.status === 'departure' ? ' partida' : ' chegada'} pendente
        </MessageAsync>
      )}
    </Container>
  );
}
