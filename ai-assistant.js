/* ============================================================
   AI Finance Assistant — injected widget script
   ============================================================ */
(function() {
  'use strict';

  /* ---- Finance Knowledge Base ---- */
  const KB = {
    balance: '₹48,920',
    income: '₹6,250',
    expenses: '₹3,290',
    savings: '₹5,460',
    savingsPct: '87.4'
  };

  const RESPONSES = {
    greet: [
      `Hey there! 👋 I'm NeoAI, your personal finance advisor. Your balance is <strong>${KB.balance}</strong>. How can I help you today?`
    ],
    balance: [
      `💰 Your current balance is <strong>${KB.balance}</strong>. You earned <strong>${KB.income}</strong> this month and spent <strong>${KB.expenses}</strong>. Net savings: <strong>+${KB.savings}</strong> 🎉`
    ],
    invest: [
      `📈 Based on your savings of <strong>${KB.savings}/month</strong>, here are smart options:\n\n• <strong>Low Risk:</strong> FD @ 7.5% p.a. — safe & stable\n• <strong>Medium Risk:</strong> Index Funds (Nifty 50) — long-term growth\n• <strong>High Risk:</strong> Mid-cap stocks — high return potential`,
    ],
    save: [
      `🏦 You can save an extra <strong>₹2,000–₹3,000/month</strong> by:\n\n• Cutting dining spend by 20% (₹800 saved)\n• Setting a ₹1,500/month auto-invest in mutual funds\n• Switching to annual subscriptions (saves ₹600/yr)`
    ],
    analyze: [
      `🔍 <strong>Spending Analysis — March 2025</strong>\n\n• 🛒 Groceries: ₹280 (↑ 12%)\n• 🍕 Dining: ₹520 (⚠️ over budget)\n• 🚕 Transport: ₹280 (normal)\n• 🎵 Subscriptions: ₹38 (✅)\n\nTip: Reduce dining by ₹200 to hit your savings goal!`
    ],
    mutual: [
      `📊 Top Mutual Funds for you:\n\n1. <strong>Mirae Asset Large Cap</strong> — 14.5% returns (Low Risk)\n2. <strong>Parag Parikh Flexi Cap</strong> — 18.2% returns (Medium Risk)\n3. <strong>Nippon Small Cap</strong> — 28.4% returns (High Risk)\n\nWant me to set up a SIP?`
    ],
    stocks: [
      `📉 Based on your risk profile (Medium), I suggest:\n\n• <strong>Reliance Industries</strong> — Strong fundamentals\n• <strong>Infosys</strong> — IT sector leader\n• <strong>HDFC Bank</strong> — Stable banking stock\n\nStart with ₹500–₹1,000/month via SIP for best results.`
    ],
    sip: [
      `✅ Great choice! A SIP of just <strong>₹1,000/month</strong> in an Index Fund can grow to <strong>₹2.3 Lakhs</strong> in 10 years at 12% p.a.\n\nShall I add a reminder to invest on the 1st of every month? 📅`
    ],
    risk: [
      `🛡️ Your risk score is <strong>Medium (6/10)</strong>.\n\n• Low Risk: 40% → FD, Savings Account\n• Medium Risk: 40% → Mutual Funds, Index ETFs\n• High Risk: 20% → Direct Stocks, Crypto`
    ],
    tip: [
      `💡 <strong>Quick Money Tip:</strong> You have ₹5,460 idle in savings. Put ₹3,000 into a 6-month FD at 7.5% to earn ₹112 risk-free interest!`,
      `💡 <strong>Did you know?</strong> You've saved 87.4% of your income this month! That's in the top 10% of NeoBank users. Keep it up! 🏆`,
      `💡 <strong>Smart tip:</strong> Your Spotify + Netflix subscriptions cost ₹625/month. Switching to an annual plan saves ₹1,500/year!`
    ],
    default: [
      `🤔 I didn't catch that. Try asking me about:\n\n• Your **balance** or spending\n• **Investment** ideas\n• How to **save** more money\n• **Stock** or fund recommendations`,
    ]
  };

  /* ---- Helpers ---- */
  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function resolveResponse(input) {
    const q = input.toLowerCase();
    if (q.match(/balance|total|how much|account/)) return RESPONSES.balance;
    if (q.match(/invest|investment/))         return RESPONSES.invest;
    if (q.match(/save|saving|cut/))           return RESPONSES.save;
    if (q.match(/analyz|spend|breakdown/))    return RESPONSES.analyze;
    if (q.match(/mutual|fund/))               return RESPONSES.mutual;
    if (q.match(/stock|share|equity/))        return RESPONSES.stocks;
    if (q.match(/sip|systematic/))            return RESPONSES.sip;
    if (q.match(/risk|profile/))              return RESPONSES.risk;
    if (q.match(/tip|advice|suggest/))        return RESPONSES.tip;
    if (q.match(/hi|hello|hey|yo/))           return RESPONSES.greet;
    return RESPONSES.default;
  }

  /* ---- DOM Build ---- */
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'ai-assistant.css';
  document.head.appendChild(css);

  const fab = document.createElement('button');
  fab.className = 'ai-fab';
  fab.title = 'Chat with NeoAI';
  fab.innerHTML = `🤖<span class="ai-fab-badge"></span>`;
  document.body.appendChild(fab);

  const win = document.createElement('div');
  win.className = 'ai-chat-window';
  win.id = 'aiChatWindow';
  win.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-header-avatar">🤖</div>
      <div class="ai-header-info">
        <div class="ai-header-name">NeoAI · Finance Advisor</div>
        <div class="ai-header-status"><span class="ai-status-dot"></span>Online · Always ready</div>
      </div>
      <button class="ai-close-btn" id="aiCloseBtn">✕</button>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-quick-replies" id="aiQuickReplies">
      <button class="ai-quick-btn" data-q="Show my balance">💰 Balance</button>
      <button class="ai-quick-btn" data-q="Give me investment ideas">📈 Invest</button>
      <button class="ai-quick-btn" data-q="How can I save more money?">🏦 Save</button>
      <button class="ai-quick-btn" data-q="Analyze my spending">🔍 Analyze</button>
      <button class="ai-quick-btn" data-q="Best mutual funds for me">📊 Funds</button>
      <button class="ai-quick-btn" data-q="Give me a quick money tip">💡 Tip</button>
    </div>
    <div class="ai-input-bar">
      <input class="ai-input" id="aiInput" type="text" placeholder="Ask me anything about your finances…" autocomplete="off" maxlength="200"/>
      <button class="ai-send-btn" id="aiSendBtn">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  /* ---- Chat Logic ---- */
  const msgs   = document.getElementById('aiMessages');
  const input  = document.getElementById('aiInput');
  const sendBtn = document.getElementById('aiSendBtn');

  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    div.innerHTML = `<span class="ai-msg-icon">${role === 'bot' ? '🤖' : '👤'}</span>${text}<div class="ai-msg-time">${getTime()}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'ai-typing';
    t.id = 'aiTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('aiTyping');
    if (t) t.remove();
  }

  function botReply(texts) {
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg(randomItem(texts), 'bot');
    }, 900 + Math.random() * 500);
  }

  function handleSend(q) {
    const text = (q || input.value).trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    botReply(resolveResponse(text));
  }

  sendBtn.addEventListener('click', () => handleSend());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  document.querySelectorAll('.ai-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSend(btn.dataset.q));
  });

  /* ---- Toggle ---- */
  fab.addEventListener('click', () => {
    const isOpen = win.classList.contains('open');
    win.classList.toggle('open');
    fab.innerHTML = isOpen ? `🤖<span class="ai-fab-badge"></span>` : `✕`;
    if (!isOpen && msgs.children.length === 0) {
      botReply(RESPONSES.greet);
    }
  });

  document.getElementById('aiCloseBtn').addEventListener('click', () => {
    win.classList.remove('open');
    fab.innerHTML = `🤖<span class="ai-fab-badge"></span>`;
  });

})();
