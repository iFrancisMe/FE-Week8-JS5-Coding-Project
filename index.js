/*
    Week 8 Coding project
    Title: My Server Cabinet
    Menu program using browser alerts and prompts
*/

// Class Definitions

class Cabinet {  // Class representing rackmount cabinet
    
    constructor(size) {

        this.size = size; // How many spaces cabinet can provide
        this.enclosure = new Array(size); // Array representing the actual rack holding the devices
        
    }
    
    // Boolean methods

    isEmpty() { // Returns true if cabinet is empty
        if (this.getDeviceCount() === 0) return true;
    }

    doesItFit(size, rackPosition) { // Method to check if a desired device size would fit in a desired location
        let freeSpaces = 0;
        for (let i = rackPosition; i < rackPosition + size && i < this.enclosure.length; i++) { // If space is free, check if big enough
            if (this.enclosure[i] === undefined) {
                freeSpaces++;
            }
        }
        if (freeSpaces >= size) {
            return true;
        } else {
            return false;
        }
    }

    // Accessor methods
    getDeviceLocatedAt(rackPosition) { 
        // Method returns location of RackmountDevice object. Each filled space in rack
        // is occupied by either a RackmountDevice object or a filler object representing
        // the RackmountDevice object. If given a location of a filler object, this method
        // iterates upward until the RackmopuntDevice object is located.

        let device = this.enclosure[rackPosition];

        if (device === undefined) {
            return null;
        } else {
            let deviceObject;

            while (rackPosition >= 0 && device instanceof RackmountDevice == false) {
                rackPosition--;
                device = this.enclosure[rackPosition];
            }

            deviceObject = {Object: device, location: rackPosition};
            return deviceObject;
        }
        
    }

    getAvailableSlots(deviceSize = 1, initialPosition = 0) { // Returns an array of all open slots that can accomodate a specified size
        console.log(`Getting all available slots starting at ${initialPosition}`);
        let availablePositions = [];
        
        for (let i = initialPosition; i <= this.enclosure.length; i++) {
            let currentPosition = i;
            let obj = this.enclosure[currentPosition];
            
            if (obj === undefined) {
                let openSpace = currentPosition;
                if (this.doesItFit(deviceSize, openSpace)) {
                    availablePositions.push(openSpace);
                }
            }
        }
        console.log(availablePositions);
        return availablePositions; 
    }

    getNextAvailableSlot(size = 1, initialPosition = 0) { // Returns first available slot that can accomodate the specified size
        console.log(`Getting next available slot from slot ${initialPosition}`);
        return this.getAvailableSlots(size, initialPosition)[0];
    }

    // Mutator methods
    addDevice(deviceObject, rackmountPosition) { 
        // Method to add device object to the array. Additional filler objects are created to occupy 
        // the remaining slots taken up by the size of the device.

        console.log(`${deviceObject.deviceName} fits = ${this.doesItFit(deviceObject.size, rackmountPosition)}`);
        if (deviceObject instanceof RackmountDevice && this.doesItFit(deviceObject.size, rackmountPosition)) {
            console.log('Adding device');
            this.enclosure[rackmountPosition] = deviceObject;

            for (let i = rackmountPosition + 1; i < rackmountPosition + deviceObject.size; i++) {
                this.enclosure[i] = {deviceType: deviceObject.deviceType, size: deviceObject.size, deviceName: deviceObject.deviceName};
            }
            console.log(this.enclosure);
            return true;
        } else {
            return false;
        }
    }

    removeDevice(rackPosition) { // Removes a device from the cabinet array
        
        console.log(`Removing device at ${rackPosition}`);
        let deviceObject = this.getDeviceLocatedAt(rackPosition);
        if (deviceObject != null) {
            console.log(`Freeing spaces ${rackPosition} through ${rackPosition + deviceObject.Object.size}`);
            if (rackPosition >= 0) {
                for (let i = rackPosition; i < rackPosition + deviceObject.Object.size; i++) {
                    this.enclosure[i] = undefined;
                }
            }
            return true;
        } else {
            return false;
        }
        
    }

