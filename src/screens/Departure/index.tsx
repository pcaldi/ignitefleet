import { useRef, useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useRealm } from '../../libs/realm';
import { useUser } from '@realm/react';
import { Historic } from '../../libs/realm/schemas/Historic';

import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

import { Container, Content } from './styles';
import { licensePlateValidate } from '../../utils/LicensePlateValidate';

export function Departure() {
  const [licensePlate, setLicensePlate] = useState('');
  const [description, setDescription] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  function handleDepartureRegister() {
    try {
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
      setIsRegistering(true);

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toLocaleUpperCase(),
            description,
          })
        );
      });
      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.');
      goBack();
    } catch (error) {
      setIsRegistering(false);
      console.log(error);
      Alert.alert('Error', 'Não foi possível registar a saída do veículo.');
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
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

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA2E19"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

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

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
