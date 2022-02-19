const DBus = require('dbus');
const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const notifier = require('node-notifier');
const path = require('path');
var bus = DBus.getBus('session');
const HandyStorage = require('handy-storage');
const storage = new HandyStorage({
	beautify: true
});
storage.connect('/home/paras/.config/spotifyd/is_playing.json');

bus.getInterface('org.mpris.MediaPlayer2.spotifyd', '/org/mpris/MediaPlayer2', 'org.mpris.MediaPlayer2.Player', function (err, iface) {
	iface.getProperties(function (err, props) {
		let metaData = props.Metadata;
		fs.readFile('/home/paras/.config/spotifyd/is_playing.json', 'utf-8', (err, playing) => {
			playing = JSON.parse(playing);

			if (playing['playing_track'] !== metaData['mpris:trackid']) {
				storage.setState({
					playing_track: metaData['mpris:trackid']
				})
				const file = fs.createWriteStream("/home/paras/.config/spotifyd/album_art/Album_Art.jpeg");
				const request = http.get(metaData['mpris:artUrl'], function (response) {
					response.pipe(file);
					file.on('finish', function () {
						notifier.notify(
							{
								title: metaData['xesam:title'],
								message: metaData['xesam:albumArtist'][0] + ` ( ` + metaData['xesam:album'] + ' )',
								icon: '/home/paras/.config/spotifyd/album_art/Album_Art.jpeg'
							},
							() => {
								process.exit();
							}
						);
					});
				})
			}
			else {
				process.exit()
			}
		});
	});
});
