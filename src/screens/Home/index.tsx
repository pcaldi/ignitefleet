import { useNavigation } from '@react-navigation/native';
import { useQuery } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../../components/HomeHeader';

import { Container, Content } from './styles';
import { useEffect } from 'react';

export function Home() {
  const { navigate } = useNavigation();

  const historic = useQuery(Historic);

  function handleRegisterMoment() {
    navigate('departure');
  }

  function fetchVehicle() {
    console.log(historic);
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus onPress={handleRegisterMoment} />
      </Content>
    </Container>
  );
}