    showCabinet() { // Assembles string of characters to represent an image of the current state of the cabinet
        let strImageASCII;
        const maxRowDescriptionLength = 25;
        const maxRowLength = 30;
        
        let topTrim = Array(maxRowLength).fill('=').join('') + '\n';
        let bottomTrim = topTrim;
        
        strImageASCII = topTrim + topTrim;
        
        for (let index = 0; index < this.enclosure.length; index++) {

            let device = this.enclosure[index];
            let description = '';
            
            if (device instanceof RackmountDevice) {
                description = device.deviceName;
            } else if (device === undefined) {
                description = 'Available';
            } else if (typeof(device) == 'object') {
                description = `Filled by ${device.deviceName}`;
            }
        
            if (description.length > maxRowDescriptionLength) {
                description = description.slice(0, maxRowDescriptionLength);
            }
            
            let row = `|| ${index}. ${description}\n`;
            
            strImageASCII += row;
        }
        
        strImageASCII += bottomTrim;
        return strImageASCII;
    }

}

class RackmountDevice { // Class representing the most basic rackmount device
    
    static #deviceTypes = []; // Static private array to keep track of unique device types, such as server, router, switch, accessory, etc.
    
    constructor(deviceSize = 1, deviceType = 'Accessory', deviceName) {
        this.size = deviceSize; // The device size in Units that will be occupied in cabinet
        this.deviceType = deviceType; // Device type, such as router, switch, server, etc.

        if (deviceName === undefined) {
            this.deviceName = 'My' + deviceType; // Default device name to identify device (description)
        } else {
            this.deviceName = deviceName; // Assigns name if supplied as argument to constructor
        }

        this.#addDeviceType(this.deviceType); // adds new device types to the static array
    }

    #addDeviceType(deviceType) { // Private method for adding new device types to the static array
        if (this.getDeviceTypes(this.deviceType) === false) { // If device type does not exist in array
            RackmountDevice.#deviceTypes.push(this.deviceType);
        }
    }

    getDeviceTypes(searchFilter) { // Returns array of tracked device types from static array
        let types = RackmountDevice.#deviceTypes;
        let deviceExists = false;
        if (searchFilter) {
            
            if (types.length === 0) {
                return false;
            }
            else {
                for (let deviceType in types) {
                    (deviceType === searchFilter) ? deviceExists = true : deviceExists = false;
                }
                

                return deviceExists;
            }
        } else {
            return types;
        }
    }

}

class NetworkDevice extends RackmountDevice { // Class representing a network capable device. Inherits from RackmountDevice.
    constructor(deviceSize, deviceType, deviceName) {
        super(deviceSize, deviceType, deviceName);
        this.hostname = deviceName; // Network devices have a hostname property, also usable as a description for identification
        this.IP = ''; // IP address

    }

}

class Server extends NetworkDevice { // Class represnting a server. Inherits from NetworkDevice
    constructor(deviceSize = 1, deviceName) {
        super(deviceSize, 'Server', deviceName); // Instantiating this class adds type to RackmountDevice static array
    }
}

class NetworkRouter extends NetworkDevice { // Class representing a network router. Inherits from NetworkDevice.
    constructor(deviceSize, deviceName) {
        super(deviceSize, 'Router', deviceName); // Device type
    }
}

class NetworkSwitch extends NetworkDevice { // Class representing a network switch. Inherits from NetworkDevice.
    constructor(deviceSize, deviceName) {
        super(deviceSize, 'Switch', deviceName); // Device type
    }
}

class Menu { // Menu class 
    constructor() {
    }

    welcome() { // Welcome message when cabinet is empty

        if (testing) return;
    
        if (cabinet.isEmpty) {
            output(`Welcome to my rackmount cabinet. It is empty right now but you are welcome to fill it up. There are ${cabinet.size} total spaces available.`);
        } 
        
        this.mainMenu(); // Start main menu
    
    }

    mainMenu() { // Main menu
        let userResponse;
        
        do {
            userResponse = output(`
            Select the menu option below to proceed.
    
            1. Add Device
            2. Remove Device
            3. Move Device
            4. Show Cabinet
    
            0. Exit
    
            `, true);
            
            let subMenu = userResponse;
    
            switch(subMenu) {
                case '1': // Add device
                    this.addDeviceMenu();
                    break;;
                case '2': // Remove device
                    this.removeDeviceMenu();
                    break;;
                case '3': // Move device
                    this.moveDeviceMenu();
                    break;;
                case '4': // Show Cabinet
                    output(`${this.getDeviceMap()}`);
                    break;
                default:
                    break;;
            }
        } while (userResponse != '' || userResponse != 0);
    }

