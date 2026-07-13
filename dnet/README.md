<!-- begin script info -->
# Folder: /dnet
Code|Description|Dependency|Tags
-|-|-|-
[/dnet/copier.ts](./copier.ts)|copy all dnet scripts to dest|-|[![TS](https://img.shields.io/badge/-TS-blue)](#TS)[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![hack](https://img.shields.io/badge/-hack-green)](#hack)
[/dnet/daemon.ts](./daemon.ts)|periodically auto-hack & spread scripts to neighbors|[/dnet/libs/callLib.ts](./libs/callLib.ts)|[![TS](https://img.shields.io/badge/-TS-blue)](#TS)[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![hack](https://img.shields.io/badge/-hack-green)](#hack)
[/dnet/hack.ts](./hack.ts)|hack input dnet node|[/dnet/libs/hackLib.ts](./libs/hackLib.ts)<details><summary>MORE</summary>[/dnet/crackers/crackers.ts](./crackers/crackers.ts)</details>|[![TS](https://img.shields.io/badge/-TS-blue)](#TS)[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)
[/dnet/main.ts](./main.ts)|entry deploying daemons starting from darkweb<br>called on home server|[/dnet/libs/callLib.ts](./libs/callLib.ts)|[![TS](https://img.shields.io/badge/-TS-blue)](#TS)[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![hack](https://img.shields.io/badge/-hack-green)](#hack)
[/dnet/postHack.ts](./postHack.ts)|prepare server to run after acquired session|[/dnet/libs/callLib.ts](./libs/callLib.ts)|[![TS](https://img.shields.io/badge/-TS-blue)](#TS)[![exe](https://img.shields.io/badge/-exe-gold)](#exe)[![async](https://img.shields.io/badge/-async-black)](#async)[![hack](https://img.shields.io/badge/-hack-green)](#hack)
