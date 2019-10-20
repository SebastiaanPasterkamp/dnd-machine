import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import utils from '../../utils.jsx';

import './sass/_responsive-table.scss';

const ResponsiveTable = function({
    items,
    headerComponent: HeaderComponent,
    rowComponent: RowComponent,
    footerComponent: FooterComponent,
    className,
}) {
    if (!items) {
        return null;
    }

    const style = utils.makeStyle({}, [
        'responsive-table nice-table condensed bordered responsive',
        className,
    ]);

    return (
        <table className={style}>
            {HeaderComponent ? (
                <thead>
                    <HeaderComponent />
                </thead>
            ) : null}
            <tbody>
                {map(
                    (item) => (
                        <RowComponent
                            key={item.id}
                            {...item}
                        />
                    )
                )(items)}
                {FooterComponent ? <FooterComponent /> : null}
            </tbody>
        </table>
    );
};

ResponsiveTable.propTypes = {
    items: PropTypes.oneOfType([
        PropTypes.arrayOf( PropTypes.shape({
            id: PropTypes.number.isRequired,
        }) ),
        PropTypes.objectOf( PropTypes.shape({
            id: PropTypes.number.isRequired,
        }) ),
    ]),
    headerComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    rowComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
    footerComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    className: PropTypes.string,
};


ResponsiveTable.defaultProps = {
    items: [],
    headerComponent: null,
    footerComponent: null,
    className: null,
};

export default ResponsiveTable;
