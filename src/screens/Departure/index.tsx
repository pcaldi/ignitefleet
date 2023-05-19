import { useRef, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';

import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

import { Container, Content } from './styles';
import { licensePlateValidate } from '../../utils/LicensePlateValidate';

const keyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position';

export function Departure() {
  const [licensePlate, setLicensePlate] = useState('');
  const [description, setDescription] = useState('');

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    if (!licensePlateValidate(licensePlate)) {
      licensePlateRef.current?.focus();
      return Alert.alert('Placa inválida.', 'Por favor, informe a placa correta do veículo.');
    }

    /* Validar somente se o usuário digitou algo dentro do input, 
    validando e removendo os espaços com a função .trim()  */

    if (description.trim().length === 0) {
      descriptionRef.current?.focus();
      return Alert.alert(
        'Finalidade.',
        'Por favor, informe a finalidade da utilização do veículo.'
      );
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA2E19"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o carro para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit /* Como meu component tem a opção de multiline, tenho
              que utilizar essa propriedade para enviar o meu formulário. */
              onChangeText={setDescription}
            />

            <Button title="Registrar Saída" onPress={handleDepartureRegister} />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
