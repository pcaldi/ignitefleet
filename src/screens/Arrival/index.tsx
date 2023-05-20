import { useRoute } from '@react-navigation/native';

import { Header } from '../../components/Header';

import { Container } from './styles';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { id } = route.params as RouteParamsProps;

  return (
    <Container>
      <Header title="Chegada" />
    </Container>
  );
}
