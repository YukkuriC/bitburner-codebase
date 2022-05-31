# Folder: /meta/s
Code|Description|Dependency|Tags
-|-|-|-
[/meta/s/dump.js](./dump.js)|write all scripts into clipboard<br>format: `{filename: content}`<br>receivers: `puller.py` and `/meta/s/load.js`|[/meta/META.js](../META.js)|[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![exploit](https://img.shields.io/badge/-exploit-%23ff0000)](#exploit)
[/meta/s/load.js](./load.js)|accept dumped scripts from clipboard, and overwrite home server<br>providers: `pusher.py` and `/meta/s/dump.js`|[/meta/META.js](../META.js)|[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![exploit](https://img.shields.io/badge/-exploit-%23ff0000)](#exploit)
