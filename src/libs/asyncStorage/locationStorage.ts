import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = '@ignitefleet:location';

type LocationProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/* Método para obter as coordenadas salvas no dispositivo */

export async function getStorageLocations(){
  const storage = await AsyncStorage.getItem(STORAGE_KEY);
  const response = storage ? JSON.parse(storage) : [];

  return response;

}
 /* Método para salvar as coordenadas */

export async function saveStorageLocation(newLocation: LocationProps) {
  const storage = await getStorageLocations();
  storage.push(newLocation);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

/* Método para remover as coordenadas */

export async function removeStorageLocation(){
  await AsyncStorage.removeItem(STORAGE_KEY);
}
