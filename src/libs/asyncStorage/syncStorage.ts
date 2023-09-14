import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_ASYNC_KEY = '@ignitefleet:last_sync';

//Método para salvar a ultima sincronização.
export async function saveLastSyncTimestamp() {
  const timestamp = new Date().getTime();
  await AsyncStorage.setItem(STORAGE_ASYNC_KEY, timestamp.toString());

  return timestamp;
}

// Método para recuperar a ultima sincronização.
export async function getLastSyncTimestamp() {
  const response = await AsyncStorage.getItem(STORAGE_ASYNC_KEY);

  return Number(response);
}
