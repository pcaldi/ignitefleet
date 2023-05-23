import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../../components/HomeHeader';

import { Container, Content } from './styles';
import { HistoricCard } from '../../components/HistoricCard';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const { navigate } = useNavigation();

  const realm = useRealm();
  const historic = useQuery(Historic);

  function handleRegisterMoment() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse._id.toString() });
    } else {
      navigate('departure');
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status =  'departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert('Veículo em uso.', 'Veículo já está em uso.');
      console.log(error);
    }
  }

  function fetchHistoric() {
    /*  */
    const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");

    console.log(response);
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => realm.removeListener('change', fetchVehicleInUse);
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus licensePlate={vehicleInUse?.license_plate} onPress={handleRegisterMoment} />
        <HistoricCard data={{ created: '23/05', licensePlate: 'XXX2023', isSync: false }} />
      </Content>
    </Container>
  );
}
