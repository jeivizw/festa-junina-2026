// ============================================
// FESTA JUNINA APP - SUPABASE FINAL
// ============================================

console.log('🚀 Carregando Festa Junina App...');

// ============================================
// SUPABASE
// ============================================

async function buscarDados(tabela) {

    const { data, error } = await supabaseClient
        .from(tabela)
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error(`❌ Erro ao buscar ${tabela}:`, error);
        return [];
    }

    return data || [];
}

// ============================================
// CONFIG
// ============================================

let tabelaAtual = 'comidas';

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async function() {

    console.log('📦 App inicializado');

    // ============================================
    // BOTÃO ADICIONAR
    // ============================================

    const btnAdd = document.getElementById('btn-add');

    if (btnAdd) {

        btnAdd.addEventListener('click', () => {

            console.log('🔥 BOTÃO CLICADO');

            abrirModal();
        });
    }

    // ============================================
    // NAVEGAÇÃO
    // ============================================

    document.querySelectorAll('.nav-btn').forEach(btn => {

        btn.addEventListener('click', async function() {

            document.querySelectorAll('.nav-btn')
                .forEach(b => b.classList.remove('active'));

            this.classList.add('active');

            tabelaAtual = this.dataset.tab;

            const titulos = {
                comidas: 'Comidas Típicas',
                brincadeiras: 'Brincadeiras',
                participantes: 'Participantes',
                barracas: 'Barracas'
            };

            const titulo =
                document.getElementById('current-section');

            if (titulo) {
                titulo.textContent = titulos[tabelaAtual];
            }

            await renderizarLista();
            await atualizarContadores();
        });
    });

    // ============================================
    // FECHAR MODAL
    // ============================================

    document.querySelector('.modal-backdrop')
        ?.addEventListener('click', fecharModal);

    document.querySelector('.modal-close')
        ?.addEventListener('click', fecharModal);

    document.addEventListener('keydown', function(e) {

        if (e.key === 'Escape') {
            fecharModal();
        }
    });

    // ============================================
    // INDICADOR CONEXÃO
    // ============================================

    const indicator =
        document.getElementById('connection-indicator');

    if (indicator) {

        const dot =
            indicator.querySelector('.indicator-dot');

        const text =
            indicator.querySelector('span');

        if (dot) {
            dot.className = 'indicator-dot connected';
        }

        if (text) {

            text.textContent =
                'Conectado ao Supabase ☁️';

            text.style.color = '#06D6A0';
        }
    }

    // ============================================
    // RENDER INICIAL
    // ============================================

    await renderizarLista();
    await atualizarContadores();

    console.log('✅ App carregado!');
});

// ============================================
// ABRIR MODAL
// ============================================

