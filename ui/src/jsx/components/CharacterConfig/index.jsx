import baseConfig from './config/base.json';
import CharacterConfig from './CharacterConfig.jsx';
import CharacterEditorWrapper from './hocs/CharacterEditorWrapper.jsx';
import ChoiceSelect from './components/ChoiceSelect.jsx';
import {
    ComputeChange,
    ComputeConfig,
} from './utils/ComputeChange.jsx';
import DictPropertySelect from './components/DictPropertySelect.jsx';
import ListPropertySelect from './components/ListPropertySelect.jsx';
import ManualInputSelect from './components/ManualInputSelect.jsx';
import MultipleChoiceSelect from './components/MultipleChoiceSelect.jsx';
import SelectPropertySelect from './components/SelectPropertySelect.jsx';
import StatisticsSelect from './components/StatisticsSelect.jsx';
import ValuePropertySelect from './components/ValuePropertySelect.jsx';

export default CharacterConfig;
export {
    baseConfig,
    CharacterEditorWrapper,
    CharacterConfig,
    ChoiceSelect,
    ComputeChange,
    ComputeConfig,
    DictPropertySelect,
    ListPropertySelect,
    ManualInputSelect,
    MultipleChoiceSelect,
    SelectPropertySelect,
    StatisticsSelect,
    ValuePropertySelect,
};
