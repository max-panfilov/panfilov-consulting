import * as migration_20251030_add_footer_contact_form from './20251030_add_footer_contact_form';

export const migrations = [
  {
    up: migration_20251030_add_footer_contact_form.up,
    down: migration_20251030_add_footer_contact_form.down,
    name: '20251030_add_footer_contact_form'
  },
];
