// Import required modules from Electron
const { app, BrowserWindow } = require('electron')

// Function to create the main application window
function createWindow(){

    // Create a new browser window with specified width and height
    const win = new BrowserWindow({
        width: 1000,
        height: 700
    })

    // Load the main HTML file into the application window
    win.loadFile('index.html')
}

// When Electron is ready, call the createWindow function
app.whenReady().then(createWindow)