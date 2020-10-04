import * as KrixStateStore from '@krix/state-store';

export interface HistoryItem extends KrixStateStore.Interfaces.SetStateCommand {
  id: number;
}
