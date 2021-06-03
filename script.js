const dropZone = document.getElementById('drop_zone')
dropZone.addEventListener('dragover', handleDragOver, false)
dropZone.addEventListener('drop', handleFileDrop, false)
dropZone.addEventListener('dragleave', handleDragLeave, false)

//const originalDropText = dropZone.innerText

// File input and file input button are linked.
// File input is for functionality, file input button is for display.
const fileInput = document.getElementById('choose_file_input')
const fileInputButton = document.getElementById('choose_file_button')
fileInput.addEventListener('change', handleFileSelect, false)
const originalFileInputText = fileInputButton.innerText

let inputFile

function handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'

    hoverDropZone()
}

function hoverDropZone() {
    dropZone.className === 'drop-ready' && (dropZone.className = 'drop-ready-hover')
    dropZone.className === 'drop-done' && (dropZone.className = 'drop-done-hover')
}

function handleDragLeave() { 
    dropZone.className === 'drop-ready-hover' && (dropZone.className = 'drop-ready')
    dropZone.className === 'drop-done-hover' && (dropZone.className = 'drop-done')
 }

function handleFileDrop(event) {
    event.stopPropagation()
    event.preventDefault()
    inputFile = event.dataTransfer.files[0]
    if(!inputFile) return

    updateFileName(inputFile.name)
    //resetFileInputsExcept(dropZone)
    setUploadDone()
    setProcessReady()
    setDownloadInactive()
}

function handleFileSelect(event) {
    inputFile = event.target.files[0]
    if(!inputFile) return

    updateFileName(inputFile.name)
    //resetFileInputsExcept(fileInputButton)
    setUploadDone()
    setProcessReady()
    setDownloadInactive()
}

const updateFileName = (inputFileName) => fileInputButton.innerText = inputFileName
const uploadHint = document.getElementById('upload_hint')

function setUploadDone () {
    uploadHint.className = 'done-hint'
    fileInputButton.className = 'done-button'
    dropZone.className = 'drop-done'
}

// function resetFileInputsExcept(inputException) {
//     if(inputException != fileInputButton) fileInputButton.innerText = originalFileInputText
//     if(inputException != dropZone) dropZone.innerText = originalDropText
// }

const processText = document.getElementById('process_text')
const processHint = document.getElementById('process_hint')
const processInput = document.getElementById('process_input')
const clearButton = document.getElementById('clear_button')
const clearInput = document.getElementById('clear_input')

function setProcessReady () {
    processText.className = 'process-text-readydone'
    processHint.className = 'ready-hint'
    processInput.className = 'process-input-ready'
}

let outputFile

clearButton.onclick = async () => {
    const clearText = clearInput.value
    const inputFileText = await inputFile.text()
    const fileTextLines = inputFileText.split('\n')

    let outputText = ''
    fileTextLines.forEach(line => {
        if( line.includes(clearText) ) return
        outputText += line + '\n'
    });
    outputFile = getOutputFile(inputFile.name, inputFile.type, outputText)

    if(outputFile) {
        setProcessDone()
        setDownloadReady()
    }
}

function getOutputFile(inputFileName, inputFileType, outputText) {
    const inputFileExtension = getFileExtension(inputFileName)
    const inputFileNameNoExtension = inputFileName.slice( 0, inputFileName.indexOf(inputFileExtension) ) 
    const processedFileName = inputFileNameNoExtension + '_cleared' + inputFileExtension
    
    return new File(
        [outputText], 
        processedFileName, 
        {type: inputFileType}
    )
}

function getFileExtension(fileName) {
    const fileNameSplit = fileName.split('.')
    return '.' + fileNameSplit[fileNameSplit.length - 1]
}

function setProcessDone() {
    processHint.className = 'done-hint'
    processInput.className = 'process-input-done'
}

const downloadHint = document.getElementById('download_hint')
const downloadButton = document.getElementById('download_button')
const fileInfo = document.getElementById('file_info')
const extensionDisplay = document.getElementById('file_extension')

function setDownloadReady() {
    downloadHint.className = 'ready-hint'
    downloadButton.className = 'ready-button'
    fileInfo.className = 'file-info-ready'
    extensionDisplay.innerText = getFileExtension(outputFile.name)
}

downloadButton.onclick = async () => {
    const outputText = await outputFile.text()

    let downloadElement = document.createElement('a')
    downloadElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputText))
    downloadElement.setAttribute('download', outputFile.name)
    downloadElement.style.display = 'none'
    document.body.appendChild(downloadElement)

    downloadElement.click()
    document.body.removeChild(downloadElement)

    setDownloadDone()
}

function setDownloadDone() {
    downloadHint.className = 'done-hint'
    downloadButton.className = 'done-button'
    fileInfo.className = 'file-info-done'
}

function setDownloadInactive() {
    downloadHint.className = 'inactive-hint'
    downloadButton.className = 'inactive-button'
    fileInfo.className = 'file-info-inactive'
}