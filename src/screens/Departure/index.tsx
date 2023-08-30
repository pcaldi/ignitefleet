import { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useForegroundPermissions, watchPositionAsync, LocationAccuracy, LocationSubscription, LocationObjectCoords} from 'expo-location'

import { useUser } from '@realm/react';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { LocationInfo } from '../../components/LocationInfo';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Map } from '../../components/Map';

import { Container, Content, Message } from './styles';
import { licensePlateValidate } from '../../utils/LicensePlateValidate';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { Car } from 'phosphor-react-native';

export function Departure() {
  const [licensePlate, setLicensePlate] = useState('');
  const [description, setDescription] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoord, setCurrentCoord] = useState<LocationObjectCoords | null >(null);


  const [locationForegroundPermissions, requestLocationForegroundPermissions] = useForegroundPermissions();

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

  useEffect(() => {
    requestLocationForegroundPermissions(); /* Obter permissão do aplicativo */
  },[])

  useEffect(() => {
    if(!locationForegroundPermissions?.granted){
      return;
    }

    let subscription: LocationSubscription

    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoord(location.coords);
      getAddressLocation(location.coords).then((address) => {
        if(address) {
          setCurrentAddress(address);
        }
      }).finally(() => setIsLoadingLocation(false));
    })
    .then((response) => subscription = response);

    return () => {
      if(subscription) {
        subscription.remove()
      }
    };

  },[locationForegroundPermissions])

  if(!locationForegroundPermissions?.granted){   /* Caso o usuário não de permissão para acessar a localização. */
    return (
      <Container>
         <Header title="Saída" />
          <Message>
            Você precisa permitir que o aplicativo tenha acesso a localização para utilizar essa funcionalidade. Por favor, acesse as configurações do seu dispositivo para conceder essa permissão ao aplicativo.
          </Message>
      </Container>
    )
  }

  if (isLoadingLocation){
    return (
      <Loading/>
    )
  }


  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentCoord && <Map coordinates={[
            {latitude: -25.4043 , longitude:  -49.2626 },
            {latitude: -25.4079, longitude: -49.2637 },
          ]}/>}
            <Content>
              {
                currentAddress &&
                <LocationInfo
                  label='Localização Atual'
                  description={currentAddress}
                  icon={Car}
                />
              }


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
function setIsLoading(arg0: boolean): void {
  throw new Error('Function not implemented.');
}

