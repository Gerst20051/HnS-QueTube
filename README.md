HnS QueTube
========  

HnS QueTube is a YouTube Queue. Replace the DJ! Hosting a party, no problem, let your guests decide what music plays!
-------------------------------
[HnS QueTube](http://hns.netai.net/quetube/) 
[HnS QueTube w/o Rooms](http://hnsyoutube.webs.com/quetube.html) 

# YouTube Developer Account (API Key)

https://console.cloud.google.com/cloud-resource-manager

https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials?authuser=1&inv=1&invt=Abi50g&project=youtube-watch-later-playlist

Email: gerst20051@gmail.com
Project Name: YouTube Watch Later Playlist

# Sync Files To Droplet

`[$]> rsync -zarvh src/ droplet:www/quetube`

`[$]> scp -r src/[\!.]* droplet:www/quetube`

`[$]> sed -i '' -e "s#'LOCAL', true#'LOCAL', false#1" www/quetube/config.inc.php`

`[$]> ssh droplet 'sed -i -e "s#'\''LOCAL'\'', true#'\''LOCAL'\'', false#1" www/quetube/config.inc.php'`

`Creator: Andrew Gerst`
