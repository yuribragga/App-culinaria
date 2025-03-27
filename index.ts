import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);
import App from './App';

registerRootComponent(App);
