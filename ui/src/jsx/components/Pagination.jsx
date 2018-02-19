import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_pagination.scss';

import LazyComponent from '../components/LazyComponent.jsx';

class Pagination extends LazyComponent
{
    constructor(props) {
        super(props);
        this.maxSteps = 5;
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
            <ul className="pagination nice-pagination bordered small" role="navigation">
                <li className="pagination__previous">
                {current
                    ? <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            this.onPaging(current - limit);
                        }}
                        >
                        Previous
                    </a>
                    :
                    <span className="disabled">
                        Previous
                    </span>
                }
                </li>

                {_.map(range, ({offset, page}) => (
                    (offset == current)
                        ? <li  key={page} className="current">
                            <span>{page}</span>
                        </li>
                        : <li key={page}>
                            <a href="#" onClick={e => {
                                e.preventDefault();
                                this.onPaging(offset);
                                }}
                                >
                                {page}
                            </a>
                        </li>
                ))}

                <li className="pagination__next">
                {((current + limit) < total)
                    ? <a
                        href="#"
                        className="pagination__next"
                        onClick={e => {
                            e.preventDefault();
                            this.onPaging(current + limit);
                        }}
                        >
                        Next
                    </a>
                    : <span className="disabled">
                        Next
                    </span>
                }
                </li>
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