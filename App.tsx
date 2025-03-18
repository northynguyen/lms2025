// app.tsx
import { AppRegistry } from 'react-native';
import Main from './src/Main/Main';
import { AuthProvider } from './src/Auth/AuthContext';
import { name as appName } from './app.json';
import React from 'react';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
AppRegistry.registerComponent(appName, () => App);

export default App;
