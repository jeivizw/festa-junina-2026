// ============================================
// APP FESTA JUNINA - Versão Simplificada e Funcional
// ============================================

class FestaJuninaApp {
    constructor() {
        this.tabelaAtual = 'comidas';
        this.inicializar();
    }

    inicializar() {
        console.log('🚀 App iniciado!');
        console.log('📦 Dados atuais:', this.obterDados());
        
        this.configurarBotoesNavegacao();
        this.configurarBotaoAdicionar();
        this.renderizarLista('comidas');
        this.atualizarContadores();
        this.verificarConexao();
    }

    // ============================================
    // VERIFICAÇÃO DE CONEXÃO
    // ============================================
    verificarConexao() {
        const indicator = document.getElementById('connection-indicator');
        if (!indicator) return;
        
        const dot = indicator.querySelector('.indicator-dot');
        const text = indicator.querySelector('span');
        
        if (dot && text) {
            dot.className = 'indicator-dot local';
            text.textContent = 'Salvando no navegador 💾';
            text.style.color = '#22c55e';
        }
        
        // Testar localStorage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            console.log('✅ localStorage funcionando!');
        } catch (e) {
            console.error('❌ localStorage não disponível!');
            if (text) {
                text.textContent = 'Erro: localStorage indisponível';
                text.style.color = '#ef4444';
            }
        }
    }

    // ============================================
    // DADOS (LOCAL STORAGE)
    // ============================================
    obterDados() {
        const dados = {
            comidas: [],
            brincadeiras: [],
            participantes: [],
            barracas: []
        };
        
        try {
            const comidas = localStorage.getItem('festa_comidas');
            const brincadeiras = localStorage.getItem('festa_brincadeiras');
            const participantes = localStorage.getItem('festa_participantes');
            const barracas = localStorage.getItem('festa_barracas');
            
            if (comidas) dados.comidas = JSON.parse(comidas);
            if (brincadeiras) dados.brincadeiras = JSON.parse(brincadeiras);
            if (participantes) dados.participantes = JSON.parse(participantes);
            if (barracas) dados.barracas = JSON.parse(barracas);
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
        
        return dados;
    }

    salvarDados(tabela, dados) {
        try {
            localStorage.setItem(`festa_${tabela}`, JSON.stringify(dados));
            console.log(`✅ Dados salvos em festa_${tabela}:`, dados);
            return true;
        } catch (e) {
            console.error(`❌ Erro ao salvar ${tabela}:`, e);
            return false;
        }
    }

    // ============================================
    // NAVEGAÇÃO
    // ============================================
    configurarBotoesNavegacao() {
        const botoes = document.querySelectorAll('.nav-btn');
        console.log(`🔘 ${botoes.length} botões de navegação encontrados`);
        
        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                const tabId = botao.dataset.tab;
                console.log(`👆 Clicou em: ${tabId}`);
                
                // Remover ativo de todos
                botoes.forEach(b => b.classList.remove('active'));
                
                // Adicionar ativo no clicado
                botao.classList.add('active');
                
                // Atualizar tabela atual
                this.tabelaAtual = tabId;
                
                // Renderizar lista
                this.renderizarLista(tabId);
                
                // Atualizar breadcrumb
                this.atualizarTitulo(tabId);
            });
        });
    }

    configurarBotaoAdicionar() {
        const btnAdicionar = document.querySelector('.add-button');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', () => {
                console.log('➕ Abrindo modal para:', this.tabelaAtual);
                this.abrirModal();
            });
        }
    }

    atualizarTitulo(tabId) {
        const titulos = {
            'comidas': 'Comidas Típicas',
            'brincadeiras': 'Brincadeiras',
            'participantes': 'Participantes',
            'barracas': 'Barracas'
        };
        
        const breadcrumb = document.getElementById('current-section');
        if (breadcrumb) {
            breadcrumb.textContent = titulos[tabId] || tabId;
        }
    }

    // ============================================
    // MODAL
    // ============================================
    abrirModal() {
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('❌ Modal não encontrado!');
            return;
        }
        
        // Criar formulário
        const modalBody = document.getElementById('modal-body');
        const modalTitle = document.getElementById('modal-title');
        
        if (!modalBody || !modalTitle) return;
        
        const formularios = {
            comidas: {
                titulo: 'Adicionar Comida Típica',
                html: `
                    <div class="form-field">
                        <label>Nome da Comida *</label>
                        <input type="text" class="form-input" id="campo-nome" placeholder="Ex: Canjica">
                    </div>
                    <div class="form-field">
                        <label>Preço (R$) *</label>
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
                html: `
                    <div class="form-field">
                        <label>Nome da Brincadeira *</label>
                        <input type="text" class="form-input" id="campo-nome" placeholder="Ex: Pescaria">
                    </div>
                    <div class="form-field">
                        <label>Prêmio (R$)</label>
                        <input type="number" class="form-input" id="campo-premio" step="0.01" placeholder="0.00">
                    </div>
                    <div class="form-field">
                        <label>Duração (minutos)</label>
                        <input type="number" class="form-input" id="campo-duracao" placeholder="15">
                    </div>
                `
            },
            participantes: {
                titulo: 'Adicionar Participante',
                html: `
                    <div class="form-field">
                        <label>Nome Completo *</label>
                        <input type="text" class="form-input" id="campo-nome" placeholder="Nome do participante">
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
                html: `
                    <div class="form-field">
                        <label>Nome da Barraca *</label>
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
        
        const config = formularios[this.tabelaAtual];
        if (!config) return;
        
        modalTitle.textContent = config.titulo;
        modalBody.innerHTML = `
            ${config.html}
            <button class="btn-submit" id="btn-salvar" style="margin-top: 20px;">
                💾 Salvar
            </button>
        `;
        
        // Configurar botão salvar
        const btnSalvar = document.getElementById('btn-salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => {
                this.salvarItem();
            });
        }
        
        modal.classList.add('active');
    }

    fecharModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // ============================================
    // SALVAR ITEM
    // ============================================
    salvarItem() {
        console.log('💾 Tentando salvar em:', this.tabelaAtual);
        
        const nome = document.getElementById('campo-nome')?.value;
        
        if (!nome || nome.trim() === '') {
            alert('⚠️ Por favor, preencha o nome!');
            return;
        }
        
        // Criar objeto do item
        const item = {
            id: Date.now(),
            nome: nome.trim(),
            data: new Date().toISOString()
        };
        
        // Adicionar campos específicos
        switch(this.tabelaAtual) {
            case 'comidas':
                item.preco = parseFloat(document.getElementById('campo-preco')?.value) || 0;
                item.categoria = document.getElementById('campo-categoria')?.value || 'doce';
                break;
                
            case 'brincadeiras':
                item.premio = parseFloat(document.getElementById('campo-premio')?.value) || 0;
                item.duracao = parseInt(document.getElementById('campo-duracao')?.value) || 0;
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
        
        console.log('📝 Item criado:', item);
        
        // Obter dados existentes
        const dados = this.obterDados();
        const listaAtual = dados[this.tabelaAtual] || [];
        
        // Adicionar no início
        listaAtual.unshift(item);
        
        // Salvar
        const salvou = this.salvarDados(this.tabelaAtual, listaAtual);
        
        if (salvou) {
            console.log('✅ Item salvo com sucesso!');
            this.fecharModal();
            this.renderizarLista(this.tabelaAtual);
            this.atualizarContadores();
            this.mostrarMensagem('Item adicionado com sucesso! ✅');
        } else {
            alert('❌ Erro ao salvar! Verifique o console.');
        }
    }

    // ============================================
    // EXCLUIR ITEM
    // ============================================
    excluirItem(id) {
        console.log('🗑️ Excluindo item:', id);
        
        if (!confirm('Tem certeza que deseja excluir?')) return;
        
        const dados = this.obterDados();
        const listaAtual = dados[this.tabelaAtual] || [];
        
        const novaLista = listaAtual.filter(item => item.id !== id);
        
        const salvou = this.salvarDados(this.tabelaAtual, novaLista);
        
        if (salvou) {
            console.log('✅ Item excluído!');
            this.renderizarLista(this.tabelaAtual);
            this.atualizarContadores();
            this.mostrarMensagem('Item excluído! 🗑️');
        }
    }

    // ============================================
    // RENDERIZAR LISTA
    // ============================================
    renderizarLista(tabela) {
        console.log('🎨 Renderizando:', tabela);
        
        const container = document.getElementById('items-container');
        const emptyState = document.getElementById('empty-state');
        
        if (!container) {
            console.error('❌ Container não encontrado!');
            return;
        }
        
        // Limpar cards existentes
        const cardsExistentes = container.querySelectorAll('.item-card');
        cardsExistentes.forEach(card => card.remove());
        
        // Obter dados
        const dados = this.obterDados();
        const itens = dados[tabela] || [];
        
        console.log(`📊 ${itens.length} itens encontrados`);
        
        // Mostrar/esconder empty state
        if (emptyState) {
            emptyState.style.display = itens.length === 0 ? 'block' : 'none';
        }
        
        // Criar cards
        itens.forEach(item => {
            const card = this.criarCard(tabela, item);
            container.appendChild(card);
        });
    }

    criarCard(tabela, item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.marginBottom = '16px';
        
        let emoji = '📦';
        let badgeText = '';
        let infoHTML = '';
        
        switch(tabela) {
            case 'comidas':
                const emojisC = { 'doce': '🍰', 'salgada': '🥮', 'bebida': '🥤' };
                emoji = emojisC[item.categoria] || '🍽️';
                badgeText = item.categoria || 'doce';
                infoHTML = `<p style="margin:8px 0; color:#666;">💰 R$ ${parseFloat(item.preco || 0).toFixed(2)}</p>`;
                break;
                
            case 'brincadeiras':
                emoji = '🎯';
                badgeText = 'Brincadeira';
                infoHTML = `
                    <p style="margin:4px 0; color:#666;">🏆 Prêmio: R$ ${parseFloat(item.premio || 0).toFixed(2)}</p>
                    <p style="margin:4px 0; color:#666;">⏱️ ${item.duracao || 0} min</p>
                `;
                break;
                
            case 'participantes':
                const emojisP = { 'visitante': '🎭', 'organizador': '👔', 'artista': '🎤' };
                emoji = emojisP[item.tipo] || '👤';
                badgeText = item.tipo || 'visitante';
                infoHTML = `<p style="margin:8px 0; color:#666;">👗 ${item.fantasia || 'Sem fantasia'}</p>`;
                break;
                
            case 'barracas':
                const emojisB = { 'comida': '🍽️', 'jogos': '🎲', 'danca': '💃' };
                emoji = emojisB[item.tipo] || '🏪';
                badgeText = item.tipo || 'comida';
                infoHTML = `<p style="margin:8px 0; color:#666;">👨‍💼 ${item.responsavel || 'N/A'}</p>`;
                break;
        }
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                <span style="font-size:2.5rem;">${emoji}</span>
                <span style="background:#f0f0f0; padding:4px 12px; border-radius:20px; font-size:0.8rem;">${badgeText}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:8px;">${item.nome}</h3>
            ${infoHTML}
            <div style="margin-top:16px; padding-top:12px; border-top:1px solid #e5e5e5; text-align:right;">
                <button onclick="app.excluirItem(${item.id})" 
                        style="padding:8px 16px; background:transparent; color:#ef4444; border:1px solid #ef4444; border-radius:8px; cursor:pointer;">
                    🗑️ Excluir
                </button>
            </div>
        `;
        
        return card;
    }

    // ============================================
    // CONTADORES
    // ============================================
    atualizarContadores() {
        const dados = this.obterDados();
        
        // Badges da sidebar
        Object.keys(dados).forEach(tabela => {
            const badge = document.getElementById(`count-${tabela}`);
            if (badge) {
                badge.textContent = dados[tabela].length;
            }
        });
        
        // Stats
        const totalEl = document.getElementById('total-items');
        const valorEl = document.getElementById('valor-total');
        
        if (totalEl) {
            const total = Object.values(dados).reduce((soma, arr) => soma + arr.length, 0);
            totalEl.textContent = total;
        }
        
        if (valorEl) {
            let valorTotal = 0;
            dados.comidas.forEach(item => valorTotal += parseFloat(item.preco || 0));
            dados.brincadeiras.forEach(item => valorTotal += parseFloat(item.premio || 0));
            valorEl.textContent = `R$ ${valorTotal.toFixed(2)}`;
        }
    }

    // ============================================
    // MENSAGENS
    // ============================================
    mostrarMensagem(texto) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            padding: 12px 20px;
            background: #22c55e;
            color: white;
            border-radius: 8px;
            margin-bottom: 8px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = texto;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ============================================
// INICIAR APP
// ============================================
let app;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Iniciando Festa Junina App...');
    app = new FestaJuninaApp();
    
    // Expor globalmente
    window.app = app;
    
    // Configurar fechamento do modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            app.fecharModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            app.fecharModal();
        }
    });
    
    console.log('✅ App pronto!');
    console.log('💡 Dica: Abra o console para ver os logs de salvamento');
});