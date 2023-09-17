import { ScriptItem } from '../models';
import ScriptItemListItem from './ScriptItemListItem';

type Props = {
  scripts: ScriptItem[];
  selectedScript: ScriptItem | undefined;
  handleSelectScriptItem: (script: ScriptItem) => void;
};

const ScriptItemList = ({ scripts, selectedScript, handleSelectScriptItem }: Props) => {
  return (
    <div>
      {scripts.map(script => (
        <div className="border-bottom">
          <ScriptItemListItem
            script={script}
            isSelected={`${selectedScript?.command}` === `${script.command}`}
            onClick={() => handleSelectScriptItem(script)}
          />
        </div>
      ))}
    </div>
  );
};

export default ScriptItemList;
