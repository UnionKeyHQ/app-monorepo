import type { ComponentProps, FC } from 'react';

import { Markdown, Modal } from '@unionkeyhq/components';

// –– ChangeLogModal Start ––
type ChangeLogModalProps = {
  md?: string;
  features?: Array<string>;
} & ComponentProps<typeof Modal>;

const ChangeLogModalDefaultProps = {
  md: 'Use `md` prop to write something.',
} as const;

const ChangeLogModal: FC<ChangeLogModalProps> = ({
  md,
  features,
  ...reset
}) => (
  <Modal
    size="sm"
    headerShown={false}
    maxHeight={640}
    hidePrimaryAction
    scrollViewProps={{
      children: features ? (
        'Major Update Placeholder'
      ) : (
        <Markdown>{md}</Markdown>
      ),
    }}
    {...reset}
  />
);

ChangeLogModal.defaultProps = ChangeLogModalDefaultProps;
// –– ChangeLogModal End ––

// The Stories Gallery
const AppUpdateGallery = () => {
  const md = `
  # What’s new in UnionKey 1.0.3

  ### 💎  Improvements

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.

  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.

  ### 🐞  Fixes
  
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.

  ---

  # What’s new in UnionKey 1.0.2

  ### 💎  Improvements

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.

  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.

  ### 🐞  Fixes

  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta leo urna blandit.
  `;

  return <ChangeLogModal md={md} />;
};

export default AppUpdateGallery;
