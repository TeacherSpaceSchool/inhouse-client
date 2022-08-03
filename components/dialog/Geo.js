import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import GpsFixed from '@mui/icons-material/GpsFixed';
import DG from '2gis-maps';

const Geo =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showSnackBar } = props.snackbarActions;
        const { showFullDialog } = props.mini_dialogActions;
        const { geo, setAddressGeo } = props;
        const map = useRef(null);
        const lockMove = useRef(false);
        const marker = useRef(null);
        let [newGeo, setNewGeo] = useState(geo?geo:[42.8700000, 74.5900000]);
        let getGeo = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position)=>{
                    setNewGeo([position.coords.latitude, position.coords.longitude])
                    marker.current.setLatLng([position.coords.latitude, position.coords.longitude])
                    map.current.panTo([position.coords.latitude, position.coords.longitude])
                });
            } else {
                showSnackBar('Геолокация не доступна')
            }
        }
        useEffect(() => {
            map.current = new DG.Map('map', {
                center: newGeo,
                zoom: 16,
                poi: false,
                doubleClickZoom: false,
                zoomControl: false,
                fullscreenControl: false
            })
            marker.current = DG.marker(newGeo).addTo(map.current)
            map.current.on('click', function(e) {
                if(setAddressGeo) {
                    map.current.panTo([e.latlng.lat, e.latlng.lng])
                }
            });
            map.current.on('zoomstart', function() {
                if(lockMove.current)
                    clearTimeout(lockMove.current)
                lockMove.current = setTimeout(()=>{lockMove.current = false}, 500)
            });
            map.current.on('move', function() {
                if(setAddressGeo){
                    marker.current.setLatLng([map.current.getCenter().lat, map.current.getCenter().lng])
                }
            });
            map.current.on('moveend', function() {
                if(setAddressGeo) {
                    setNewGeo([map.current.getCenter().lat, map.current.getCenter().lng])
                    marker.current.setLatLng([map.current.getCenter().lat, map.current.getCenter().lng])
                }
            });

            return () => {
                map.current.remove()
            }
        }, []);
        return (
            <>
            <div className={classes.column}>
                <div id='map' style={{height: window.innerHeight-128, width: window.innerWidth-48, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </div>
                <center style={{width: '100%'}}>
                    {
                        setAddressGeo?
                            <Button variant='contained' color='primary' onClick={async()=>{
                                await setAddressGeo(newGeo)
                                showFullDialog(false);
                            }} className={classes.button}>
                                Принять
                            </Button>
                            :
                            null
                    }
                    <Button variant='contained' color='secondary' onClick={()=>{showFullDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </center>
            </div>
            {
                setAddressGeo?
                    <Fab color='primary' aria-label='Найти геолокацию' className={classes.fabGeo} onClick={getGeo}>
                        <GpsFixed/>
                    </Fab>
                    :null}
            </>
        );
    }
)

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Geo);