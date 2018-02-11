import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';

class Pagination extends LazyComponent
{
    constructor(props) {
        super(props);
        this.maxSteps = 10;
    }

    onPaging(offset) {
        const {
            limit, total, setOffset
        } = this.props;
        if (offset >= total) {
            offset = 0;
        }
        setOffset(offset);
    }

    componentWillReceiveProps(nextProps) {
        const {
            limit, total, setOffset
        } = this.props;
        if (
            nextProps.limit != limit
            || nextProps.total != total
        ) {
            setOffset(0);
        }
    }

    render() {
        const {
            offset: current, limit, total
        } = this.props;

        if (total <= limit) {
            return null;
        }
        let range = _.map(
            _.range(0, total, limit),
            (step, page) => {
                return {
                    offset: step,
                    page: page + 1
                };
            },
            []
        );
        if (range.length > this.maxSteps) {
            // Snap offset to increments of 10.
            let snap = Math.round(total / (this.maxSteps*10)) * 10;
            let filtered = _.range(0, total, snap).concat([
                current - limit,
                current,
                current + limit
            ]);
            range = _.filter(
                range,
                (step) => _.includes(filtered, step.offset)
            );
        }

        return <nav>
            <ul className="nice-pagination bordered small" role="navigation">
                {current
                    ? <li>
                        <a href="#" onClick={e => {
                            e.preventDefault();
                            this.onPaging(current - limit);
                        }}>
                            &laquo; Previous
                        </a>
                    </li>
                    : <li className="disabled">
                        <span>
                            &laquo; Previous
                        </span>
                    </li>
                }

                {_.map(range, ({offset, page}) => {
                    if (offset == current) {
                        return <li  key={page} className="current">
                            <span>{page}</span>
                        </li>;
                    }
                    return <li key={page}>
                        <a href="#" onClick={e => {
                            e.preventDefault();
                            this.onPaging(offset);
                        }}>
                            {page}
                        </a>
                    </li>
                })}

                {((current + limit) < total)
                    ? <li>
                        <a href="#" onClick={e => {
                            e.preventDefault();
                            this.onPaging(current + limit);
                        }}>
                            Next &raquo;
                        </a>
                    </li>
                    : <li className="disabled">
                        <span>
                            Next &raquo;
                        </span>
                    </li>
                }
            </ul>
        </nav>;
    }
}

Pagination.propTypes = {
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    setOffset: PropTypes.func.isRequired,
};

export default Pagination;