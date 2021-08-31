// @flow
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';

import { translateFilters, dateFilters } from 'constants/Filters';
import messages from 'constants/Messages';
import DateRangePicker from 'components/DateRangePicker';

type DateRange = {
    fromDate: Date | string,
    toDate?: Date | string
};

type DefaultProps = {
    intl: intlShape
};
type Props = {
    defaultValue: DateRange,
    onChange: Function
} & DefaultProps;

type dateOptions = 'all' | 'month' | 'year' | 'range';

const useStyles = makeStyles({
    root: {
        display: 'inline-block',
        marginRight: '1em',
        textTransform: 'uppercase'
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        color: '#3C3F43',
        verticalAlign: 'middle'
    },
    input: {
        paddingLeft: '.5em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        color: '#979797',
        verticalAlign: 'middle',
        '&:hover': {
            color: '#3C3F43'
        }
    },
    icon: {
        color: '#979797',
        '&:hover': {
            color: 'yellow'
        }
    }
});

/**
 * @desc checks wether date range obj is only partial.
 *     ie { fromDate: Date, toDate: null }
 */
export const isPartialRange = (dateValue: DateRange) =>
    dateValue && dateValue.fromDate && !dateValue.toDate;

/**
 * @desc checks wether provided date is start of specified selector.
 *     Granularity is preset to days.
 */
export const isStartOf = (dateValue: Date, start: 'month' | 'year') =>
    moment(dateValue).isSame(moment().startOf(start), 'day');

/**
 * @desc date range drop-down selector + calendar pop-up
 * @arg defaultValue - default option to show
 * @arg onChange - change handler to call when user picks new date
 * @container - FacetDateRange
 */
export const DateRangeDropdown = (props: Props) => {
    // $FlowFixMe
    const { intl, onChange, defaultValue } = props;
    const classes = useStyles();

    let date = 'all'; // defaults to "all" -> null

    if (
        isPartialRange(defaultValue) &&
        isStartOf(defaultValue.fromDate, 'month')
    )
        date = 'month';

    if (
        isPartialRange(defaultValue) &&
        isStartOf(defaultValue.fromDate, 'year')
    )
        date = 'year';

    if (defaultValue && defaultValue.toDate && defaultValue.fromDate)
        date = 'range';

    const [menu, setMenu] = useState({
        open: false,
        date,
        anchor: null
    });

    // update date on props change
    useEffect(() => {
        setMenu(oldValues => ({
            ...oldValues,
            date
        }));
    }, [date]);

    const handleRangeClick = e => {
        e.stopPropagation();
        return false;
    };

    const handleOpen = event => {
        setMenu(oldValues => ({
            ...oldValues,
            anchor: event.currentTarget,
            open: true
        }));
    };

    const handleClose = () => {
        setMenu(oldValues => ({
            ...oldValues,
            anchor: null,
            open: false
        }));
    };

    const handleOptionChange = (option: dateOptions) => {
        setMenu(oldValues => ({
            ...oldValues,
            open: false,
            anchor: null,
            date: option
        }));

        let newDate = null;
        if (option === 'month')
            newDate = {
                fromDate: moment()
                    .startOf('month')
                    .toDate(),
                toDate: null
            };

        if (option === 'year')
            newDate = {
                fromDate: moment()
                    .startOf('year')
                    .toDate(),
                toDate: null
            };
        onChange(newDate);
    };

    const handleRangeChange = (from: string, to: string) => {
        onChange({
            fromDate: moment(from || undefined).toDate(),
            toDate: moment(to || undefined).toDate()
        });
    };

    const options = translateFilters(dateFilters, intl, messages);
    const label =
        menu.date === 'range' ? (
            <div onClick={handleRangeClick}>
                <DateRangePicker
                    onChange={handleRangeChange}
                    fromValue={defaultValue ? defaultValue.fromDate : null}
                    toValue={defaultValue ? defaultValue.toDate : null}
                />
            </div>
        ) : (
            <span>{menu.date}</span>
        );

    return (
        <div>
            <span className={classes.input} onClick={handleOpen}>
                {label}
                <ArrowDownIcon />
            </span>

            <Menu
                id="long-menu"
                anchorEl={menu.anchor}
                keepMounted
                open={menu.open}
                onClose={handleClose}
            >
                {options.map(option => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === menu.date}
                        onClick={() => {
                            handleOptionChange(option.value);
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

DateRangeDropdown.defaultValues = {
    defaultValue: null,
    onChange: null
};

export default injectIntl(DateRangeDropdown);
