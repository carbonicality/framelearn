// i got AI to get the numbers and prices for these comps etc, so they might be inaccurate
const comps = {
    usbc: {name:'USB-C',power:15,bandwidth:40,label:'USB-C',cost:25},
    usba: {name:'USB-A',power:7.5, bandwidth: 10, label:'USB-A',cost:15}
}

const displays = {
    '13': {size:'13.5"',res:'2256x1504',refresh:'60Hz',power:4.5,cost:300},
    '16': {size: '16"',res:'2560x1600',refresh:'165Hz',power:6.8,cost:450}
}

const cpus = {
    '1': {name:'cpu 1', cores: 14,threads:18,boost:'4.5GHz',tdp:28,boostTdp:115,cost:300},
    '2': {name:'cpu 2', cores: 8,threads:16,boost:'5.1GHz',tdp:15,boostTdp:30,cost:280}
}

const rams = {
    '0': {size:'8GB', speed:'4800MHz', bw:38.4,power:3, cost: 40},
    '1': {size:'16GB',speed:'5600MHz', bw:44.8,power:4,cost:80}
}

const storages = {
    '0': {size:'256GB',read:3500,write:3000,power:3,cost:50},
    '1': {size:'512GB',read:5000,write:4400,power:4,cost:80}
}

const batts = {
    '0': {capacity:55,cells:4,weight:240,cost:80},
    '1': {capacity:61,cells:4,weight:280,cost:100}
}

const adapters = {
    '0': {wattage:60,output:'20V/3A', weight: 160,cost:50}
}

const presets = {
    dev: {
        display: '13', cpu:'2',ram:'1',storage:'1', battery:'1', adapter:'0',
        ports: {L1:'usbc',L2:'usbc',R1:'usbc',R2:'usba'}
    },
    game: {
        display:'16', cpu:'1',ram:'1',storage:'1',battery:'1',adapter:'0',
        ports: {L1:'usbc',L2:'usbc',R1:'usbc',R2:'usba'}
    }
}

let selComp = null;
let config = {};
let selDisplay = null;
let selCpu = null;
let selRam = null;
let selStorage = null;
let selBatt = null;
let selAdpr = null;

document.querySelectorAll('.ram-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.ram-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selRam= this.dataset.ram;
        const ram = rams[selRam];
        document.getElementById('ram-size').textContent = ram.size;
        updStats();
        updStatus('ram configured');
    });
});

document.querySelectorAll('.storage-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.storage-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selStorage = this.dataset.storage;
        const storage = storages[selStorage];
        document.getElementById('storage-size').textContent = storage.size;
        updStats();
        updStatus('storage configured');
    });
});

document.querySelectorAll('.battery-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.battery-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selBatt = this.dataset.battery;
        const battery = batts[selBatt];
        document.getElementById('battery-cap').textContent = battery.capacity + 'Wh';
        updStats();
        updStatus('battery configured');
    });
});

document.querySelectorAll('.adapter-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.adapter-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selAdpr = this.dataset.adapter;
        const adapter = adapters[selAdpr];
        document.getElementById('adapter-watt').textContent = adapter.wattage + 'W';
        updStats();
        updStatus('adapter configured');
    });
});

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

document.querySelectorAll('.comp-card:not(.display-card):not(.cpu-card):not(.ram-card):not(.storage-card):not(.battery-card):not(.adapter-card)').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.comp-card:not(.display-card):not(.cpu-card):not(.ram-card):not(.storage-card):not(.battery-card):not(.adapter-card)').forEach(c => c.classList.remove('selected'));
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

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const presetName = this.dataset.preset;
        loadPreset(presetName);
    });
});

