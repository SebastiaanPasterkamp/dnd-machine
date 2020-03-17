import baseConfig from './config/base.json';
import CharacterConfig from './CharacterConfig';
import CharacterEditorWrapper from './hocs/CharacterEditorWrapper';
import ChoiceSelect from './components/ChoiceSelect';
import {
    ComputeChange,
    ComputeConfig,
} from './utils';
import DictPropertySelect from './components/DictPropertySelect';
import ListPropertySelect from './components/ListPropertySelect';
import ManualInputSelect from './components/ManualInputSelect';
import MultipleChoiceSelect from './components/MultipleChoiceSelect';
import ObjectListPropertySelect from './components/ObjectListPropertySelect';
import SelectPropertySelect from './components/SelectPropertySelect';
import StatisticsSelect from './components/StatisticsSelect';
import ValuePropertySelect from './components/ValuePropertySelect';

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
    ObjectListPropertySelect,
    SelectPropertySelect,
    StatisticsSelect,
    ValuePropertySelect,
};
