import { LottieView, Stack } from '@unionkeyhq/components';
import PrimeBannerBgDark from '@unionkeyhq/kit/assets/animations/prime-banner-bg-dark.json';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

const PrimeLottie = () => (
  <LottieView
    resizeMode="cover"
    position="absolute"
    left={0}
    top={0}
    right={0}
    bottom={0}
    source={PrimeBannerBgDark}
  />
);

export function PrimeLottieAnimation() {
  if (platformEnv.isNative) {
    return <PrimeLottie />;
  }

  return (
    <Stack
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        right: 0,
        paddingBottom: '100%',
      }}
    >
      <PrimeLottie />
    </Stack>
  );
}
