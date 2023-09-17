import { ScriptItem } from '../models';
import ScriptItemListItem from './ScriptItemListItem';

type Props = {
  scripts: ScriptItem[];
  handleSelectScriptItem: (script: ScriptItem) => void;
};

const ScriptItemList = ({ scripts, handleSelectScriptItem }: Props) => {
  return (
    <div>
      {scripts.map(script => (
        <div className="border-bottom">
          <ScriptItemListItem script={script} onClick={() => handleSelectScriptItem(script)} />
        </div>
      ))}
    </div>
  );
};

export default ScriptItemList;
