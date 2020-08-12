import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('classes').del()

  const subjects = [
    'Artes',
    'Biologia',
    'Ciências',
    'Educação Física',
    'Física',
    'Geografia',
    'História',
    'Matemática',
    'Português',
    'Química',
  ]
  const [bruno, diego, demo] = [1, 2, 3]

  // Inserts seed entries
  await knex('classes').insert([
    {
      id: 1,
      subject_id: subjects.indexOf('Física'),
      user_id: bruno,
      summary: `Mostrar a Física quanto Ciência que estuda os fenômenos que ocorrem na natureza;
Estimular o espírito científico dos alunos;
Ampliar os conceitos de Ciência, Física e Tecnologia e evidenciar sua importância no
desenvolvimento da sociedade;
Relacionar os conteúdos da referida disciplina com fatos que ocorrem na vida cotidiana das
pessoas e principalmente na vida dos alunos (na escola, em casa ou dentro de sala de aula);
Compreender de forma mais eficaz os conceitos e princípios básicos da disciplina através da
montagem/criação de experimentos didáticos e ou alternativos com material do laboratório de
Física ou reciclável/baixo custo.`,
      cost: Math.ceil(Math.random() * 150),
    },
    {
      id: 2,
      subject_id: subjects.indexOf('Matemática'),
      user_id: bruno,
      summary: `- Identificar e utilizar diferentes representações em situações problemas;
 - Resolver problema que envolva variação proporcional, direta ou inversa, entre
grandezas;
- Aplicar o conceito de Função aplicados em diferentes representações para
resolver situações do cotidiano;
- Aplicar a representação algébrica e gráfica para solucionar situações em
diferentes áreas do conhecimento;
- Identificar a representação algébrica e/ou gráfica de uma função exponencial;
- Identificar a representação algébrica e/ou gráfica de uma função logarítmica,
reconhecendo-a como inversa da função exponencial.`,
      cost: Math.ceil(Math.random() * 150),
    },
    {
      id: 3,
      subject_id: subjects.indexOf('Geografia'),
      user_id: diego,
      summary: `Geografia uma ciência para entender o mundo, desde a primeira natureza como
a partir representação do espaço geográfico, enfatizando a dinâmica da natureza
nas camadas da litosfera, hidrosfera, atmosfera e biosfera, inserindo-se neste
contexto população e as transformações do espaço como resultado dos modos
de produção pelos quais a sociedade se organiza para atender suas
necessidades de consumo.`,
      cost: Math.ceil(Math.random() * 150),
    },
    {
      id: 4,
      subject_id: subjects.indexOf('História'),
      user_id: demo,
      summary: `Nunc fringilla non neque eget eleifend. Nunc sit amet ultricies mauris, sit amet fringilla quam. Proin fringilla massa nulla, ac viverra est porta viverra. Ut eget diam vel justo euismod porta. Suspendisse nec sem iaculis, pretium tortor vel, placerat arcu. Sed vel accumsan nunc. Integer accumsan orci a fringilla convallis. Aenean sit amet sem laoreet, venenatis enim vitae, molestie dolor. Aliquam erat volutpat. Pellentesque porta, risus at rhoncus hendrerit, nisi neque consectetur purus, sit amet interdum ex nisl eget nisi. Donec sed aliquam nisl, sed consectetur erat. Curabitur eu finibus est. Suspendisse suscipit orci dui, sed sollicitudin velit eleifend et. Ut libero mi, maximus et quam ac, semper egestas lorem.`,
      cost: Math.ceil(Math.random() * 150),
    },
    {
      id: 5,
      subject_id: subjects.indexOf('Artes'),
      user_id: demo,
      summary: `Integer sollicitudin non eros a aliquam. Fusce tempus arcu non ligula consequat consectetur. Etiam aliquet libero tellus. Morbi a ex quis felis tempor laoreet non sit amet mi. Cras sapien nibh, mollis sit amet sapien id, malesuada blandit massa. Nulla ac diam pretium nibh tempus luctus et nec magna. Maecenas nisl ante, porttitor id porta non, consequat vitae ex. Donec at ligula purus. Phasellus enim lectus, suscipit in lacus eget, elementum venenatis neque. Sed eleifend convallis ex in condimentum. Pellentesque a rhoncus enim. Nam malesuada bibendum libero nec tincidunt. Vivamus molestie sit amet nulla eu fermentum.`,
      cost: Math.ceil(Math.random() * 150),
    },
  ])
}
