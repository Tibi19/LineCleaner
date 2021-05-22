// Just use the workaround from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server

const dropZone = document.getElementById('drop_zone')
dropZone.addEventListener('dragover', handleDragOver, false)
dropZone.addEventListener('drop', handleFileDrop, false)
dropZone.addEventListener('dragleave', handleDragLeave, false)
const originalDropStyle = dropZone.style
const originalDropText = dropZone.innerText
const hoverDropStyle = 'color: #ddd; border-color: #dfdfdf'

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

    dropZone.style = hoverDropStyle
}

function handleDragLeave() { dropZone.style = originalDropStyle }

function handleFileDrop(event) {
    event.stopPropagation()
    event.preventDefault()
    inputFile = event.dataTransfer.files[0]
    if(!inputFile) return

    dropZone.innerText = inputFile.name
    dropZone.style = originalDropStyle
    resetFileInputsExcept(dropZone)
    enableProcessButton()
}

function handleFileSelect(event) {
    inputFile = event.target.files[0]
    if(!inputFile) return

    fileInputButton.innerText = inputFile.name
    resetFileInputsExcept(fileInputButton)
    enableProcessButton()
}

function resetFileInputsExcept(inputException) {
    if(inputException != fileInputButton) fileInputButton.innerText = originalFileInputText
    if(inputException != dropZone) dropZone.innerText = originalDropText
}

const processButton = document.getElementById('process_file')
const enableProcessButton = () => processButton.className = 'enabled-button'
const clearInput = document.getElementById('clear_input')
let outputFile

processButton.onclick = async () => {
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
        updateProcessedFileName()
        enableDownloadButton()
    }
}

function getOutputFile(inputFileName, inputFileType, outputText) {
    const inputFileNameSplit = inputFileName.split('.')
    const inputFileExtension = '.' + inputFileNameSplit[inputFileNameSplit.length - 1]
    const inputFileNameNoExtension = inputFileName.slice( 0, inputFileName.indexOf(inputFileExtension) ) 
    const processedFileName = inputFileNameNoExtension + '_cleared' + inputFileExtension
    
    return new File(
        [outputText], 
        processedFileName, 
        {type: inputFileType}
    )
}

const downloadButton = document.getElementById('download_file')
const enableDownloadButton = () => downloadButton.className = 'enabled-button'
const updateProcessedFileName = () => document.getElementById('processed_file_name').innerText = outputFile.name

downloadButton.onclick = async () => {
    const outputText = await outputFile.text()

    let downloadElement = document.createElement('a')
    downloadElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputText))
    downloadElement.setAttribute('download', outputFile.name)
    downloadElement.style.display = 'none'
    document.body.appendChild(downloadElement)

    downloadElement.click()
    document.body.removeChild(downloadElement)
}