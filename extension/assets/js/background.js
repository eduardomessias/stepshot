chrome.action.onClicked.addListener((tab) => {
    chrome.desktopCapture.chooseDesktopMedia(['screen','window','tab'],tab,(streamId) => {
        if (!streamId || !streamId.length) return -1
        const message = {name:'stream',streamId}
        chrome.tabs.sendMessage(tab.id, message, (response) => console.log(response))
    })
})


chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name !== 'name' || !message.url) return false
    const downloadOptions = {
        filename: 'screenshot.png',
        url: message.url
    }
    chrome.downloads.download(downloadOptions, (downloadId) => {senderResponse({sucess: true})})
    return true
})