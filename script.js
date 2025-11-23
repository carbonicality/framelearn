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

const benchmarks = {
    cpu: {
        '1': {singleCore:1850,multiCore:12400,name:'cpu 1'},
        '2': {singleCore:2100,multiCore:9800,name:'cpu 2'}
    },
    storage: {
        '0': {sequential:3250,random:280,name:'256GB'},
        '1': {sequential:4700,random:450,name:'512GB'}
    },
    ram: {
        '0': {score:3200,name:'8GB'},
        '1': {score:4480,name:'16GB'}
    }
}

const usageSc = {
    idle: {name:'idle', multiplier:0.3},
    light: {name:'light use',multiplier:0.6},
    medium: {name:'medium use',multiplier:1.0},
    heavy: {name:'heavy use', multiplier:1.4}
}

let currentSc = 'medium';

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

function updBench() {
    let cpuSingle = 0, cpuMulti = 0, storageSeq = 0, storageRand = 0, memScore = 0;
    if (selCpu) {
        cpuSingle = benchmarks.cpu[selCpu].singleCore;
        cpuMulti = benchmarks.cpu[selCpu].multiCore;
    }
    if (selStorage) {
        storageSeq = benchmarks.storage[selStorage].sequential;
        storageRand = benchmarks.storage[selStorage].random;
    }
    if (selRam) {
        memScore = benchmarks.ram[selRam].score;
    }
    const overall = Math.round((cpuMulti * 0.35 + cpuSingle * 0.25 + storageSeq * 0.2 + memScore * 0.15 + storageRand * 0.05) / 10);
    document.getElementById('b-cpu-single').textContent = cpuSingle || 'N/A';
    document.getElementById('b-cpu-multi').textContent = cpuMulti || 'N/A';
    document.getElementById('b-storage').textContent = storageSeq ? storageSeq + ' MB/s' : 'N/A';
    document.getElementById('b-memory').textContent = memScore || 'N/A';
    document.getElementById('b-overall').textContent = overall || 'N/A';

    updatePB('perf-cpu', cpuSingle, 2500);
    updatePB('perf-stg', storageSeq, 7000);
    updatePB('perf-mem', memScore, 6000);
    updatePB('perf-overall', overall, 1500);
}

function updatePB(id, value, max) {
    const bar = document.getElementById(id);
    if (!bar) return;
    const percent = Math.min((value / max) * 100, 100);
    bar.style.width = percent + '%';
    if (percent > 75) {
        bar.style.background = '#00ff00';
        bar.style.boxShadow = '0 0 10px #00ff00';
    } else if (percent > 50) {
        bar.style.background = '#ffaa00';
        bar.style.boxShadow = '0 0 10px #ffaa00';
    } else {
        bar.style.background = '#ff4444';
        bar.style.boxShadow = '0 0 10px #ff4444';
    }
}

function updBattLife() {
    if (!selBatt) {
        document.querySelectorAll('.batt-sc').forEach(el => {
            el.textContent = 'N/A';
        });
        document.getElementById('batt-cur').textContent = 'N/A';
        return;
    }

    let totalPwr = 0;
    if (selDisplay) totalPwr += displays[selDisplay].power;
    if (selCpu) totalPwr += cpus[selCpu].tdp;
    if (selRam) totalPwr += rams[selRam].power;
    if (selStorage) totalPwr += storages[selStorage].power;
    for (let slot in config) {
        totalPwr += comps[config[slot]].power;
    }
    const battCap = batts[selBatt].capacity;
    for (let sc in usageSc) {
        const adjPwr = totalPwr * usageSc[sc].multiplier;
        const hours = adjPwr > 0 ? battCap/adjPwr : 0;
        const el = document.getElementById('batt-' + sc);
        if (el) {
            el.textContent = hours > 0 ? hours.toFixed(1) + 'h' : 'N/A';
        }
    }
    const medEl = document.getElementById('batt-med');
    if (medEl) {
        const adjPwr = totalPwr * usageSc.medium.multiplier;
        const hours = adjPwr > 0 ? battCap / adjPwr : 0;
        medEl.textContent = hours > 0 ? hours.toFixed(1) + 'h' : 'N/A';
    }
    const selectedPwr = totalPwr * usageSc[currentSc].multiplier;
    const selHrs = selectedPwr > 0 ? battCap / selPwr : 0;
    document.getElementById('batt-cur').textContent = selHrs > 0 ? selHrs.toFixed(1) + 'hours' : 'N/A';
}

document.querySelectorAll('.sc-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentSc = this.dataset.sc;
        updateBattLife();
    });
});

