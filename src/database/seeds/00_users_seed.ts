import * as Knex from 'knex'
import { encryptPassword } from '../../models/UsersModel'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      name: 'Bruno',
      surname: 'de Araujo Alves',
      whatsapp: '+5562991206888',
      email: 'devbaraus@gmail.com',
      avatar: 'https://api.adorable.io/avatars/285/bruno@proffy.png',
      bio: `Sou Bruno, tenho 20 anos, moro em Anápolis - GO, estudante de Ciência da Computação no Instituto Federal de Goiás - Câmpus Anápolis.

Sempre fui apaixonado por computador e sempre quis entender como as coisas funcionam na parte de software.

Comecei a estudar HTML/CSS pelo canal Curso em Vídeo, porém não entendia nada quando o assunto era JS, então, olhei os vídeos de algoritmo.

Logo aprendi Python pelo canal eXcript e no outro ano entrei na curso de BCC.

Já desenvolvi alguns projetos para o curso mesmo usando Python, NodeJS, PHP e VueJS.
Meu portfólio é baraus.dev lá é possível encontrar alguns dos trabalhos que fiz (planejo reformular todo o site ainda) e também tenho um projeto que fiz usando a API do Spotify spotimy.tk.`,
      password: await encryptPassword('Admin1234)'),
    },
    {
      id: 3,
      name: 'Demo',
      surname: 'Demonstração',
      whatsapp: '+5562991206888',
      email: 'demo@gmail.com',
      avatar: 'https://api.adorable.io/avatars/285/demo@proffy.png',
      bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel venenatis risus. Etiam scelerisque, odio pretium tincidunt vestibulum, nisl massa luctus lacus, sed efficitur sem quam a lorem. Vivamus sed sodales metus, quis euismod ante. Pellentesque eu feugiat turpis, et volutpat velit. Donec dictum urna ac lacinia consequat. Morbi non quam lorem. Duis a euismod elit. Mauris sed dapibus augue. Duis arcu erat, dictum eu tortor sed, rhoncus scelerisque lectus. Ut consequat molestie auctor. Mauris sit amet velit at enim molestie luctus nec eu massa. Fusce tincidunt nisi non tincidunt dapibus. Duis nulla arcu, dignissim sit amet elit at, tempor interdum massa. Vestibulum est massa, interdum sit amet tortor non, consectetur tempus leo.`,
      password: await encryptPassword('Demo1234demo'),
    },

    {
      id: 2,
      name: 'Diego',
      surname: 'Schell Fernandes',
      whatsapp: '+5562991206000',
      email: 'diego.schell.f@gmail.com',
      avatar: 'https://api.adorable.io/avatars/285/diego@proffy.png',
      bio: `Enthusiast of the best web & mobile development technologies.

Passionate about education and changing people's lives through programming. More than 200,000 people have already undergone one of my trainings.

"Nothing in this world beats good old persistence. Talent does not surpass. Nothing more common than talented failures. Genius does not overcome. Unrecognized geniuses is practically a cliche. Education does not exceed. The world is full of educated fools. Persistence and determination alone are powerful."`,
      password: await encryptPassword('Admin1234)'),
    },
  ])
}