document.getElementById('export-btn').addEventListener('click', function() {
    const cfgData = {
        display: selDisplay,
        cpu: selCpu,
        ram:selRam,
        storage: selStorage,
        battery:selBatt,
        adapter: selAdpr,
        ports:config
    };
    const dataStr = JSON.stringify(cfgData, null,2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'framelearn-config.json';
    link.click();
    URL.revokeObjectURL(url);
    updStatus('config exported');
});

document.getElementById('sum-btn').addEventListener('click', function() {
    showSum();
});

function showSum() {
    const sumMdl = document.getElementById('conf-sum');
    const sumBody = document.getElementById('sum-body'); // dawg this isnt even pun intended by SUM-BODY HAHAHAHAHAHAHAHAH
    let totalCost = 0;
    let html = '';
    if (selDisplay) {
        const d= displays[selDisplay];
        html += `<div class="sum-item"><span>display:</span><span>${d.size} - $${d.cost}</span></div>`;
        totalCost += d.cost;
    }
    if (selCpu) {
        const c= cpus[selCpu];
        html += `<div class="sum-item"><span>cpu:</span><span>${c.name} - ${c.cost}</span><div>`;
        totalCost += c.cost;
    }
    if (selRam) {
        const r= rams[selRam];
        html += `<div class="sum-item"><span>ram:</span><span>${r.size} - ${r.cost}</span></div>`;
        totalCost += r.cost;
    }
    if (selStorage) {
        const s = storages[selStorage];
        html += `<div class="sum-item"><span>storage:</span><span>${s.size} - ${s.cost}</span></div>`;
        totalCost += s.cost;
    }
    if (selBatt) {
        const b = batts[selBatt];
        html += `<div class="sum-item"><span>battery:</span><span>${b.capacity}Wh - $${b.cost}</span></div>`;
        totalCost += b.cost;
    }
    if (selAdpr) {
        const a = adapters[selAdpr];
        html += `<div class="sum-item"><span>adapter:</span><span>${a.wattage}W - ${a.cost}</span></div>`;
        totalCost += a.cost;
    }
    for (let slot in config) {
        const comp = comps[config[slot]];
        html += `<div class="sum-item"><span>${slot}:</span><span>${comp.name} - $${comp.cost}</span></div>`;
        totalCost += comp.cost;
    }
    html += `<div class="sum-item"><span>total:</span></span>$${totalCost}</span></div>`;
    sumBody.innerHTML = html; // lmao this is still so funny to me for no reason lol
    sumMdl.style.display = 'block';
}

document.querySelector('.sum-close').addEventListener('click', function() {
    document.getElementById('conf-sum').style.display = 'none';
});

window.addEventListener('click', function(e) {
    const thing = document.getElementById('conf-sum');
    if (e.target === thing) {
        thing.style.display = 'none';
    }
});

function updStats() {
    let totalPwr = 0;
    let totalBw= 0;
    let slotsUsed = 0;
    let totalCost = 0;
    if (selDisplay) {
        totalPwr += displays[selDisplay].power;
        totalCost += displays[selDisplay].cost;
    }
    if (selCpu) {
        totalPwr += cpus[selCpu].tdp;
        totalCost += cpus[selCpu].cost;
    }
    if (selRam) {
        totalPwr += rams[selRam].power;
        totalCost += rams[selRam].cost;
    }
    if (selStorage) {
        totalPwr += storages[selStorage].power;
        totalCost += storages[selStorage].cost;
    }
    if (selBatt) {
        totalCost += batts[selBatt].cost;
    }
    if(selAdpr) {
        totalCost += adapters[selAdpr].cost;
    }
    for (let slot in config) {
        const comp = comps[config[slot]];
        totalPwr += comp.power;
        totalBw += comp.bandwidth;
        totalCost += comp.cost;
        slotsUsed++;
    }
    document.getElementById('total-pwr').textContent = totalPwr.toFixed(1) + 'W';
    document.getElementById('total-bw').textContent = totalBw.toFixed(1) + 'Gbps';
    document.getElementById('slots-used').textContent = slotsUsed + '/8';
    document.getElementById('total-cost').textContent = '$' + totalCost;

    let compatScore = 100;
    if (selAdpr &&totalPwr > adapters[selAdpr].wattage) {
        compatScore -= 50;
    }
    if (totalPwr > 80) {
        compatScore -= 20;
    }
    document.getElementById('compat-score').textContent = compatScore + '%';
    const pwrEl = document.getElementById('total-pwr');
    pwrEl.classList.remove('warning', 'error');
    if (totalPwr > 80) {
        pwrEl.classList.add('error');
    } else if (totalPwr > 60) {
        pwrEl.classList.add('warning');
    }
    const compatEl = document.getElementById('compat-score');
    compatEl.classList.remove('warning', 'error');
    if (compatScore < 80) {
        compatEl.classList.add('error');
    } else if (compatScore < 100) {
        compatEl.classList.add('warning');
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

function loadPreset(presetName) {
    const preset= presets[presetName];
    clearCfg();
    if (preset.display) {
        document.querySelector(`.display-card[data-display="${preset.display}"]`).click();
    }
    if (preset.cpu) {
        document.querySelector(`.cpu-card[data-cpu="${preset.cpu}"]`).click();
    }
    if (preset.ram) {
        document.querySelector(`.ram-card[data-ram="${preset.ram}"]`).click();
    }
    if (preset.storage) {
        document.querySelector(`.storage-card[data-storage="${preset.storage}"]`).click();
    }
    if (preset.battery) {
        document.querySelector(`.battery-card[data-battery="${preset.battery}"]`).click();
    }
    if (preset.adapter) {
        document.querySelector(`.adapter-card[data-adapter="${preset.adapter}"]`).click();
    }
    for (let slot in preset.ports) {
        config[slot] = preset.ports[slot];
        const slotEl = document.querySelector(`.port-slot[data-slot="${slot}"]`);
        slotEl.classList.add('occupied');
        slotEl.querySelector('.comp-lb').textContent = comps[preset.ports[slot]].label;
    }
    updStats();
    updStatus(`preset loaded: ${presetName}`);
}

document.getElementById('import-btn').addEventListener('click', function() {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', function(e) {
    const file= e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const cfgData = JSON.parse(e.target.result);
                clearCfg();
                if (cfgData.display) {
                    document.querySelector(`.display-card[data-display="${cfgData.display}"]`).click();
                }
                if (cfgData.cpu) {
                    document.querySelector(`.cpu-card[data-cpu="${cfgData.cpu}"]`).click();
                }
                if (cfgData.ram) {
                    document.querySelector(`.ram-card[data-ram="${cfgData.ram}"]`).click();
                }
                if (cfgData.storage) {
                    document.querySelector(`.storage-card[data-storage="${cfgData.storage}"]`).click();
                }
                if (cfgData.battery) {
                    document.querySelector(`.battery-card[data-battery="${cfgData.battery}"]`).click();
                }
                if (cfgData.adapter) {
                    document.querySelector(`.adapter-card[data-adapter="${cfgData.adapter}"]`).click();
                }
                for (let slot in cfgData.ports) {
                    config[slot] = cfgData.ports[slot];
                    const slotEl = document.querySelector(`.port-slot[data-slot="${slot}"]`);
                    slotEl.classList.add('occupied');
                    slotEl.querySelector('.comp-lb').textContent = comps[cfgData.ports[slot]].label;
                }
                updStats();
                updStatus('config imported');
            } catch (err) {
                alert('error importing: ' + err.message);
                console.log('uh oh error importing: ' + err.message);
            }
        };
        reader.readAsText(file);
    }
});

function clearCfg() {
    document.querySelectorAll('.comp-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.port-slot').forEach(s => {
        s.classList.remove('occupied');
        s.querySelector('.comp-lb').textContent = s.dataset.slot;
    });
    config = {};
    selComp = null;
    selDisplay = null;
    selCpu = null;
    selRam = null;
    selStorage = null;
    selBatt = null;
    selAdpr = null;
}

updStats();