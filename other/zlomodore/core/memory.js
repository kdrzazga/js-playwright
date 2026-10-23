class Memory {
    constructor(size = 0x10000) {
        this.bytes = new Uint8Array(size);
    }

    read(address) {
        return this.bytes[address];
    }

    write(address, value) {
        this.bytes[address] = value & 0xFF;
    }

    clear() {
        this.bytes.fill(0);
    }
}

class ColorRam {
    constructor(size = 1024) {
        this.nibbles = new Uint8Array(size);
    }

    read(offset) {
        return this.nibbles[offset];
    }

    write(offset, value) {
        this.nibbles[offset] = value & 0x0F;
    }

    readRegister(offset) {
        return this.read(offset);
    }

    peekRegister(offset) {
        return this.read(offset);
    }

    writeRegister(offset, value) {
        this.write(offset, value);
    }

    clear() {
        this.nibbles.fill(0);
    }
}

class MemoryMappedDevice {
    constructor(startAddress, endAddress, device) {
        this.startAddress = startAddress;
        this.endAddress = endAddress;
        this.device = device;
    }

    contains(address) {
        return address >= this.startAddress && address <= this.endAddress;
    }
}

class MemoryBus {
    constructor(ram, mappedDevices, ioAreaStart = 0xD000, ioAreaEnd = 0xDFFF) {
        this.ram = ram;
        this.mappedDevices = mappedDevices;
        this.ioAreaStart = ioAreaStart;
        this.ioAreaEnd = ioAreaEnd;
    }

    read(address) {
        address &= 0xFFFF;
        const mappedDevice = this.mappedDeviceAt(address);
        return mappedDevice
            ? mappedDevice.device.readRegister(address - mappedDevice.startAddress)
            : this.ram.read(address);
    }

    peek(address) {
        address &= 0xFFFF;
        const mappedDevice = this.mappedDeviceAt(address);
        return mappedDevice
            ? mappedDevice.device.peekRegister(address - mappedDevice.startAddress)
            : this.ram.read(address);
    }

    write(address, value) {
        address &= 0xFFFF;
        const mappedDevice = this.mappedDeviceAt(address);
        if (mappedDevice) {
            mappedDevice.device.writeRegister(address - mappedDevice.startAddress, value & 0xFF);
        } else {
            this.ram.write(address, value);
        }
    }

    readWord(address) {
        return this.read(address) | (this.read((address + 1) & 0xFFFF) << 8);
    }

    mappedDeviceAt(address) {
        if (address < this.ioAreaStart || address > this.ioAreaEnd) {
            return null;
        }
        return this.mappedDevices.find(mappedDevice => mappedDevice.contains(address)) ?? null;
    }
}
