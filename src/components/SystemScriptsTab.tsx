import { HOMEBREW_COMMANDS } from '../constants/commands/homebrew';
import ScriptItemList from './ScriptItemList';

const SystemScriptsTab = () => {
  return (
    <div>
      <ScriptItemList
        scripts={HOMEBREW_COMMANDS}
        handleSelectScriptItem={() => {
          //
        }}
      />
    </div>
  );
};

export default SystemScriptsTab;