    addDeviceMenu(menuOption) { // Submenu for adding new devices to cabinet
        //
        let deviceType = output(`
        What kind of device are you adding?
        
        1. Server
        2. Network Router
        3. Network Switch
        4. Accessory
        `, true);
    
        let deviceName = output(`
        \nEnter a name for identifying the device, such as hostname or description.
        `, true);
    
        let deviceSize = output(`
        \nHow many unit spaces does the device take up?
        `, true);
    
        deviceSize = parseInt(deviceSize); // Convert string from user input into number
    
        let deviceLocation = output(`
        \nIn which space number do you want to install your new device?\n
        \nLeave blank for first available location.\n
        \n${this.getDeviceMap()} \n\n\n
        `, true);
    
        if (deviceLocation == '') {
            deviceLocation = cabinet.getNextAvailableSlot(deviceSize);
        } else {
            deviceLocation = parseInt(deviceLocation); // Convert user input to number
        }
    
        let device;
    
        switch(deviceType) { // Instantiate new objects based on user selected device class
    
            case '1': // Server
                device = new Server(deviceSize, deviceName);
                break;;
            case '2': // Router
                device = new NetworkRouter(deviceSize, deviceName);
                break;;
            case '3': // Switch
                device = new NetworkSwitch(deviceSize, deviceName);
            case '4': // Accessory
                device = new RackmountDevice(deviceSize, 'Accessory', deviceName);
                break;
            default:
                break;;
        }
    
        if (device instanceof RackmountDevice) {
            let successful = cabinet.addDevice(device, deviceLocation); // Attempt to add device to cabinet array
    
            if (successful) {
                output(`
                \nYour device, ${deviceName} is now installed in space ${deviceLocation}.
                `)
            } else {
                output(`
                \nSomething went wrong with adding the device.
                `)
            }
        }
    }

    removeDeviceMenu() { // Submenu for removing device from cabinet
        let userSelection;
    
        while ((userSelection >= 0) == false || (userSelection > cabinet.size)) { // Validates user input to correspond to cabinet size
            userSelection = output(`
            \nEnter the slot number for the device you would like to remove from cabinet.\n
            \n${this.getDeviceMap()}
    
            `, true);
            userSelection = parseInt(userSelection);
        }
    
        let obj = cabinet.getDeviceLocatedAt(userSelection); // User might have given a location of filler object. We to make sure we have the RackmountDevice object.
        if (obj != null) {
            let realLocation = obj.location;
            cabinet.removeDevice(realLocation);
            output(`
            \nDevice has been removed from location at ${realLocation}, freeing up ${obj.Object.size} spaces.\n
            \n${this.getDeviceMap()}
            `);
        } else {
            output(`
            \nThere seems to be a problem removing your device or there was no device at given location.
            `);
        }
    }

    moveDeviceMenu() { // Submenu for moving a device to another location. 
        let userSelection;

        userSelection = output(`
        \nEnter the space number for the device you want to move.
        \n${this.getDeviceMap()}
        `, true)

        userSelection = parseInt(userSelection); // Convert user input from string to number
        let tempDevice = cabinet.getDeviceLocatedAt(userSelection);

        // Attemt to remove device
        if (tempDevice != null) {
            let removalSuccess = cabinet.removeDevice(tempDevice.location);
            if (removalSuccess) {
                userSelection = output(`
                \nDevice has been successfully removed from space number ${tempDevice.location}.

                \nEnter the number for the new location you want to move the device.

                \n${this.getDeviceMap()}
                `, true)
                
                userSelection = parseInt(userSelection); // Convert to number

                // Attempt to add devic eback into array at new location
                let installSuccess = cabinet.addDevice(tempDevice.Object, userSelection);

                if (installSuccess) {
                    output(`
                    \nThe device has been successfully moved from space ${tempDevice.location} to ${userSelection}.
                    `);
                    tempDevice = null; // Do not need this anymore
                } else {
                    output(`
                    \nThere seems to be a problem with reinstalling your device at desired location.
                    `)
                }
            } else {
                output(`
                \nThere seems to be a problem removing the device or there was no device at the location you entered.
                `)
            }
        }
    }

    getDeviceMap() { // Returns string of ASCII art representing cabinet
        return cabinet.showCabinet();
    }
}

// End Class Definitions


// Functions

function output(message, isPrompt) { // Output function to send all output to console during testing
    if (testing) {
        console.log(`${message}`);
    } else if (isPrompt) { // Sends prompt or alert based on boolean value passed or no boolean passed
        return prompt(message);
    } else {
        alert(message);
    }
}

// End Functions



let testing = false;
let cabinet = new Cabinet(12);

let menu = new Menu();
menu.welcome();
