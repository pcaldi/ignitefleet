import { useRoute } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { id } = route.params as RouteParamsProps;

  return (
    <Container>
      <Header title="Chegada" />
      <Content>
        <Label>Placa do Veículo</Label>
        <LicensePlate>XXX2023</LicensePlate>

        <Label>Finalidade</Label>
        <Description>
          Mussum Ipsum, cacilds vidis litro abertis. Aenean aliquam molestie leo, vitae iaculis
          nisl.Em pé sem cair, deitado sem dormir, sentado sem cochilar e fazendo pose.Mais vale um
          bebadis conhecidiss, que um alcoolatra anonimis.Delegadis gente finis, bibendum egestas
          augue arcu ut est.
        </Description>
        <Footer>
          <Button title="Registrar chegada" />
        </Footer>
      </Content>
    </Container>
  );
}
