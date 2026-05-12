// Aplicativo Festa Junina - Gerenciamento
// Com suporte para Supabase (modo local e remoto)

class FestaJuninaApp {
    constructor() {
        this.dados = {
            comidas: this.carregarDadosLocais('comidas'),
            brincadeiras: this.carregarDadosLocais('brincadeiras'),
            participantes: this.carregarDadosLocais('participantes'),
            barracas: this.carregarDadosLocais('barracas')
        };
        
        this.supabase = null; // Será inicializado quando configurado
        this.usarSupabase = false; // Mude para true quando configurar o Supabase
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarNavegacao();
        this.configurarFormularios();
        this.carregarTodosDados();
        this.tentarConectarSupabase();
    }
    
    async tentarConectarSupabase() {
        if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'SUA_URL_DO_SUPABASE') {
            try {
                this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                this.usarSupabase = true;
                console.log('✅ Conectado ao Supabase com sucesso!');
                await this.carregarDadosSupabase();
            } catch (erro) {
                console.log('ℹ️ Usando armazenamento local:', erro.message);
            }
        } else {
            console.log('ℹ️ Supabase não configurado - usando armazenamento local');
        }
    }
    
    async carregarDadosSupabase() {
        if (!this.usarSupabase) return;
        
        try {
            // Carregar dados de todas as tabelas
            const tabelas = ['comidas', 'brincadeiras', 'participantes', 'barracas'];
            
            for (let tabela of tabelas) {
                const { data, error } = await this.supabase
                    .from(tabela)
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (!error && data) {
                    this.dados[tabela] = data;
                    this.salvarDadosLocais(tabela, data);
                }
            }
            
            this.renderizarTodasListas();
        } catch (erro) {
            console.log('Erro ao carregar dados do Supabase:', erro);
        }
    }
    
    async adicionarItemSupabase(tabela, dados) {
        if (!this.usarSupabase) return null;
        
        try {
            const { data, error } = await this.supabase
                .from(tabela)
                .insert([dados])
                .select();
                
            if (error) throw error;
            return data[0];
        } catch (erro) {
            console.error(`Erro ao adicionar em ${tabela}:`, erro);
            return null;
        }
    }
    
    async excluirItemSupabase(tabela, id) {
        if (!this.usarSupabase) return false;
        
        try {
            const { error } = await this.supabase
                .from(tabela)
                .delete()
                .match({ id: id });
                
            if (error) throw error;
            return true;
        } catch (erro) {
            console.error(`Erro ao excluir de ${tabela}:`, erro);
            return false;
        }
    }
    
    configurarNavegacao() {
        const botoes = document.querySelectorAll('.btn-nav');
        const secoes = document.querySelectorAll('.secao');
        
        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                const secaoId = botao.dataset.secao;
                
                botoes.forEach(b => b.classList.remove('ativo'));
                botao.classList.add('ativo');
                
                secoes.forEach(s => s.classList.remove('ativa'));
                document.getElementById(secaoId).classList.add('ativa');
            });
        });
    }
    
    configurarFormularios() {
        // Formulário de comidas
        document.getElementById('form-comida').addEventListener('submit', async (e) => {
            e.preventDefault();
            const item = {
                nome: document.getElementById('nome-comida').value,
                preco: parseFloat(document.getElementById('preco-comida').value),
                categoria: document.getElementById('categoria-comida').value
            };
            
            await this.adicionarItem('comidas', item);
            e.target.reset();
        });
        
        // Formulário de brincadeiras
        document.getElementById('form-brincadeira').addEventListener('submit', async (e) => {
            e.preventDefault();
            const item = {
                nome: document.getElementById('nome-brincadeira').value,
                premio: parseFloat(document.getElementById('premio-brincadeira').value) || 0,
                duracao: parseInt(document.getElementById('duracao-brincadeira').value) || 0
            };
            
            await this.adicionarItem('brincadeiras', item);
            e.target.reset();
        });
        
        // Formulário de participantes
        document.getElementById('form-participante').addEventListener('submit', async (e) => {
            e.preventDefault();
            const item = {
                nome: document.getElementById('nome-participante').value,
                fantasia: document.getElementById('fantasia-participante').value || 'Sem fantasia',
                tipo: document.getElementById('tipo-participante').value
            };
            
            await this.adicionarItem('participantes', item);
            e.target.reset();
        });
        
        // Formulário de barracas
        document.getElementById('form-barraca').addEventListener('submit', async (e) => {
            e.preventDefault();
            const item = {
                nome: document.getElementById('nome-barraca').value,
                responsavel: document.getElementById('responsavel-barraca').value,
                tipo: document.getElementById('tipo-barraca').value
            };
            
            await this.adicionarItem('barracas', item);
            e.target.reset();
        });
    }
    
    async adicionarItem(tabela, item) {
        // Adicionar timestamp
        item.id = Date.now();
        item.created_at = new Date().toISOString();
        
        // Tentar adicionar no Supabase primeiro
        if (this.usarSupabase) {
            const resultado = await this.adicionarItemSupabase(tabela, item);
            if (resultado) {
                item.id = resultado.id;
            }
        }
        
        // Adicionar localmente
        this.dados[tabela].unshift(item);
        this.salvarDadosLocais(tabela, this.dados[tabela]);
        this.renderizarLista(tabela);
        
        // Animação de confete para celebrar
        this.mostrarMensagem('Item adicionado com sucesso! 🎉');
    }
    
    async excluirItem(tabela, id) {
        // Tentar excluir no Supabase primeiro
        if (this.usarSupabase) {
            await this.excluirItemSupabase(tabela, id);
        }
        
        // Excluir localmente
        this.dados[tabela] = this.dados[tabela].filter(item => item.id !== id);
        this.salvarDadosLocais(tabela, this.dados[tabela]);
        this.renderizarLista(tabela);
        
        this.mostrarMensagem('Item removido! 🗑️');
    }
    
    carregarTodosDados() {
        this.renderizarLista('comidas');
        this.renderizarLista('brincadeiras');
        this.renderizarLista('participantes');
        this.renderizarLista('barracas');
    }
    
    renderizarTodasListas() {
        ['comidas', 'brincadeiras', 'participantes', 'barracas'].forEach(tabela => {
            this.renderizarLista(tabela);
        });
    }
    
    renderizarLista(tabela) {
        const container = document.getElementById(`lista-${tabela}`);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.dados[tabela].length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum item cadastrado ainda! 🌟</p>';
            return;
        }
        
        this.dados[tabela].forEach(item => {
            const card = this.criarCard(tabela, item);
            container.appendChild(card);
        });
    }
    
    criarCard(tabela, item) {
        const card = document.createElement('div');
        card.className = 'card';
        
        switch(tabela) {
            case 'comidas':
                const emojiComida = this.getEmojiComida(item.categoria);
                card.innerHTML = `
                    <div class="emoji">${emojiComida}</div>
                    <h3>${item.nome}</h3>
                    <p>💰 Preço: R$ ${parseFloat(item.preco).toFixed(2)}</p>
                    <p>📂 Categoria: ${this.formatarCategoria(item.categoria)}</p>
                `;
                break;
                
            case 'brincadeiras':
                card.innerHTML = `
                    <div class="emoji">🎯</div>
                    <h3>${item.nome}</h3>
                    <p>🏆 Prêmio: R$ ${parseFloat(item.premio || 0).toFixed(2)}</p>
                    <p>⏱️ Duração: ${item.duracao || 0} min</p>
                `;
                break;
                
            case 'participantes':
                const emojiParticipante = this.getEmojiParticipante(item.tipo);
                card.innerHTML = `
                    <div class="emoji">${emojiParticipante}</div>
                    <h3>${item.nome}</h3>
                    <p>👗 Fantasia: ${item.fantasia || 'Não informada'}</p>
                    <p>👤 Tipo: ${this.formatarCategoria(item.tipo)}</p>
                `;
                break;
                
            case 'barracas':
                const emojiBarraca = this.getEmojiBarraca(item.tipo);
                card.innerHTML = `
                    <div class="emoji">${emojiBarraca}</div>
                    <h3>${item.nome}</h3>
                    <p>👨‍💼 Responsável: ${item.responsavel}</p>
                    <p>🏷️ Tipo: ${this.formatarCategoria(item.tipo)}</p>
                `;
                break;
        }
        
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn-excluir';
        btnExcluir.textContent = '🗑️ Excluir';
        btnExcluir.onclick = () => this.excluirItem(tabela, item.id);
        
        card.appendChild(btnExcluir);
        return card;
    }
    
    getEmojiComida(categoria) {
        const emojis = {
            'doce': '🍰',
            'salgada': '🥮',
            'bebida': '🥤'
        };
        return emojis[categoria] || '🍽️';
    }
    
    getEmojiParticipante(tipo) {
        const emojis = {
            'visitante': '🎭',
            'organizador': '👔',
            'artista': '🎤'
        };
        return emojis[tipo] || '👤';
    }
    
    getEmojiBarraca(tipo) {
        const emojis = {
            'comida': '🍽️',
            'jogos': '🎲',
            'danca': '💃'
        };
        return emojis[tipo] || '🏪';
    }
    
    formatarCategoria(categoria) {
        const formatado = {
            'doce': '🍬 Doce',
            'salgada': '🥮 Salgada',
            'bebida': '🥤 Bebida',
            'visitante': '🎭 Visitante',
            'organizador': '👔 Organizador',
            'artista': '🎤 Artista',
            'comida': '🍽️ Comida',
            'jogos': '🎲 Jogos',
            'danca': '💃 Dança'
        };
        return formatado[categoria] || categoria;
    }
    
    mostrarMensagem(mensagem) {
        // Poderia ser implementado um toast notification
        console.log(mensagem);
    }
    
    carregarDadosLocais(chave) {
        const dados = localStorage.getItem(`festa_junina_${chave}`);
        return dados ? JSON.parse(dados) : [];
    }
    
    salvarDadosLocais(chave, dados) {
        localStorage.setItem(`festa_junina_${chave}`, JSON.stringify(dados));
    }
}

