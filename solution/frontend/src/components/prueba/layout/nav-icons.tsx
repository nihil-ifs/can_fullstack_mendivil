import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Envelope as EnvelopeIcon} from '@phosphor-icons/react/dist/ssr/Envelope';
import { File as FileIcon} from '@phosphor-icons/react/dist/ssr/File';

export const navIcons = {
  'envelope': EnvelopeIcon,
  'file': FileIcon,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
