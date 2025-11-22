const comps = {
    usbc: {name: 'USB-C', power:0,bandwidth:0,label:'usb-c'},
    usba: {name: 'USB-A', power:0,bandwidth:0, label:'usb-a'}
    // impl more, these are placeholders !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DO NOT PUT IN FINAL RELEASE
}

const displays = {
    '13': {size: '13.5"', res: '0x0', refresh:'0Hz', power:0}, //NOTE: PLACEHOLDERS, replace with real data
    '16': {size: '16"', res:'0x0', refresh:'0Hz', power:0}
}

const cpus = {
    '1': {name:'cpu1', cores:0,threads:0,boost:'0GHz',tdp:0,boostTdp:0},
    '2': {name:'cpu2', cores:0,threads:0,boost:'0GHz',tdp:0,boostTdp:0}
}

let selComp = null;
let config = {};
let selDisplay = null;
let selCpu = null;

document.querySelectorAll('.display-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.display-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selDisplay = this.dataset.display;
        const display = displays[selDisplay];
        document.getElementById('display-size').textContent = display.size;
        document.querySelector('.screen').textContent = `[DISPLAY_${display.size}_${display.res}_${display.refresh}]`;
        updStats();
        updStatus('display confirmed');
    });
});

document.querySelectorAll('.cpu-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.cpu-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selCpu = this.dataset.cpu;
        const cpu = cpus[selCpu];
        document.getElementById('cpu-model').textContent = cpu.name;
        document.getElementById('cpu-tdp').textContent = cpu.tdp+ 'W';
        updStats();
        updStatus('cpu configured');
    });
});

document.querySelectorAll('.comp-card:not(.display-card):not(.cpu-card)').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.comp-card:not(.display-card):not(.cpu-card)').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selComp = this.dataset.component;
        updStatus('component selected');
    });
});

document.querySelectorAll('.port-slot').forEach(slot => {
    slot.addEventListener('click', function() {
        const slotId = this.dataset.slot;
        if (selComp) {
            config[slotId] = selComp;
            this.classList.add('occupied');
            this.querySelector('.comp-lb').textContent = comps[selComp].label;
            updStats();
            updStatus('slot assigned');
        } else if (config[slotId]) {
            delete config[slotId];
            this.classList.remove('occupied');
            this.querySelector('.comp-lb').textContent = slotId;
            updStats();
            updStatus('slot cleared');
        }
    });
});

document.querySelectorAll('.comp-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.comp-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selComp = this.dataset.component;
        updStatus('component selected');
    });
});

document.querySelectorAll('.port-slot').forEach(slot => {
    slot.addEventListener('click', function() {
        const slotId = this.dataset.slot;
        if (selComp) {
            config[slotId] = selComp;
            this.classList.add('occupied');
            this.querySelector('.comp-lb').textContent = comps[selComp].label;
            updStats();
            updStatus('slot assigned'); // omg like google issuetracker assigned
        } else if (config[slotId]) {
            delete config[slotId];
            this.classList.remove('occupied');
            this.querySelector('.comp-lb').textContent = slotId;
            updStats();
            updStatus('slot cleared');
        }
    });
});

function updStats() {
    let totalPwr = 0;
    let totalBw = 0;
    let slotsUsed = 0;
    for (let slot in config) {
        const comp = comps[config[slot]];
        totalPwr += comp.power;
        totalBw += comp.bandwidth;
        slotsUsed++;
    }
    if (selDisplay) {
        totalPwr += displays[selDisplay].power;
    }
    if (selCpu) {
        totalPwr += cpus[selCpu].tdp;
    }
    for (let slot in config) {
        const comp = comps[config[slot]];
        totalPwr += comp.power;
        totalBw += comp.bandwidth;
        slotsUsed++;
    }
    document.getElementById('total-pwr').textContent = totalPwr.toFixed(1) + 'W';
    document.getElementById('total-bw').textContent = totalBw.toFixed(1)+ 'Gbps';
    document.getElementById('slots-used').textContent = slotsUsed + '/8';
    const pwrEl = document.getElementById('total-pwr');
    pwrEl.classList.remove('warning', 'error');
    if (totalPwr > 80) {
        pwrEl.classList.add('error');
    } else if (totalPwr > 60) {
        pwrEl.classList.add('warning');
    }
    if(selDisplay && selCpu && slotsUsed > 0) {
        updStatus('system ready');
    }
}

function updStatus(msg) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = msg;
    setTimeout(() => {
        if (selDisplay && selCpu && Object.keys(config).length > 0) {
            statusEl.textContent= 'system ready';
        } else if (Object.keys(config).length > 0 || selDisplay || selCpu) {
            statusEl.textContent = 'configurating (actually is it configuring?)';
        } else {
            statusEl.textContent = 'idle';
        }
    },2000);
}

updStats();