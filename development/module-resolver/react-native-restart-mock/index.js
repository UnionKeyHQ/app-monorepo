const RNRestart = {
  moduleName: 'react-native-restart-mock',
  Restart: () => null,
  restart: () => null,
  Platform: {
    OS: 'web',
  },
};

export const { Restart, restart, Platform } = RNRestart;
export default RNRestart;
