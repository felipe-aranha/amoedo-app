export default {
    entity: {
        architect: "arquiteto",
        customer: "cliente"
    },
    common: {
        select: 'Selecione',
        cancel: 'Cancelar',
        continue: 'Continuar',
        takePhoto: 'Tirar foto',
        loadFromPhone: 'carregar do celular',
        error: 'Erro!',
        exitApp: 'Pressione novamente para sair'
    },
    profile: {
        student: 'Estudante',
        justGraduated: 'Recém-formado',
        professional: 'Profissional'
    },
    account: {
        accountType: {
            mainText: "A forma mais\nsimples de lidar\ncom seus ",
            highlight: "projetos",
            professional: "Profissionais da área",
            customers: "Clientes",
            technicalAssistance: 'Assistência Técnica'
        },
        login: {
            email: "E-mail",
            password: "Senha",
            forgot: "Esqueceu sua senha?",
            enter: "ACESSAR",
            register: "Novo? Cadastre-se ",
            here: "aqui",
        },
        profileSelection: {
            title: 'PERFIL',
            highlightDesc1: 'Seja bem-vindo',
            desc1: ',\npara iniciar o seu\ncadastro, selecione\no seu ',
            highlightDesc2: 'perfil',
            desc2: '.',
            select: 'Selecione',
            typeOf: 'tipo de {{type}}'
        },
        register: {
            personalDataTitle: 'DADOS ',
            personalDataHighlight: 'PESSOAIS',
            professionalDataTitle: 'DADOS ',
            professionalDataHighlight: 'PROFISSIONAIS',
            documentsTitle: 'DOCUMENTOS',
            register: 'CRIAR CONTA'
        },
        errorMessage: {
            password: 'min de 6 caracteres',
            name: 'nome e sobrenome',
            confirmPassword: 'senhas diferentes',
            emailRegistered: 'e-mail já cadastrado',
            invalidEmail: 'e-mail inválido',
            invalidCpf: 'cpf inválido',
            dob: 'data inválida',
            verifyFields: 'Verifique todos os campos antes de continuar',
            registerError: 'Ocorreu um erro ao efetuar o cadastro. Tente novamente!',
            login: 'Ocorreu um erro ao efetuar o login. Tente novamente!',
            auth: 'E-mail e/ou senha incorretos'
        },
        alert: {
            emailRegistered: 'O E-mail informado já está cadastrado na loja. Efetue o login ou altere o e-mail de cadastro.',
            button: {
                login: 'Login',
                changeEmail: 'Alterar E-mail'
            }
        },
        document: {
            rg: {
                title: 'Registro Geral - RG'
            },
            cpf: {
                title: 'CPF'
            },
            cau: {
                title: 'CAU'
            },
            cnpj: {
                title: 'CNPJ'
            },
            abd: {
                title: 'ABD'
            },
            crea: {
                title: 'CREA'
            },
            proofOfAddress: {
                title: 'comprovante de residência'
            },
            tutorial: '1. Pegue o documento: {{document}}\n\n2. Enquadre todo o documento na câmera\n\n3. Tire uma foto\n\n4. Envie a foto'
        }
    },
    form: {
        email: 'e-mail',
        password: 'senha',
        confirmPassword: 'repetir senha',
        cau: 'registro do cau',
        cnpj: 'cnpj',
        projects: 'projetos por mês',
        companyName: 'nome da empresa',
        cpf: 'cpf',
        rg: 'rg',
        name: 'nome',
        birthDate: 'nascimento',
        linkedin: 'linkedin',
        instagram: 'instagram',
        phone: 'telefone',
        cellphone: 'celular',
        neighborhood: 'bairro',
        zipCode: 'cep',
        address: 'endereço',
        number: 'número',
        complement: 'complemento',
        city: 'cidade',
        state: 'uf',
        abd: 'abd',
        crea: 'crea',
        proofOfAddress: 'comprovante de residência'
    },
    section: {
        client: 'CLIENTE',
        addClient: 'CADASTRAR CLIENTE',
        projects: 'PROJETOS',
        addProject: 'CADASTRAR PROJETO',
        editProject: 'EDITAR PROJETO',
        room: 'AMBIENTE',
        products: 'PRODUTOS'
    },
    menu: {
        clients: 'Clientes',
        projects: 'Projetos',
        occurrences: 'Ocorrências',
        chat: 'Chat',
        settings: 'Configurações',
        logout: 'Sair'
    },
    floatButton: {
        newClient: 'Novo cliente',
        clients: 'Clientes',
        newProject: 'Novo projeto',
        projects: 'Projetos'
    },
    empty: {
        clients: {
            title: 'Nenhum cliente cadastrado',
            subtitle: 'Cadastre novos clientes e tenha as informações organizadas em um só lugar.'
        },
        projects: {
            title: 'Nenhum projeto cadastrado',
            subtitle: 'Cadastre novos projetos e tenha as informações organizadas em um só lugar.'
        }
    },
    addClient: {
        title: 'QUEREMOS\nTE AJUDAR!',
        subtitle: 'Cadastre seu cliente',
        personType: {
            1: 'Pessoa Física',
            2: 'Pessoa Jurídica'
        },
        submit: 'CADASTRAR',
        success: 'Cliente cadastrado com sucesso!',
        fail: 'Ocorreu uma falha a cadastrar o cliente. Tente novamente!',
    },
    list: {
        client: {
            currentProjects: '{{qty}} projetos em andamento',
            currentProject: '1 projeto em andamento',
            doneProjects: '{{qty}} projetos realizados',
            doneProject: '1 projeto realizado'
        },
        project: {
            startedAt: 'Iniciado em {{date}}',
            inProgress: 'Em andamento',
            send: 'Orçamento enviado',
            delayed: 'Atrasado'
        }
    },
    project: {
        projectType: 'TIPO DE PROJETO',
        projectName: 'NOME DO PROJETO',
        summary: 'RESUMO',
        client: 'CLIENTE',
        newClient: 'NOVO CLIENTE',
        startDate: 'DATA INÍCIO',
        endDate: 'PREVISÃO DE TÉRMINO',
        rooms: 'AMBIENTES',
        save: 'SALVAR PROJETO',
        room: {
            bathroom: 'Banheiro',
            kitchen: 'Cozinha',
            bedroom: 'Quarto',
            livinRoom: 'Sala',
            balcony: 'Varanda'
        },
        type: {
            all: 'Todos',
            commercial: 'Comercial',
            residential: 'Residencial',
            others: 'Outros'
        }
    },
    newProject: {
        newClient: 'NOVO CLIENTE'
    },
    room: {
        width: 'LARGURA',
        height: 'ALTURA',
        depth: 'PROFUNDIDADE',
        description: 'DESCRIÇÃO',
        projectFiles: 'IMAGENS E ARQUIVOS DO PROJETO',
        add: 'ADICIONAR',
        products: 'PRODUTOS',
        save: 'SALVAR',
        uploading: 'Fazendo upload dos arquivos ({{qty}} de {{total}})',
        files: {
            title: 'Para prosseguir faça upload das imagens do projeto.',
            label: 'Imagem',
            before: 'Antes da obra',
            after: 'Depois da obra',
            files: 'Arquivos',
            newImage: 'Nova imagem',
            delete: 'Excluir',
            share: 'Compartilhar',
        }
    },
    mediaSelect: {
        take: 'Tirar foto',
        choose: 'Escolher da biblioteca',
        cancel: 'cancelar'
    },
    catalog: {
        currency: 'R$ ',
        from: 'De: ',
        to: 'Por: ',
        qty: 'Qtd',
        add: 'Adicionar',
        details: 'Detalhes',
        continue: 'CONTINUAR'
    }
}