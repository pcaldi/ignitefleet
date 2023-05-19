import { Container, Content } from './styles';

import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

export function Departure() {
  return (
    <Container>
      <Header title="Saída" />
      <Content>
        <LicensePlateInput label="Placa do veículo" placeholder="BRA2E19" />

        <TextAreaInput label="Finalidade" placeholder="Vou utilizar o carro para..." />

        <Button title="Registrar Saída" />
      </Content>
    </Container>
  );
}
