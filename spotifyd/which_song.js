const DBus = require('dbus');
var bus = DBus.getBus('session');

bus.getInterface('org.mpris.MediaPlayer2.spotifyd', '/org/mpris/MediaPlayer2', 'org.mpris.MediaPlayer2.Player', function (err, iface) {
	iface.getProperties(function (err, props) {
        console.log(props.Metadata['xesam:title'])
    });
});