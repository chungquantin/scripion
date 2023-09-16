import { useState } from 'react';

import { HOMEBREW_COMMANDS } from '../constants/commands/homebrew';
import { ScriptItem } from '../models';
import ScriptItemList from './ScriptItemList';

const SystemScriptsTab = () => {
  const [selectedScript, setSelectedScript] = useState<ScriptItem | undefined>(undefined);

  return (
    <div>
      <ScriptItemList
        scripts={HOMEBREW_COMMANDS}
        handleSelectScriptItem={setSelectedScript}
        selectedScript={selectedScript}
      />
    </div>
  );
};

export default SystemScriptsTab;
