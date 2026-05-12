// ============================================
// FESTA JUNINA APP - Versão Final Funcional
// ============================================

console.log('🚀 Carregando Festa Junina App...');

// Função para obter dados
function obterDados() {
    try {
        return {
            comidas: JSON.parse(localStorage.getItem('festa_comidas') || '[]'),
            brincadeiras: JSON.parse(localStorage.getItem('festa_brincadeiras') || '[]'),
            participantes: JSON.parse(localStorage.getItem('festa_participantes') || '[]'),
            barracas: JSON.parse(localStorage.getItem('festa_barracas') || '[]')
        };
    } catch(e) {
        console.error('Erro ao ler dados:', e);
        return { comidas: [], brincadeiras: [], participantes: [], barracas: [] };
    }
}

// Função para salvar
function salvarDados(tabela, dados) {
    try {
        localStorage.setItem(`festa_${tabela}`, JSON.stringify(dados));
        console.log(`✅ Salvou em festa_${tabela}:`, dados.length, 'itens');
        return true;
    } catch(e) {
        console.error('❌ Erro ao salvar:', e);
        return false;
    }
}

// Tabela atual
let tabelaAtual = 'comidas';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 App inicializado');
    console.log('💾 localStorage disponível:', typeof localStorage !== 'undefined');
    
    // Configurar navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            tabelaAtual = this.dataset.tab;
            
            // Atualizar título
            const titulos = {
                'comidas': 'Comidas Típicas',
                'brincadeiras': 'Brincadeiras', 
                'participantes': 'Participantes',
                'barracas': 'Barracas'
            };
            const titulo = document.getElementById('current-section');
            if (titulo) titulo.textContent = titulos[tabelaAtual];
            
            renderizarLista();
        });
    });
    
    // Configurar botão adicionar
    const btnAdd = document.querySelector('.add-button');
    if (btnAdd) {
        btnAdd.addEventListener('click', abrirModal);
    }
    
    // Configurar fechamento do modal
    document.querySelector('.modal-backdrop')?.addEventListener('click', fecharModal);
    document.querySelector('.modal-close')?.addEventListener('click', fecharModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') fecharModal();
    });
    
    // Indicador de conexão
    const indicator = document.getElementById('connection-indicator');
    if (indicator) {
        const dot = indicator.querySelector('.indicator-dot');
        const text = indicator.querySelector('span');
        if (dot) dot.className = 'indicator-dot local';
        if (text) {
            text.textContent = 'Salvando no navegador 💾';
            text.style.color = '#22c55e';
        }
    }
    
    // Renderizar lista inicial
    renderizarLista();
    atualizarContadores();
});

// Abrir modal
function abrirModal() {
    const modal = document.getElementById('modal');
    const titulo = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    if (!modal || !titulo || !body) {
        console.error('❌ Elementos do modal não encontrados');
        return;
    }
    
    const configs = {
        comidas: {
            titulo: 'Adicionar Comida',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>
                    <input type="text" class="form-input" id="campo-nome" placeholder="Ex: Canjica">
                </div>
                <div class="form-field">
                    <label>Preço *</label>
                    <input type="number" class="form-input" id="campo-preco" step="0.01" placeholder="0.00">
                </div>
                <div class="form-field">
                    <label>Categoria</label>
                    <select class="form-input" id="campo-categoria">
                        <option value="doce">🍬 Doce</option>
                        <option value="salgada">🥮 Salgada</option>
                        <option value="bebida">🥤 Bebida</option>
                    </select>
                </div>
            `
        },
        brincadeiras: {
            titulo: 'Adicionar Brincadeira',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>
                    <input type="text" class="form-input" id="campo-nome" placeholder="Ex: Pescaria">
                </div>
                <div class="form-field">
                    <label>Prêmio (R$)</label>
                    <input type="number" class="form-input" id="campo-premio" step="0.01" placeholder="0.00">
                </div>
                <div class="form-field">
                    <label>Duração (min)</label>
                    <input type="number" class="form-input" id="campo-duracao" placeholder="15">
                </div>
            `
        },
        participantes: {
            titulo: 'Adicionar Participante',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>
                    <input type="text" class="form-input" id="campo-nome" placeholder="Nome completo">
                </div>
                <div class="form-field">
                    <label>Fantasia</label>
                    <input type="text" class="form-input" id="campo-fantasia" placeholder="Ex: Noiva Caipira">
                </div>
                <div class="form-field">
                    <label>Tipo</label>
                    <select class="form-input" id="campo-tipo">
                        <option value="visitante">🎭 Visitante</option>
                        <option value="organizador">👔 Organizador</option>
                        <option value="artista">🎤 Artista</option>
                    </select>
                </div>
            `
        },
        barracas: {
            titulo: 'Adicionar Barraca',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>
                    <input type="text" class="form-input" id="campo-nome" placeholder="Ex: Barraca do Beijo">
                </div>
                <div class="form-field">
                    <label>Responsável *</label>
                    <input type="text" class="form-input" id="campo-responsavel" placeholder="Nome do responsável">
                </div>
                <div class="form-field">
                    <label>Tipo</label>
                    <select class="form-input" id="campo-tipo">
                        <option value="comida">🍽️ Comida</option>
                        <option value="jogos">🎲 Jogos</option>
                        <option value="danca">💃 Dança</option>
                    </select>
                </div>
            `
        }
    };
    
    const config = configs[tabelaAtual];
    titulo.textContent = config.titulo;
    body.innerHTML = config.campos + `
        <button class="btn-submit" onclick="salvarItem()" style="margin-top: 20px;">
            💾 Salvar
        </button>
    `;
    
    modal.classList.add('active');
    console.log('📝 Modal aberto para:', tabelaAtual);
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal')?.classList.remove('active');
}

