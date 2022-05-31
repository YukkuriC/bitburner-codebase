# YukkuriC's Bitburner code base
YukkuriC's codebase for Bitburner ([Steam](https://store.steampowered.com/app/1812820/) & [Github](https://github.com/danielyxie/bitburner))

<!-- end header -->

# Folders
Folder|Path|Description
-|-|-
Root|[/](./)|Basic module & frequent used actions
Informations|[/i](./i)|General query and calculations
Actions|[/a](./a)|__Normal__ actions with basic API
Meta|[/meta](./meta)|~~__METAVERSE!__~~ Actions with __exploits__ 
Sync scripts|[/meta/s](./meta/s)|Sync codes between _inside_ and _outside_
Singularity Actions|[/s](./s)|Actions with heavy __EXPLOITS__ and [BN4's Singularity API](https://github.com/danielyxie/bitburner/blob/master/markdown/bitburner.singularity.md)
Deploy unit|[/unit](./unit)|Scripts to deploy among rooted servers
Coding contracts|[/c](./c)|Coding contract solver _TODO_
Outdated scripts|[/old](./old)|Scripts with better choice

# Folder: /
Code|Description|Dependency|Tags
-|-|-|-
[/BASE.js](./BASE.js)|basic constants and functions|-|<b>ASYNC</b>, <b style="color:cyan">SEARCH</b>
[/boot.js](./boot.js)|first commands to run after reset|[/BASE.js](./BASE.js)<br>[/meta/exec.js](./meta/exec.js)<details><summary>MORE</summary>[/meta/META.js](./meta/META.js)</details>|<b style="color:gold">EXE</b>, <b>ASYNC</b>, <b style="color:magenta">SINGULARITY</b>, <b style="color:red">EXPLOIT</b>
[/GOTO.js](./GOTO.js)|auto connect to a distant server|[/i/route.js](./i/route.js)<br>[/meta/exec.js](./meta/exec.js)<details><summary>MORE</summary>[/meta/META.js](./meta/META.js)<br>[/BASE.js](./BASE.js)</details>|<b style="color:gold">EXE</b>, <b>ASYNC</b>, <b style="color:cyan">INFO</b>, <b style="color:cyan">SEARCH</b>, <b style="color:magenta">SINGULARITY</b>, <b style="color:red">EXPLOIT</b>
