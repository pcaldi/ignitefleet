import 'react-native-get-random-values';
import './src/libs/dayjs';

import { StatusBar } from 'react-native';
import { AppProvider, UserProvider } from '@realm/react';
import { ThemeProvider } from 'styled-components/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { WifiSlash } from 'phosphor-react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import theme from './src/theme';

import { REALM_APP_ID } from '@env';

import { SignIn } from './src/screens/SignIn';
import { Loading } from './src/components/Loading';

import { Routes } from './src/routes';
import { RealmProvider, syncConfig } from './src/libs/realm';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TopMessage } from './src/components/TopMessage';

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  const netInfo = useNetInfo();

  if (!fontLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}>
          {!netInfo.isConnected && <TopMessage title="Você está off-line." icon={WifiSlash} />}
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