window.updBench = updBench;
window.updBattLife = updBattLife;

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
        html += `<div class="sum-item"><span>cpu:</span><span>${c.name} - $${c.cost}</span></div>`;
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
        html += `<div class="sum-item"><span>adapter:</span><span>${a.wattage}W - $${a.cost}</span></div>`;
        totalCost += a.cost;
    }
    for (let slot in config) {
        const comp = comps[config[slot]];
        html += `<div class="sum-item"><span>${slot}:</span><span>${comp.name} - $${comp.cost}</span></div>`;
        totalCost += comp.cost;
    }
    html += `<div class="sum-item"><span>total:</span><span>$${totalCost}</span></div>`;
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
    animPC(totalPwr);
    updBench();
    updBattLife();
}

function updStatus(msg) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = msg;
    setTimeout(() => {
        if (selDisplay && selCpu && Object.keys(config).length > 0) {
            statusEl.textContent= 'system ready';
        } else if (Object.keys(config).length > 0 || selDisplay || selCpu) {
            statusEl.textContent = 'configuring';
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

const pgraph = document.getElementById('pgraph');
if (!pgraph) throw new Error('pgraph not found! uh oh moment.')
const gctx = pgraph.getContext('2d');
let pwrHistory = [];
const maxPts = 50;
let gAnimFrame = null;

function resizePG() {
    const rect = pgraph.getBoundingClientRect();
    pgraph.width = rect.width;
    pgraph.height  =rect.height;
}

resizePG();
window.addEventListener('resize', resizePG);

function drawPG() {
    const w= pgraph.width;
    const h = pgraph.height;
    gctx.fillStyle = '#000';
    gctx.fillRect(0,0,w,h);
    gctx.strokeStyle = '#1a1a1a';
    gctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = (h/4) * i;
        gctx.beginPath();
        gctx.moveTo(0,y);
        gctx.lineTo(w,y);
        gctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
        const x = (w/10) * i;
        gctx.beginPath();
        gctx.moveTo(x,0);
        gctx.lineTo(x,h);
        gctx.stroke();
    }
    const t40 = h - (h * (40/120));
    const t80 = h - (h * (80/120));
    //green (0-40)
    gctx.fillStyle = 'rgba(0,255,0,0.05)';
    gctx.fillRect(0,t40,w,h - t40);
    //yellow (40-80)
    gctx.fillStyle = 'rgba(255,170,0,0.05)';
    gctx.fillRect(0,t80,w,t40 - t80);
    //red (80 and above)
    gctx.fillStyle = 'rgba(255,68,68,0.05)';
    gctx.fillRect(0,0,w,t80);
    if (pwrHistory.length > 1) {
        gctx.beginPath();
        gctx.lineWidth = 2;
        const spacing = w / (maxPts - 1);
        for (let i = 0;i < pwrHistory.length; i++) {
            const x = i * spacing;
            const pwr = pwrHistory[i];
            const y = h - (h * (pwr / 120));
            if (pwr > 80) {
                gctx.strokeStyle = '#ff4444';
            } else if (pwr > 40) {
                gctx.strokeStyle = '#ffaa00';
            } else {
                gctx.strokeStyle = '#00ff00';
            }
            if (i === 0) {
                gctx.moveTo(x,y);
            } else {
                gctx.lineTo(x,y);
            }
        }
        gctx.stroke();
        gctx.shadowBlur = 10;
        gctx.shadowColor = gctx.strokeStyle;
        gctx.stroke();
        gctx.shadowBlur = 0;
        
        gctx.fillStyle = '#00ffff';
        for (let i = 0; i < pwrHistory.length; i++) {
            const x = i * spacing;
            const pwr = pwrHistory[i];
            const y = h - (h * (pwr / 120));
            gctx.beginPath();
            gctx.arc(x,y,2,0,Math.PI * 2);
            gctx.fill();
        }
    }
    if (pwrHistory.length > 0) {
        const currPwr = pwrHistory[pwrHistory.length - 1];
        const x = w - 60;
        const y = h - (h * (currPwr/120));
        gctx.fillStyle = 'rgba(0,0,0,0.7)';
        gctx.fillRect(x - 5, y - 15, 60,20);
        gctx.fillStyle = '#00ffff';
        gctx.font = '12px Geist Mono';
        gctx.fillText(currPwr.toFixed(1) + 'W',x,y);
    }
}

function addPR(watts) {
    pwrHistory.push(watts);
    if (pwrHistory.length > maxPts) {
        pwrHistory.shift();
    }
    document.getElementById('gcurrent').textContent = watts.toFixed(1) + 'W';
    drawPG();
}

function animPC(targetPwr) {
    if (gAnimFrame) {
        cancelAnimationFrame(gAnimFrame);
    }
    const startPwr = pwrHistory.length > 0 ? pwrHistory[pwrHistory.length - 1] : 0;
    const duration = 500; // (ms)
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress=Math.min(elapsed / duration,1);
        const easeProg = 1 - Math.pow(1 - progress,3);
        const currPwr = startPwr + (targetPwr - startPwr) * easeProg;
        addPR(currPwr);
        if (progress < 1) {
            gAnimFrame = requestAnimationFrame(animate);
        }
    }
    animate();
}

addPR(0);
updStats();