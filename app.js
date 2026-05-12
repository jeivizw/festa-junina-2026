// ============================================
// APP FESTA JUNINA - Gerencimento Completo
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
        this.usandoSupabase = false;
        this.supabase = null;
        
        this.inicializar();
    }

    async inicializar() {
        this.configurarNavegacao();
        this.configurarModal();
        await this.inicializarSupabase();
        await this.carregarTodosDados();
    }

    // ============================================
    // SUPABASE
    // ============================================
    // No app.js, substitua o método inicializarSupabase:

async inicializarSupabase() {
    try {
        // Verificar se as credenciais estão configuradas
        const urlConfigurada = typeof SUPABASE_URL !== 'undefined' && 
                               SUPABASE_URL && 
                               !SUPABASE_URL.includes('SEU_PROJETO') &&
                               !SUPABASE_URL.includes('COLE_SUA_URL');
                               
        const keyConfigurada = typeof SUPABASE_KEY !== 'undefined' && 
                               SUPABASE_KEY && 
                               !SUPABASE_KEY.includes('COLE_SUA_CHAVE');

        if (!urlConfigurada || !keyConfigurada) {
            console.log('ℹ️ Supabase não configurado - usando armazenamento local');
            this.atualizarIndicadorConexao('local', 'Salvando no navegador');
            return;
        }

        if (typeof window.supabase === 'undefined') {
            console.warn('⚠️ Biblioteca do Supabase não carregada');
            this.atualizarIndicadorConexao('local', 'Salvando no navegador');
            return;
        }

        // Tentar criar cliente Supabase
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Testar conexão
        const { data, error } = await this.supabase
            .from('comidas')
            .select('count', { count: 'exact', head: true });

        if (error) {
            // Tabelas não existem
            if (error.code === '42P01') {
                console.warn('⚠️ Tabelas não encontradas no Supabase');
                this.atualizarIndicadorConexao('local', 'Tabelas não configuradas');
            } else {
                console.warn('⚠️ Erro ao conectar:', error.message);
                this.atualizarIndicadorConexao('local', 'Usando armazenamento local');
            }
            return;
        }

        // Conexão bem sucedida!
        this.usandoSupabase = true;
        this.atualizarIndicadorConexao('supabase', 'Conectado ao Supabase ✅');
        console.log('✅ Conectado ao Supabase com sucesso!');
        
    } catch (erro) {
        console.log('ℹ️ Usando armazenamento local:', erro.message);
        this.atualizarIndicadorConexao('local', 'Salvando no navegador');
    }
}

