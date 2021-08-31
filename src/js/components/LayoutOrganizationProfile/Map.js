// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GMAPS_API_KEY } from 'constants/Config';
import { injectIntl, intlShape } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import GoogleMapReact from 'google-map-react';
import messages from 'constants/Messages';
import Card from 'components/Card';

const DEFAULT_LAT = 59.95;
const DEFAULT_LONG = 30.33;
const DEFAULT_ZOOM = 11;

type DefaultProps = {
    intl: intlShape
};

type Props = {
    // address: string,
    // city: string,
    // country: string
} & DefaultProps;

const useStyles = makeStyles({
    map: {
        height: '20em'
    },
    header: {
        fontWeight: '400!important',
        fontSize: '15px!important'
    }
});

const Map = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <div className="map-section">
            <Card>
                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.header}
                >
                    {intl.formatMessage(messages.location)}
                </Typography>

                <div className={classes.map}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: GMAPS_API_KEY
                        }}
                        defaultCenter={{
                            lat: DEFAULT_LAT,
                            lng: DEFAULT_LONG
                        }}
                        defaultZoom={DEFAULT_ZOOM}
                    />
                </div>
            </Card>
        </div>
    );
};

export default injectIntl(Map);
