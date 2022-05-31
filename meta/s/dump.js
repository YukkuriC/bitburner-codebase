import { player, doc } from '/meta/META'

function copyToClipboard(text, notify = 1) {
    var save = function (e) {
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
    }
    doc.addEventListener('copy', save);
    doc.execCommand('copy');
    doc.removeEventListener('copy', save);

    if (text.length > 100)
        text = `${text.substring(0, 100)}... (l=${text.length})`
    if (notify) return alert('Copied: ' + text)
}

export async function main(ns) {
    var server = player.getCurrentServer()
    var data = JSON.stringify(server.scripts)
    copyToClipboard(data)
}