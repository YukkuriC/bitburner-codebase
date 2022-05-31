# Folder: /meta/s
Code|Description|Dependency|Tags
-|-|-|-
[/meta/s/dump.js](./meta/s/dump.js)|write all scripts into clipboard<br>format: `{filename: content}`<br>receivers: `puller.py` and `/meta/s/load.js`|[/meta/META.js](./meta/META.js)|<b style="color:gold">EXE</b>, <b>ASYNC</b>, <b style="color:red">EXPLOIT</b>
[/meta/s/load.js](./meta/s/load.js)|accept dumped scripts from clipboard, and overwrite home server<br>providers: `pusher.py` and `/meta/s/dump.js`|[/meta/META.js](./meta/META.js)|<b style="color:gold">EXE</b>, <b>ASYNC</b>, <b style="color:red">EXPLOIT</b>
