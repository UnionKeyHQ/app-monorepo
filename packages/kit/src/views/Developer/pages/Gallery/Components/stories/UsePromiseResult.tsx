import { SizableText } from '@unionkey/components';
import { usePromiseResult } from '@unionkey/kit/src/hooks/usePromiseResult';

import { Layout } from './utils/Layout';

let i = 1;
const fetchResult = () =>
  new Promise((resolve) => {
    i += 1;
    resolve(i);
  });

const UsePromiseResultGallery = () => (
  <Layout
    filePath={__CURRENT_FILE_PATH__}
    componentName="UsePromiseResult"
    elements={[
      {
        title: 'Native',
        // eslint-disable-next-line react/no-unstable-nested-components
        element: () => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { result } = usePromiseResult(fetchResult, [], {
            pollingInterval: 1500,
            initResult: 0,
          });
          return <SizableText>{result}</SizableText>;
        },
      },
    ]}
  />
);

export default UsePromiseResultGallery;
