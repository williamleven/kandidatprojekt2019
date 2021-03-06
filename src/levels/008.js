import Level from '@/levels/level'
import Log from '../characters/log'
import Boulder from '../characters/boulder'
import FireBat from '../characters/firebat'

export default new Level(
  8, // Id
  [ // Hints
    'Du kan kolla i boken om du behöver hjälp att komma ihåg hur `elif` fungerar',
    'Kan du få firebat att göra olika saker beroende på vilken typ av hinder hen har framför sig?',
  ],
  [ // Helptexts
    'Titta vad de kan!',
    'Här kommer alla hinder igen. Nog kan vi få firebat att klara dem också!',
  ],
  [ // Entities
    new FireBat(5, 0, 100, 100, false),
  ],
  [ // Obstacles
    new Log(5, 6, 100),
    new Log(3, 8, 110),
    new Log(7, 8, 110),
    new Boulder(4, 9, 70),
    new Boulder(6, 9, 70),
  ]
)
