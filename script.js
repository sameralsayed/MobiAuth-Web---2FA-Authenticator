// script.js
let tokens = [
    {
        id: 1,
        service: "GitHub",
        account: "demo@github.com",
        secret: "JBSWY3DPEHPK3PXP",
        code: "482917",
        timeLeft: 28
    },
    {
        id: 2,
        service: "Google",
        account: "demo@gmail.com",
        secret: "KZXW4Z3FNYXWQ2LB",
        code: "739184",
        timeLeft: 12
    },
    {
        id: 3,
        service: "Microsoft",
        account: "demo@outlook.com",
        secret: "MZXW6YTBOJ2WEZLB",
        code: "651204",
        timeLeft: 19
    }
];

function generateTOTP() {
    // Simple demo TOTP simulation (real apps use crypto)
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function updateTokens() {
    const container = document.getElementById('tokensList');
    container.innerHTML = tokens.map(token => {
        const progress = Math.round((token.timeLeft / 30) * 100);
        return `
        <div class="col-md-6 col-lg-4">
            <div class="card bg-dark border-success token-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="fw-bold">${token.service}</h5>
                            <p class="text-success small mb-1">${token.account}</p>
                        </div>
                        <div class="countdown-circle">
                            <svg width="48" height="48" class="progress-ring">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="#333" stroke-width="6"></circle>
                                <circle cx="24" cy="24" r="20" fill="none" stroke="#00c853" stroke-width="6" 
                                        stroke-dasharray="${2 * Math.PI * 20}" 
                                        stroke-dashoffset="${2 * Math.PI * 20 * (1 - progress/100)}"
                                        stroke-linecap="round"></circle>
                            </svg>
                            <div class="position-absolute top-50 start-50 translate-middle text-center fw-bold small" style="width:48px;">
                                ${token.timeLeft}
                            </div>
                        </div>
                    </div>
                    <div class="token-code text-center my-4">${token.code}</div>
                    <div class="d-flex justify-content-between small text-muted">
                        <span>TOTP • 30s</span>
                        <span class="text-success">Copy <i onclick="copyCode('${token.code}');event.stopImmediatePropagation()" class="fas fa-copy ms-1"></i></span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function countdown() {
    tokens.forEach(token => {
        token.timeLeft--;
        if (token.timeLeft <= 0) {
            token.timeLeft = 30;
            token.code = generateTOTP();
        }
    });
    updateTokens();
}

function simulateQRScan() {
    const modal = new bootstrap.Modal(document.getElementById('vaultModal'));
    modal.hide();
    
    setTimeout(() => {
        const newToken = {
            id: Date.now(),
            service: "Discord",
            account: "demo@discord.com",
            secret: "NZXW6YTBOJ2WEZLB",
            code: generateTOTP(),
            timeLeft: 30
        };
        tokens.unshift(newToken);
        updateTokens();
        alert('✅ QR Code scanned successfully!\nNew token added to vault');
    }, 1200);
}

function addManualToken(e) {
    e.preventDefault();
    const service = document.getElementById('serviceName').value;
    const account = document.getElementById('account').value;
    
    const newToken = {
        id: Date.now(),
        service: service,
        account: account,
        secret: document.getElementById('secretKey').value,
        code: generateTOTP(),
        timeLeft: 30
    };
    tokens.unshift(newToken);
    updateTokens();
    alert('✅ Token added successfully to your secure vault!');
    e.target.reset();
}

function addRandomToken() {
    const services = ["Twitter", "Spotify", "PayPal", "Amazon"];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const newToken = {
        id: Date.now(),
        service: randomService,
        account: "demo@account.com",
        secret: "RANDOMSECRET123",
        code: generateTOTP(),
        timeLeft: 30
    };
    tokens.unshift(newToken);
    updateTokens();
}

function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 m-3 alert alert-success';
        toast.style.zIndex = '9999';
        toast.innerHTML = `✅ Code <strong>${code}</strong> copied to clipboard!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    });
}

function backupVault() {
    alert('☁️ Vault backed up successfully to simulated cloud!\nYou can restore anytime.');
}

function restoreVault() {
    alert('✅ All tokens restored from cloud backup!\nVault is now up to date.');
    // Add one extra token for demo
    if (tokens.length < 5) {
        tokens.push({
            id: Date.now(),
            service: "LinkedIn",
            account: "demo@linkedin.com",
            secret: "LINKEDINDEMO",
            code: generateTOTP(),
            timeLeft: 30
        });
        updateTokens();
    }
}

function unlockDemo() {
    const modal = new bootstrap.Modal(document.getElementById('vaultModal'));
    modal.show();
}

function checkPin() {
    const pin = document.getElementById('vaultPin').value;
    if (pin === '1234') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('vaultModal'));
        modal.hide();
        updateTokens();
        setInterval(countdown, 1000);
        document.getElementById('tokens').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('❌ Wrong PIN! (Demo PIN is 1234)');
    }
}

function lockVault() {
    tokens = [];
    updateTokens();
    alert('🔒 Vault locked successfully. All tokens secured.');
}

window.onload = function() {
    console.log('%c🚀 MobiAuth Web 2FA Authenticator loaded – fully functional TOTP demo!', 'color:#00c853; font-size:14px; font-weight:bold;');
    // Initial render will happen after first unlock
};
