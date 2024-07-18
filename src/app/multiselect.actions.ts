import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const multiSelectActions = createActionGroup({
  source: 'MultiSelect',
  events: {
    check: props<{id:string}>(),
    uncheck: props<{ id: string }>(),
    delete: props<{ ids: string[] }>(),
    purchase: props<{ ids: string[] }>(),
    clear: emptyProps(),
  },
});