// Atualize também o método atualizarIndicadorConexao:
atualizarIndicadorConexao(tipo, mensagem) {
    const indicator = document.getElementById('connection-indicator');
    if (!indicator) return;
    
    const dot = indicator.querySelector('.indicator-dot');
    const text = indicator.querySelector('span');
    
    if (!dot || !text) return;
    
    // Remove classes existentes
    dot.className = 'indicator-dot';
    
    switch(tipo) {
        case 'supabase':
            dot.classList.add('connected');
            text.style.color = '#06D6A0';
            break;
        case 'local':
            dot.classList.add('local');
            text.style.color = '#FFD166';
            break;
        case 'error':
            dot.classList.add('disconnected');
            text.style.color = '#EF476F';
            break;
    }
    
    text.textContent = mensagem;
}

    // ============================================
    // NAVEGAÇÃO
    // ============================================
    configurarNavegacao() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = btn.dataset.tab;
                if (!tabId) return;
                
                // Atualizar botões
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Atualizar conteúdo
                this.tabelaAtual = tabId;
                this.atualizarBreadcrumb(tabId);
                this.renderizarLista(tabId);
            });
        });
    }

    atualizarBreadcrumb(tabId) {
        const breadcrumbText = document.getElementById('current-section');
        const breadcrumbIcon = document.querySelector('.breadcrumb-icon');
        
        if (!breadcrumbText || !breadcrumbIcon) return;
        
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
        
        breadcrumbText.textContent = titulos[tabId] || tabId;
        breadcrumbIcon.textContent = icones[tabId] || '📋';
    }

    // ============================================
    // MODAL
    // ============================================
    configurarModal() {
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal();
            }
        });

        // Fechar ao clicar no backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.fecharModal());
        }
    }

    abrirModal() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        this.preencherFormularioModal();
        modal.classList.add('active');
    }

    fecharModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
        }
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
                            <input type="text" class="form-input" id="input-nome" required placeholder="Ex: Pescaria, Boca do Palhaço...">
                        </div>
                        <div class="form-field">
                            <label>Valor do Prêmio (R$)</label>
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
                            <input type="text" class="form-input" id="input-fantasia" placeholder="Ex: Noiva Caipira, Caipira...">
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
                            <input type="text" class="form-input" id="input-nome" required placeholder="Ex: Barraca do Beijo...">
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

    // ============================================
    // SALVAR ITEM
    // ============================================
    async salvarItem() {
        let item = {};
        
        // Coletar dados do formulário
        const nome = document.getElementById('input-nome')?.value;
        if (!nome) {
            this.mostrarToast('Preencha o nome do item!', 'error');
            return;
        }
        
        item.nome = nome;
        item.created_at = new Date().toISOString();
        
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
        
        // Salvar no Supabase ou localStorage
        let salvo = false;
        
        if (this.usandoSupabase && this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from(this.tabelaAtual)
                    .insert([item])
                    .select()
                    .single();
                    
                if (!error && data) {
                    item.id = data.id;
                    salvo = true;
                }
            } catch (erro) {
                console.warn('Erro ao salvar no Supabase:', erro.message);
            }
        }
        
        // Sempre salvar no localStorage como backup
        if (!salvo) {
            item.id = Date.now();
        }
        
        this.dados[this.tabelaAtual].unshift(item);
        this.salvarLocalStorage();
        
        this.fecharModal();
        this.renderizarLista(this.tabelaAtual);
        this.mostrarToast('Item adicionado com sucesso! ✅', 'success');
    }

    // ============================================
    // EXCLUIR ITEM
    // ============================================
    async excluirItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;
        
        if (this.usandoSupabase && this.supabase) {
            try {
                await this.supabase
                    .from(this.tabelaAtual)
                    .delete()
                    .eq('id', id);
            } catch (erro) {
                console.warn('Erro ao excluir no Supabase:', erro.message);
            }
        }
        
        this.dados[this.tabelaAtual] = this.dados[this.tabelaAtual].filter(item => item.id !== id);
        this.salvarLocalStorage();
        this.renderizarLista(this.tabelaAtual);
        this.mostrarToast('Item excluído com sucesso! 🗑️', 'success');
    }

    // ============================================
    // CARREGAR DADOS
    // ============================================
    async carregarTodosDados() {
        // Carregar do localStorage primeiro
        this.carregarLocalStorage();
        
        // Tentar carregar do Supabase
        if (this.usandoSupabase && this.supabase) {
            const tabelas = ['comidas', 'brincadeiras', 'participantes', 'barracas'];
            
            for (let tabela of tabelas) {
                try {
                    const { data, error } = await this.supabase
                        .from(tabela)
                        .select('*')
                        .order('created_at', { ascending: false });
                        
                    if (!error && data && data.length > 0) {
                        this.dados[tabela] = data;
                    }
                } catch (erro) {
                    console.warn(`Erro ao carregar ${tabela}:`, erro.message);
                }
            }
            
            this.salvarLocalStorage();
        }
        
        this.renderizarLista('comidas');
        this.atualizarContadores();
    }

    carregarLocalStorage() {
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

    // ============================================
    // RENDERIZAR LISTA
    // ============================================
    renderizarLista(tabela) {
        const container = document.getElementById('items-container');
        const emptyState = document.getElementById('empty-state');
        
        if (!container) return;
        
        const itens = this.dados[tabela] || [];
        
        // Remover cards existentes
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
                emoji = this.getEmojiComida(item.categoria);
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
                emoji = this.getEmojiParticipante(item.tipo);
                badgeText = item.tipo;
                infoHTML = `
                    <div class="card-info">
                        <span class="card-info-label">Fantasia:</span>
                        <span class="card-info-value">${item.fantasia || 'Não informada'}</span>
                    </div>
                `;
                break;
                
            case 'barracas':
                emoji = this.getEmojiBarraca(item.tipo);
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

    getEmojiComida(categoria) {
        const emojis = { 'doce': '🍰', 'salgada': '🥮', 'bebida': '🥤' };
        return emojis[categoria] || '🍽️';
    }

    getEmojiParticipante(tipo) {
        const emojis = { 'visitante': '🎭', 'organizador': '👔', 'artista': '🎤' };
        return emojis[tipo] || '👤';
    }

    getEmojiBarraca(tipo) {
        const emojis = { 'comida': '🍽️', 'jogos': '🎲', 'danca': '💃' };
        return emojis[tipo] || '🏪';
    }

    // ============================================
    // ATUALIZAR CONTADORES
    // ============================================
    atualizarContadores() {
        // Atualizar badges da navegação
        Object.keys(this.dados).forEach(tabela => {
            const badge = document.getElementById(`count-${tabela}`);
            if (badge) {
                badge.textContent = this.dados[tabela].length;
            }
        });
        
        // Atualizar stats
        const totalItems = document.getElementById('total-items');
        const valorTotal = document.getElementById('valor-total');
        const categoriasCount = document.getElementById('categorias-count');
        
        if (totalItems) {
            const total = Object.values(this.dados).reduce((sum, arr) => sum + arr.length, 0);
            totalItems.textContent = total;
        }
        
        if (valorTotal) {
            let totalValor = 0;
            
            // Somar preços das comidas
            this.dados.comidas.forEach(item => {
                totalValor += parseFloat(item.preco || 0);
            });
            
            // Somar prêmios das brincadeiras
            this.dados.brincadeiras.forEach(item => {
                totalValor += parseFloat(item.premio || 0);
            });
            
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

    // ============================================
    // TOAST
    // ============================================
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

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new FestaJuninaApp();
    
    // Expor funções globais
    window.abrirModal = () => app.abrirModal();
    window.fecharModal = () => app.fecharModal();
    window.app = app;
});