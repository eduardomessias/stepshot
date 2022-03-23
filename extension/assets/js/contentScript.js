chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name !== 'stream' || !message.streamId) return false
    const mediaStreamConstraints = {
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: message.streamId
            }
        }
    }
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then((stream) => {
            let track = stream.getVideoTracks()[0]
            return new ImageCapture(track).grapFrame()
        })
        .then((bmp) => {
            let canvas = document.createElement('canvas')
            canvas.id = 'stepshot-canvas'
            canvas.width = bmp.width
            canvas.height = bmp.height
            let context = canvas.getContext('2d')
            context.drawImage(bmp, 0, 0, bmp.width, bmp.height)
            return canvas.toDataURL()
        })
        .then((url) => {
            const message = {
                name: 'download',
                url
            }
            chrome.runtime.sendMessage(message, (response) => {
                alert(response.success ? "Screenshot saved" : "Could not save screenshot")
                let canvas = document.getElementById('stepshot-canvas')
                senderResponse({success: true})
            })
        })
        .catch((err) => {
            alert("Could not save screenshot")
            senderResponse({success: false, message: err})
        })
        return true
})