// ============================================
// APP FESTA JUNINA - Versão Local Storage
// ============================================

class FestaJuninaApp {
    constructor() {
        this.tabelaAtual = 'comidas';
        this.dados = {
            comidas: [],
            brincadeiras: [],
            participantes: [],
            barracas: []
        };
        
        this.inicializar();
    }

    inicializar() {
        this.carregarDadosLocais();
        this.configurarNavegacao();
        this.configurarModal();
        this.atualizarIndicador('local');
        this.renderizarLista('comidas');
        this.atualizarContadores();
    }

    atualizarIndicador(tipo) {
        const indicator = document.getElementById('connection-indicator');
        if (!indicator) return;
        
        const dot = indicator.querySelector('.indicator-dot');
        const text = indicator.querySelector('span');
        
        if (dot && text) {
            dot.className = 'indicator-dot local';
            text.textContent = 'Dados salvos no navegador 💾';
            text.style.color = '#FFD166';
        }
    }

    configurarNavegacao() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                if (!tabId) return;
                
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.tabelaAtual = tabId;
                this.atualizarBreadcrumb(tabId);
                this.renderizarLista(tabId);
            });
        });
    }

    atualizarBreadcrumb(tabId) {
        const breadcrumbText = document.getElementById('current-section');
        const breadcrumbIcon = document.querySelector('.breadcrumb-icon');
        
        const titulos = {
            'comidas': 'Comidas Típicas',
            'brincadeiras': 'Brincadeiras',
            'participantes': 'Participantes',
            'barracas': 'Barracas'
        };
        
        const icones = {
            'comidas': '🌽',
            'brincadeiras': '🎯',
            'participantes': '👥',
            'barracas': '🏪'
        };
        
        if (breadcrumbText) breadcrumbText.textContent = titulos[tabId] || tabId;
        if (breadcrumbIcon) breadcrumbIcon.textContent = icones[tabId] || '📋';
    }

    configurarModal() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
    }

    abrirModal() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        this.preencherFormularioModal();
        modal.classList.add('active');
    }

    fecharModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.remove('active');
    }

    preencherFormularioModal() {
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        if (!title || !body) return;
        
        const titulos = {
            'comidas': 'Adicionar Comida Típica',
            'brincadeiras': 'Adicionar Brincadeira',
            'participantes': 'Adicionar Participante',
            'barracas': 'Adicionar Barraca'
        };
        
        title.textContent = titulos[this.tabelaAtual] || 'Adicionar Item';
        
        let formularioHTML = '';
        
        switch(this.tabelaAtual) {
            case 'comidas':
                formularioHTML = `
                    <form id="form-item" onsubmit="event.preventDefault(); app.salvarItem()">
                        <div class="form-field">
                            <label>Nome da Comida *</label>
                            <input type="text" class="form-input" id="input-nome" required placeholder="Ex: Canjica, Pamonha...">
                        </div>
                        <div class="form-field">
                            <label>Preço (R$) *</label>
                            <input type="number" class="form-input" id="input-preco" step="0.01" required placeholder="0.00">
                        </div>
                        <div class="form-field">
                            <label>Categoria</label>
                            <select class="form-input" id="input-categoria">
                                <option value="doce">🍬 Doce</option>
                                <option value="salgada">🥮 Salgada</option>
                                <option value="bebida">🥤 Bebida</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">💾 Salvar Comida</button>
                    </form>
                `;
                break;
                
            case 'brincadeiras':
                formularioHTML = `
                    <form id="form-item" onsubmit="event.preventDefault(); app.salvarItem()">
                        <div class="form-field">
                            <label>Nome da Brincadeira *</label>
                            <input type="text" class="form-input" id="input-nome" required placeholder="Ex: Pescaria...">
                        </div>
                        <div class="form-field">
                            <label>Prêmio (R$)</label>
                            <input type="number" class="form-input" id="input-premio" step="0.01" placeholder="0.00">
                        </div>
                        <div class="form-field">
                            <label>Duração (minutos)</label>
                            <input type="number" class="form-input" id="input-duracao" placeholder="15">
                        </div>
                        <button type="submit" class="btn-submit">💾 Salvar Brincadeira</button>
                    </form>
                `;
                break;
                
            case 'participantes':
                formularioHTML = `
                    <form id="form-item" onsubmit="event.preventDefault(); app.salvarItem()">
                        <div class="form-field">
                            <label>Nome Completo *</label>
                            <input type="text" class="form-input" id="input-nome" required placeholder="Nome do participante">
                        </div>
                        <div class="form-field">
                            <label>Fantasia</label>
                            <input type="text" class="form-input" id="input-fantasia" placeholder="Ex: Noiva Caipira">
                        </div>
                        <div class="form-field">
                            <label>Tipo</label>
                            <select class="form-input" id="input-tipo">
                                <option value="visitante">🎭 Visitante</option>
                                <option value="organizador">👔 Organizador</option>
                                <option value="artista">🎤 Artista</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">💾 Salvar Participante</button>
                    </form>
                `;
                break;
                
            case 'barracas':
                formularioHTML = `
                    <form id="form-item" onsubmit="event.preventDefault(); app.salvarItem()">
                        <div class="form-field">
                            <label>Nome da Barraca *</label>
                            <input type="text" class="form-input" id="input-nome" required placeholder="Ex: Barraca do Beijo">
                        </div>
                        <div class="form-field">
                            <label>Responsável *</label>
                            <input type="text" class="form-input" id="input-responsavel" required placeholder="Nome do responsável">
                        </div>
                        <div class="form-field">
                            <label>Tipo</label>
                            <select class="form-input" id="input-tipo">
                                <option value="comida">🍽️ Comida</option>
                                <option value="jogos">🎲 Jogos</option>
                                <option value="danca">💃 Dança</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">💾 Salvar Barraca</button>
                    </form>
                `;
                break;
        }
        
        body.innerHTML = formularioHTML;
    }

    salvarItem() {
        const nome = document.getElementById('input-nome')?.value;
        if (!nome) {
            this.mostrarToast('Preencha o nome do item!', 'error');
            return;
        }
        
        const item = {
            id: Date.now(),
            nome: nome,
            created_at: new Date().toISOString()
        };
        
        switch(this.tabelaAtual) {
            case 'comidas':
                item.preco = parseFloat(document.getElementById('input-preco')?.value) || 0;
                item.categoria = document.getElementById('input-categoria')?.value || 'doce';
                break;
            case 'brincadeiras':
                item.premio = parseFloat(document.getElementById('input-premio')?.value) || 0;
                item.duracao = parseInt(document.getElementById('input-duracao')?.value) || 0;
                break;
            case 'participantes':
                item.fantasia = document.getElementById('input-fantasia')?.value || '';
                item.tipo = document.getElementById('input-tipo')?.value || 'visitante';
                break;
            case 'barracas':
                item.responsavel = document.getElementById('input-responsavel')?.value || '';
                item.tipo = document.getElementById('input-tipo')?.value || 'comida';
                break;
        }
        
        this.dados[this.tabelaAtual].unshift(item);
        this.salvarLocalStorage();
        this.fecharModal();
        this.renderizarLista(this.tabelaAtual);
        this.mostrarToast('Item adicionado com sucesso! ✅', 'success');
    }

    excluirItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;
        
        this.dados[this.tabelaAtual] = this.dados[this.tabelaAtual].filter(item => item.id !== id);
        this.salvarLocalStorage();
        this.renderizarLista(this.tabelaAtual);
        this.mostrarToast('Item excluído! 🗑️', 'success');
    }

    carregarDadosLocais() {
        const tabelas = ['comidas', 'brincadeiras', 'participantes', 'barracas'];
        tabelas.forEach(tabela => {
            const dados = localStorage.getItem(`festa_${tabela}`);
            if (dados) {
                try {
                    this.dados[tabela] = JSON.parse(dados);
                } catch (e) {
                    this.dados[tabela] = [];
                }
            }
        });
    }

    salvarLocalStorage() {
        Object.keys(this.dados).forEach(tabela => {
            localStorage.setItem(`festa_${tabela}`, JSON.stringify(this.dados[tabela]));
        });
    }

    renderizarLista(tabela) {
        const container = document.getElementById('items-container');
        const emptyState = document.getElementById('empty-state');
        
        if (!container) return;
        
        const itens = this.dados[tabela] || [];
        
        // Limpar cards existentes
        const existingCards = container.querySelectorAll('.item-card');
        existingCards.forEach(card => card.remove());
        
        // Mostrar/esconder empty state
        if (emptyState) {
            emptyState.style.display = itens.length === 0 ? 'block' : 'none';
        }
        
        // Renderizar cards
        itens.forEach(item => {
            const card = this.criarCard(tabela, item);
            container.appendChild(card);
        });
        
        this.atualizarContadores();
    }

    criarCard(tabela, item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        let emoji = '📦';
        let badgeClass = '';
        let badgeText = '';
        let infoHTML = '';
        
        switch(tabela) {
            case 'comidas':
                const emojisComida = { 'doce': '🍰', 'salgada': '🥮', 'bebida': '🥤' };
                emoji = emojisComida[item.categoria] || '🍽️';
                badgeClass = item.categoria;
                badgeText = item.categoria;
                infoHTML = `
                    <div class="card-info">
                        <span class="card-info-label">Preço:</span>
                        <span class="card-info-value">R$ ${parseFloat(item.preco || 0).toFixed(2)}</span>
                    </div>
                `;
                break;
                
            case 'brincadeiras':
                emoji = '🎯';
                badgeText = 'Brincadeira';
                infoHTML = `
                    <div class="card-info">
                        <span class="card-info-label">Prêmio:</span>
                        <span class="card-info-value">R$ ${parseFloat(item.premio || 0).toFixed(2)}</span>
                    </div>
                    <div class="card-info">
                        <span class="card-info-label">Duração:</span>
                        <span class="card-info-value">${item.duracao || 0} min</span>
                    </div>
                `;
                break;
                
            case 'participantes':
                const emojisPart = { 'visitante': '🎭', 'organizador': '👔', 'artista': '🎤' };
                emoji = emojisPart[item.tipo] || '👤';
                badgeText = item.tipo;
                infoHTML = `
                    <div class="card-info">
                        <span class="card-info-label">Fantasia:</span>
                        <span class="card-info-value">${item.fantasia || 'Não informada'}</span>
                    </div>
                `;
                break;
                
            case 'barracas':
                const emojisBarr = { 'comida': '🍽️', 'jogos': '🎲', 'danca': '💃' };
                emoji = emojisBarr[item.tipo] || '🏪';
                badgeText = item.tipo;
                infoHTML = `
                    <div class="card-info">
                        <span class="card-info-label">Responsável:</span>
                        <span class="card-info-value">${item.responsavel || 'Não informado'}</span>
                    </div>
                `;
                break;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-emoji">${emoji}</span>
                <span class="card-badge ${badgeClass}">${badgeText}</span>
            </div>
            <h3 class="card-title">${item.nome}</h3>
            ${infoHTML}
            <div class="card-footer">
                <button class="btn-remove" onclick="app.excluirItem(${item.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M5 4V2.5C5 2.22386 5.22386 2 5.5 2H10.5C10.7761 2 11 2.22386 11 2.5V4M6.5 7V11.5M9.5 7V11.5M3.5 4L4.5 13.5C4.5 13.7761 4.72386 14 5 14H11C11.2761 14 11.5 13.7761 11.5 13.5L12.5 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Excluir
                </button>
            </div>
        `;
        
        return card;
    }

    atualizarContadores() {
        Object.keys(this.dados).forEach(tabela => {
            const badge = document.getElementById(`count-${tabela}`);
            if (badge) badge.textContent = this.dados[tabela].length;
        });
        
        const totalItems = document.getElementById('total-items');
        const valorTotal = document.getElementById('valor-total');
        const categoriasCount = document.getElementById('categorias-count');
        
        if (totalItems) {
            const total = Object.values(this.dados).reduce((sum, arr) => sum + arr.length, 0);
            totalItems.textContent = total;
        }
        
        if (valorTotal) {
            let totalValor = 0;
            this.dados.comidas.forEach(item => totalValor += parseFloat(item.preco || 0));
            this.dados.brincadeiras.forEach(item => totalValor += parseFloat(item.premio || 0));
            valorTotal.textContent = `R$ ${totalValor.toFixed(2)}`;
        }
        
        if (categoriasCount) {
            const categorias = new Set();
            this.dados.comidas.forEach(item => categorias.add(item.categoria));
            this.dados.participantes.forEach(item => categorias.add(item.tipo));
            this.dados.barracas.forEach(item => categorias.add(item.tipo));
            categoriasCount.textContent = categorias.size;
        }
    }

    mostrarToast(mensagem, tipo = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.textContent = mensagem;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicialização
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new FestaJuninaApp();
    
    window.abrirModal = () => app.abrirModal();
    window.fecharModal = () => app.fecharModal();
    window.app = app;
});