function abrirModal() {

    console.log('📂 Abrindo modal...');

    const modal = document.getElementById('modal');
    const titulo = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    if (!modal || !titulo || !body) {

        console.error('❌ Modal não encontrado');

        return;
    }

    const configs = {

        comidas: {
            titulo: 'Adicionar Comida',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>
                    <input type="text"
                           class="form-input"
                           id="campo-nome"
                           placeholder="Ex: Canjica">
                </div>

                <div class="form-field">
                    <label>Preço *</label>
                    <input type="number"
                           class="form-input"
                           id="campo-preco"
                           step="0.01"
                           placeholder="0.00">
                </div>

                <div class="form-field">
                    <label>Categoria</label>

                    <select class="form-input"
                            id="campo-categoria">

                        <option value="doce">
                            🍬 Doce
                        </option>

                        <option value="salgada">
                            🥮 Salgada
                        </option>

                        <option value="bebida">
                            🥤 Bebida
                        </option>

                    </select>
                </div>
            `
        },

        brincadeiras: {
            titulo: 'Adicionar Brincadeira',
            campos: `
                <div class="form-field">
                    <label>Nome *</label>

                    <input type="text"
                           class="form-input"
                           id="campo-nome"
                           placeholder="Ex: Pescaria">
                </div>

                <div class="form-field">
                    <label>Prêmio</label>

                    <input type="number"
                           class="form-input"
                           id="campo-premio"
                           step="0.01">
                </div>

                <div class="form-field">
                    <label>Duração</label>

                    <input type="number"
                           class="form-input"
                           id="campo-duracao">
                </div>
            `
        },

        participantes: {
            titulo: 'Adicionar Participante',

            campos: `
                <div class="form-field">
                    <label>Nome *</label>

                    <input type="text"
                           class="form-input"
                           id="campo-nome">
                </div>

                <div class="form-field">
                    <label>Fantasia</label>

                    <input type="text"
                           class="form-input"
                           id="campo-fantasia">
                </div>

                <div class="form-field">
                    <label>Tipo</label>

                    <select class="form-input"
                            id="campo-tipo">

                        <option value="visitante">
                            🎭 Visitante
                        </option>

                        <option value="organizador">
                            👔 Organizador
                        </option>

                        <option value="artista">
                            🎤 Artista
                        </option>

                    </select>
                </div>
            `
        },

        barracas: {
            titulo: 'Adicionar Barraca',

            campos: `
                <div class="form-field">
                    <label>Nome *</label>

                    <input type="text"
                           class="form-input"
                           id="campo-nome">
                </div>

                <div class="form-field">
                    <label>Responsável *</label>

                    <input type="text"
                           class="form-input"
                           id="campo-responsavel">
                </div>

                <div class="form-field">
                    <label>Tipo</label>

                    <select class="form-input"
                            id="campo-tipo">

                        <option value="comida">
                            🍽️ Comida
                        </option>

                        <option value="jogos">
                            🎲 Jogos
                        </option>

                        <option value="danca">
                            💃 Dança
                        </option>

                    </select>
                </div>
            `
        }
    };

    const config = configs[tabelaAtual];

    titulo.textContent = config.titulo;

    body.innerHTML = `
        ${config.campos}

        <button class="btn-submit"
                onclick="salvarItem()">

            💾 Salvar

        </button>
    `;

    modal.classList.add('active');
}

// ============================================
// FECHAR MODAL
// ============================================

function fecharModal() {

    document.getElementById('modal')
        ?.classList.remove('active');
}

// ============================================
// SALVAR ITEM
// ============================================

async function salvarItem() {

    const nome =
        document.getElementById('campo-nome')
        ?.value
        ?.trim();

    if (!nome) {

        alert('⚠️ Preencha o nome!');

        return;
    }

    const item = { nome };

    switch(tabelaAtual) {

        case 'comidas':

            item.preco = parseFloat(
                document.getElementById('campo-preco')
                ?.value || 0
            );

            item.categoria =
                document.getElementById('campo-categoria')
                ?.value || 'doce';

            break;

        case 'brincadeiras':

            item.premio = parseFloat(
                document.getElementById('campo-premio')
                ?.value || 0
            );

            item.duracao = parseInt(
                document.getElementById('campo-duracao')
                ?.value || 0
            );

            break;

        case 'participantes':

            item.fantasia =
                document.getElementById('campo-fantasia')
                ?.value || '';

            item.tipo =
                document.getElementById('campo-tipo')
                ?.value || 'visitante';

            break;

        case 'barracas':

            item.responsavel =
                document.getElementById('campo-responsavel')
                ?.value || '';

            item.tipo =
                document.getElementById('campo-tipo')
                ?.value || 'comida';

            break;
    }

    console.log('💾 Salvando:', item);

    const { error } = await supabaseClient
        .from(tabelaAtual)
        .insert([item]);

    if (error) {

        console.error('❌ Erro Supabase:', error);

        mostrarToast('❌ Erro ao salvar');

        return;
    }

    fecharModal();

    await renderizarLista();
    await atualizarContadores();

    mostrarToast('✅ Item salvo!');
}

// ============================================
// EXCLUIR ITEM
// ============================================

async function excluirItem(id) {

    const confirmar =
        confirm('Deseja excluir este item?');

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from(tabelaAtual)
        .delete()
        .eq('id', id);

    if (error) {

        console.error(error);

        mostrarToast('❌ Erro ao excluir');

        return;
    }

    await renderizarLista();
    await atualizarContadores();

    mostrarToast('🗑️ Item removido!');
}

// ============================================
// RENDERIZAR
// ============================================

async function renderizarLista() {

    const container =
        document.getElementById('items-container');

    const emptyState =
        document.getElementById('empty-state');

    if (!container) return;

    container.querySelectorAll('.item-card')
        .forEach(c => c.remove());

    const itens = await buscarDados(tabelaAtual);

    if (emptyState) {

        emptyState.style.display =
            itens.length === 0
                ? 'block'
                : 'none';
    }

    itens.forEach(item => {

        const card = criarCard(item);

        container.appendChild(card);
    });
}

// ============================================
// CARD
// ============================================

function criarCard(item) {

    const div = document.createElement('div');

    div.className = 'item-card';

    let emoji = '📦';
    let badge = '';
    let info = '';

    switch(tabelaAtual) {

        case 'comidas':

            emoji = {
                doce: '🍰',
                salgada: '🥮',
                bebida: '🥤'
            }[item.categoria] || '🍽️';

            badge = item.categoria;

            info = `
                <p style="color:#666;">
                    💰 R$ ${(item.preco || 0).toFixed(2)}
                </p>
            `;

            break;

        case 'brincadeiras':

            emoji = '🎯';

            badge = 'Jogo';

            info = `
                <p style="color:#666;">
                    🏆 R$ ${(item.premio || 0).toFixed(2)}
                    |
                    ⏱️ ${item.duracao || 0}min
                </p>
            `;

            break;

        case 'participantes':

            emoji = {
                visitante: '🎭',
                organizador: '👔',
                artista: '🎤'
            }[item.tipo] || '👤';

            badge = item.tipo;

            info = `
                <p style="color:#666;">
                    👗 ${item.fantasia || 'Sem fantasia'}
                </p>
            `;

            break;

        case 'barracas':

            emoji = {
                comida: '🍽️',
                jogos: '🎲',
                danca: '💃'
            }[item.tipo] || '🏪';

            badge = item.tipo;

            info = `
                <p style="color:#666;">
                    👨‍💼 ${item.responsavel || 'N/A'}
                </p>
            `;

            break;
    }

    div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">

            <span style="font-size:2.5rem;">
                ${emoji}
            </span>

            <span style="background:#f0f0f0;padding:4px 12px;border-radius:20px;font-size:0.8rem;">
                ${badge}
            </span>

        </div>

        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">
            ${item.nome}
        </h3>

        ${info}

        <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e5e5;text-align:right;">

            <button
                onclick="excluirItem(${item.id})"
                style="padding:8px 16px;background:transparent;color:#ef4444;border:1px solid #ef4444;border-radius:8px;cursor:pointer;"
            >
                🗑️ Excluir
            </button>

        </div>
    `;

    return div;
}

// ============================================
// CONTADORES
// ============================================

async function atualizarContadores() {

    const tabelas = [
        'comidas',
        'brincadeiras',
        'participantes',
        'barracas'
    ];

    let totalItens = 0;
    let totalValor = 0;

    for (const tabela of tabelas) {

        const dados = await buscarDados(tabela);

        totalItens += dados.length;

        const badge =
            document.getElementById(`count-${tabela}`);

        if (badge) {
            badge.textContent = dados.length;
        }

        if (tabela === 'comidas') {

            dados.forEach(i => {
                totalValor += Number(i.preco || 0);
            });
        }

        if (tabela === 'brincadeiras') {

            dados.forEach(i => {
                totalValor += Number(i.premio || 0);
            });
        }
    }

    const totalEl =
        document.getElementById('total-items');

    if (totalEl) {
        totalEl.textContent = totalItens;
    }

    const valorEl =
        document.getElementById('valor-total');

    if (valorEl) {
        valorEl.textContent =
            `R$ ${totalValor.toFixed(2)}`;
    }

    const categoriasEl =
        document.getElementById('categorias-count');

    if (categoriasEl) {
        categoriasEl.textContent = '4';
    }
}

// ============================================
// TOAST
// ============================================

function mostrarToast(msg) {

    const container =
        document.getElementById('toast-container');

    if (!container) return;

    const toast = document.createElement('div');

    toast.style.cssText = `
        padding:12px 20px;
        background:#22c55e;
        color:white;
        border-radius:8px;
        margin-bottom:8px;
    `;

    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

console.log('🔥 APP JS CARREGADO');