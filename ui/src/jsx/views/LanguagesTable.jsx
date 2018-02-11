import React from 'react';
import _ from 'lodash';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class LanguageHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <tr>
            <th>Language</th>
            <th>Speakers</th>
            <th>Script</th>
        </tr>
    }
}

class LanguageRow extends LazyComponent
{
    render() {
        const {
            code, label, speakers, script
        } = this.props;

        return <tr data-name={code}>
            <td>{label}</td>
            <td>{speakers}</td>
            <td>{script}</td>
        </tr>
    }
};

class LanguageTable extends LazyComponent
{
    filterRow(pattern, row) {
        return (
            (row.label && row.label.match(pattern))
            || (row.speakers && row.speakers.match(pattern))
            || (row.script && row.script.match(pattern))
        );
    }

    render() {
        const {
            languages, search
        } = this.props;
        const pattern = new RegExp(search || '', "i");

        if (!languages) {
            return null;
        }

        const filtered = _.filter(
            languages, (lang) => this.filterRow(pattern, lang)
        );

        return <div className="languages-table">
            <h2 className="icon fa-language">Languages</h2>
            <table className="nice-table condensed bordered responsive">
                <thead key="thead">
                    <LanguageHeader/>
                </thead>
                <tbody key="tbody">
                    {_.map(filtered, (lang) => {
                        return <LanguageRow
                            key={lang.code}
                            {...lang}
                            />;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    LanguageTable,
    ['languages', 'search'],
    'items'
);
