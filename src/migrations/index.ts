import * as migration_20251030_add_footer_contact_form from './20251030_add_footer_contact_form';
import * as migration_20251101_113607 from './20251101_113607';
import * as migration_20251102_150042 from './20251102_150042';
import * as migration_20251105_084325 from './20251105_084325';
import * as migration_20251105_130610 from './20251105_130610';
import * as migration_20260208_add_users_api_key from './20260208_add_users_api_key';

export const migrations = [
  {
    up: migration_20251030_add_footer_contact_form.up,
    down: migration_20251030_add_footer_contact_form.down,
    name: '20251030_add_footer_contact_form',
  },
  {
    up: migration_20251101_113607.up,
    down: migration_20251101_113607.down,
    name: '20251101_113607',
  },
  {
    up: migration_20251102_150042.up,
    down: migration_20251102_150042.down,
    name: '20251102_150042',
  },
  {
    up: migration_20251105_084325.up,
    down: migration_20251105_084325.down,
    name: '20251105_084325',
  },
  {
    up: migration_20251105_130610.up,
    down: migration_20251105_130610.down,
    name: '20251105_130610'
  },
  {
    up: migration_20260208_add_users_api_key.up,
    down: migration_20260208_add_users_api_key.down,
    name: '20260208_add_users_api_key',
  },
];