// Inicializar o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.appFestaJunina = new FestaJuninaApp();
});

// Dados de exemplo para começar (opcional)
function adicionarDadosExemplo() {
    const app = window.appFestaJunina;
    if (app.dados.comidas.length === 0) {
        const exemplos = {
            comidas: [
                { nome: 'Canjica', preco: 5.00, categoria: 'doce' },
                { nome: 'Pamonha', preco: 7.00, categoria: 'salgada' },
                { nome: 'Quentão', preco: 6.00, categoria: 'bebida' }
            ],
            brincadeiras: [
                { nome: 'Pescaria', premio: 10.00, duracao: 15 },
                { nome: 'Boca do Palhaço', premio: 8.00, duracao: 10 }
            ],
            participantes: [
                { nome: 'Maria Silva', fantasia: 'Noiva Caipira', tipo: 'visitante' },
                { nome: 'João Santos', fantasia: 'Caipira', tipo: 'organizador' }
            ],
            barracas: [
                { nome: 'Barraca do Beijo', responsavel: 'Ana Costa', tipo: 'danca' },
                { nome: 'Barraca de Doces', responsavel: 'Pedro Lima', tipo: 'comida' }
            ]
        };
        
        Object.keys(exemplos).forEach(tabela => {
            exemplos[tabela].forEach(item => {
                app.adicionarItem(tabela, item);
            });
        });
    }
}

// Adicionar dados de exemplo (descomente se quiser começar com dados)
// setTimeout(adicionarDadosExemplo, 1000);