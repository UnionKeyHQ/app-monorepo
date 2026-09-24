import { Center, QRCode } from '@unionkeyhq/components';

const QRCodeGallery = () => (
  <Center flex="1" bg="background-hovered">
    <QRCode value="https://unionkey.io/" size={296} />
  </Center>
);

export default QRCodeGallery;
