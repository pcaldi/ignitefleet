import { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords
} from 'expo-location'

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

import { startLocationTask } from '../../tasks/backgroundLocationTask';
import { Container, Content, Message, MessageContent } from './styles';
import { licensePlateValidate } from '../../utils/LicensePlateValidate';
import { OpenSettings } from '../../utils/OpenSettings';
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

  async function handleDepartureRegister() {
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
        /* Caso !NÃO tenha a latitude EE !NÃO tenha a longitude */
      if (!currentCoord?.latitude && !currentCoord?.longitude) {
        return (
          Alert.alert('Localização!','Não foi possível obter a localização atual. Tente novamente!')
        )
      }
      setIsRegistering(true);

        /* Permissão em segundo plano. */
      const backgroundPermissions = await requestBackgroundPermissionsAsync()
        /* Se o usuário !NÃO deu permissão para o nosso app 'granted' */
      if(!backgroundPermissions.granted) {
        setIsRegistering(false);
        return Alert.alert('Localização', 'É necessário permitir  que o App tenha acesso a localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo".', [{ 'text': 'Abrir Configurações', onPress: OpenSettings}])
      }

      await startLocationTask();

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toLocaleUpperCase(),
            description,
            coords: [{
              latitude: currentCoord.latitude,
              longitude: currentCoord.longitude,
              timestamp: new Date().getTime()
            }]
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

         <MessageContent>

            <Message>
              Você precisa permitir que o aplicativo tenha acesso a localização para utilizar essa funcionalidade. Por favor, acesse as configurações do seu dispositivo para conceder essa permissão ao aplicativo.
            </Message>

            <Button title='Abrir Configurações' onPress={OpenSettings} />
         </MessageContent>
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
          {currentCoord && <Map coordinates={[currentCoord]}/>}
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


