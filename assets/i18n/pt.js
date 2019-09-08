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
            forgotDescription: 'Se você não lembra sua senha de acesso, apenas informe seu e-mail e nós iremos ajudá-lo.',
            forgotButton: 'Recuperar senha',
            forgotError: 'O e-mail informado não foi encontrado.',
            forgotSuccess: 'Em breve você receberá um e-mail com instruções sobre como recuperar sua senha.'
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
            register: 'CRIAR CONTA',
            success: 'Cadastrado com sucesso! Efetuando login.'
        },
        errorMessage: {
            error: 'Erro!',
            password: 'min de 6 caracteres',
            customerNotFound: 'Você precisa ser cadastrado por um profissional para acessar o sistema',
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
        email: 'e-mail*',
        password: 'senha*',
        confirmPassword: 'repetir senha*',
        cau: 'registro do cau*',
        cnpj: 'cnpj',
        projects: 'projetos por mês',
        companyName: 'nome da empresa',
        cpf: 'cpf*',
        rg: 'rg',
        name: 'nome*',
        birthDate: 'nascimento',
        linkedin: 'linkedin',
        instagram: 'instagram',
        instagramRequired: 'instagram*',
        phone: 'telefone',
        cellphone: 'celular*',
        neighborhood: 'bairro',
        zipCode: 'cep',
        address: 'endereço',
        number: 'número',
        complement: 'complemento',
        city: 'cidade',
        state: 'uf',
        abd: 'abd*',
        crea: 'crea*',
        proofOfAddress: 'comprovante de residência'
    },
    document: {
        cpf: 'cpf',
        rg: 'rg',
        cau: 'registro do cau*',
        cnpj: 'cnpj',
        abd: 'abd*',
        crea: 'crea*',
        proofOfAddress: 'comprovante de residência'
    },
    section: {
        client: 'CLIENTE',
        addClient: 'CADASTRAR CLIENTE',
        projects: 'PROJETOS',
        addProject: 'CADASTRAR PROJETO',
        editProject: 'EDITAR PROJETO',
        room: 'AMBIENTE',
        products: 'PRODUTOS',
        quote: 'RESUMO DE ORÇAMENTO',
        payment: 'PAGAMENTO',
        points: 'PROGRAMA DE PONTOS',
        passwordRecovery: 'Esqueceu a sua senha?',
        myProfile: 'Meu Perfil'
    },
    menu: {
        clients: 'Clientes',
        projects: 'Projetos',
        occurrences: 'Ocorrências',
        chat: 'Chat',
        points: 'Programa de pontos',
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
        projects: 'Projetos',
        quotes: 'Orçamentos',
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
        remove: 'Remover',
        details: 'Detalhes',
        continue: 'CONTINUAR',
        productError: 'Ocorreu um erro ao consultar o produto',
        delete: 'EXCLUIR',
        deleted: 'Produto excluído!'
    },
    checkout: {
        billingAddress: 'Endereço de cobrança',
        loading: 'carregando',
        unavailableShipping: 'indisponível',
        shippingAddress: 'Endereço de entrega',
        newAddress: 'Novo endereço',
        subtotal: 'Subtotal',
        send: 'ENVIAR PARA PAGAMENTO',
        finish: 'FINALIZAR PAGAMENTO',
        creditCardTitle: 'CARTÃO DE CRÉDITO',
        billetTitle: 'BOLETO',
        paymentMethodTitle: 'FORMA DE PAGAMENTO',
        creditLabel: 'Crédito',
        billetLabel: 'Boleto',
        payment: 'Pagamento',
        shipping: 'Frete',
        total: 'Total',
        paymentMethod: 'Formas de pagamento',
        add: 'Adicionar',
        saveAddress: 'SALVAR ENDEREÇO',
        error: {
            noBillingAddress: 'Informe um endereço de cobrança!',
            noShippingAddress: 'Informe um endereço de entrega!',
            noCartItems: 'Nenhum item selecionado!',
            noPayment: 'Nenum método de pagamento foi selecionado!',
            generic: 'Ocorreu um erro ao processar o pagamento. Tente novamente!',
            refused: 'Pagamento não autorizado. Revise os dados do cartão'
        },
        card: {
            number: 'NÚMERO DO CARTÃO',
            date: 'VALIDADE',
            cvv: 'CVV',
            name: 'NOME DO TITULAR',
            save: 'SALVAR',
            error: 'Dados inválidos. Verifique todos os campos'
        }
    },
    order: {
        title: 'Solicitação efetuada com sucesso!',
        message: 'Estamos aguardando a confirmação de pagamento do pedido #{{order}} pela administradora do cartão.\n\nAssim que seu pedido for aprovado, você receberá um e-mail de confirmação.'
    },
    editProfile: {
        changeProfilePicture: 'Alterar foto do perfil',
        personal: 'Dados ',
        data: 'pessoais',
        email: 'Email',
        telephone: 'Telefone',
        password: 'Senha',
        deleteAccount: 'Excluir minha conta',
        deleteAccountText: 'Tem certeza que deseja desativar sua conta?',
        yes: 'Desativar',
        no: 'Cancelar',
        currentPassword: 'Senha atual',
        newPassword: 'Nova senha',
        confirmPassword: 'Confirmar senha',
        update: 'ALTERAR',
        passwordSuccess: 'Senha alterada com sucesso!',
        telephoneSuccess: 'Telefone alterado com sucesso!',
        error: {
            telephone: 'Você deve inserir um número de telefone',
            passwordLength: 'A senha deve conter, no mínimo, 6 caracteres',
            wrongPassword: 'A senha atual está incorreta',
            passwordConfirmation: 'As senhas não coincidem'

        }
    },
    points: {
        balance: 'Seu saldo de pontos',
        credited: 'Acúmulo',
        debited: 'Resgate',
        points: 'pts'
    }
}