// Salvar item
function salvarItem() {
    console.log('💾 Salvando em:', tabelaAtual);
    
    const nome = document.getElementById('campo-nome')?.value?.trim();
    if (!nome) {
        alert('⚠️ Preencha o nome!');
        return;
    }
    
    const item = {
        id: Date.now(),
        nome: nome,
        data: new Date().toISOString()
    };
    
    // Adicionar campos específicos
    switch(tabelaAtual) {
        case 'comidas':
            item.preco = parseFloat(document.getElementById('campo-preco')?.value || '0');
            item.categoria = document.getElementById('campo-categoria')?.value || 'doce';
            break;
        case 'brincadeiras':
            item.premio = parseFloat(document.getElementById('campo-premio')?.value || '0');
            item.duracao = parseInt(document.getElementById('campo-duracao')?.value || '0');
            break;
        case 'participantes':
            item.fantasia = document.getElementById('campo-fantasia')?.value || '';
            item.tipo = document.getElementById('campo-tipo')?.value || 'visitante';
            break;
        case 'barracas':
            item.responsavel = document.getElementById('campo-responsavel')?.value || '';
            item.tipo = document.getElementById('campo-tipo')?.value || 'comida';
            break;
    }
    
    console.log('📝 Item:', item);
    
    const dados = obterDados();
    dados[tabelaAtual].unshift(item);
    
    if (salvarDados(tabelaAtual, dados[tabelaAtual])) {
        console.log('✅ Item salvo!');
        fecharModal();
        renderizarLista();
        atualizarContadores();
        mostrarToast('Item adicionado! ✅');
    } else {
        alert('❌ Erro ao salvar!');
    }
}

// Excluir item
function excluirItem(id) {
    console.log('🗑️ Excluindo:', id);
    
    if (!confirm('Excluir este item?')) return;
    
    const dados = obterDados();
    dados[tabelaAtual] = dados[tabelaAtual].filter(item => item.id !== id);
    
    if (salvarDados(tabelaAtual, dados[tabelaAtual])) {
        console.log('✅ Excluído!');
        renderizarLista();
        atualizarContadores();
        mostrarToast('Item removido! 🗑️');
    }
}

// Renderizar lista
function renderizarLista() {
    console.log('🎨 Renderizando:', tabelaAtual);
    
    const container = document.getElementById('items-container');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) {
        console.error('❌ Container não encontrado');
        return;
    }
    
    // Remover cards existentes
    container.querySelectorAll('.item-card').forEach(c => c.remove());
    
    const itens = obterDados()[tabelaAtual];
    console.log(`📊 ${itens.length} itens`);
    
    if (emptyState) {
        emptyState.style.display = itens.length === 0 ? 'block' : 'none';
    }
    
    itens.forEach(item => {
        const card = criarCard(item);
        container.appendChild(card);
    });
}

// Criar card
function criarCard(item) {
    const div = document.createElement('div');
    div.className = 'item-card';
    
    let emoji = '📦';
    let badge = '';
    let info = '';
    
    switch(tabelaAtual) {
        case 'comidas':
            emoji = {doce:'🍰', salgada:'🥮', bebida:'🥤'}[item.categoria] || '🍽️';
            badge = item.categoria;
            info = `<p style="color:#666;">💰 R$ ${(item.preco||0).toFixed(2)}</p>`;
            break;
        case 'brincadeiras':
            emoji = '🎯';
            badge = 'Jogo';
            info = `<p style="color:#666;">🏆 R$ ${(item.premio||0).toFixed(2)} | ⏱️ ${item.duracao||0}min</p>`;
            break;
        case 'participantes':
            emoji = {visitante:'🎭', organizador:'👔', artista:'🎤'}[item.tipo] || '👤';
            badge = item.tipo;
            info = `<p style="color:#666;">👗 ${item.fantasia||'Sem fantasia'}</p>`;
            break;
        case 'barracas':
            emoji = {comida:'🍽️', jogos:'🎲', danca:'💃'}[item.tipo] || '🏪';
            badge = item.tipo;
            info = `<p style="color:#666;">👨‍💼 ${item.responsavel||'N/A'}</p>`;
            break;
    }
    
    div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <span style="font-size:2.5rem;">${emoji}</span>
            <span style="background:#f0f0f0;padding:4px 12px;border-radius:20px;font-size:0.8rem;">${badge}</span>
        </div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">${item.nome}</h3>
        ${info}
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e5e5;text-align:right;">
            <button onclick="excluirItem(${item.id})" 
                    style="padding:8px 16px;background:transparent;color:#ef4444;border:1px solid #ef4444;border-radius:8px;cursor:pointer;">
                🗑️ Excluir
            </button>
        </div>
    `;
    
    return div;
}

// Atualizar contadores
function atualizarContadores() {
    const dados = obterDados();
    
    Object.keys(dados).forEach(tabela => {
        const badge = document.getElementById(`count-${tabela}`);
        if (badge) badge.textContent = dados[tabela].length;
    });
    
    const totalEl = document.getElementById('total-items');
    const valorEl = document.getElementById('valor-total');
    
    if (totalEl) {
        totalEl.textContent = Object.values(dados).reduce((s, a) => s + a.length, 0);
    }
    
    if (valorEl) {
        let total = 0;
        dados.comidas.forEach(i => total += i.preco || 0);
        dados.brincadeiras.forEach(i => total += i.premio || 0);
        valorEl.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Toast
function mostrarToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.style.cssText = 'padding:12px 20px;background:#22c55e;color:white;border-radius:8px;margin-bottom:8px;animation:slideIn 0.3s;';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

console.log('✅ App carregado!');