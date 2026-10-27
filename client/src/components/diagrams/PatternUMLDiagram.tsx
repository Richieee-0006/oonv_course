import React from 'react';

interface PatternUMLDiagramProps {
  patternKey: string;
}

interface BoxSpec {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  stereotype?: string;
  title: string;
  members: string[];
  kind?: 'interface' | 'abstract' | 'class' | 'client';
}

interface EdgeSpec {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'implements' | 'inherits' | 'composition' | 'aggregation' | 'dependency';
  label?: string;
}

const DIAGRAMS: Record<string, { boxes: BoxSpec[]; edges: EdgeSpec[]; note: string }> = {
  singleton: {
    note: 'Statická vlastnost Instance + privátní konstruktor (- KonfiguraceSingleton()).',
    boxes: [
      {
        id: 'client', x: 20, y: 65, w: 120, h: 60, stereotype: '«client»', title: 'Program',
        members: ['Main()'], kind: 'client'
      },
      {
        id: 's', x: 220, y: 30, w: 280, h: 130, stereotype: '«class»', title: 'KonfiguraceSingleton',
        members: [
          '- static _instance : KonfiguraceSingleton',
          '- KonfiguraceSingleton()   // PRIVATE!',
          '+ static Instance : KonfiguraceSingleton {get}'
        ],
        kind: 'class'
      }
    ],
    edges: [
      { x1: 140, y1: 95, x2: 220, y2: 95, type: 'dependency', label: 'KonfiguraceSingleton.Instance' }
    ]
  },
  'factory-method': {
    note: 'Tvůrce (GeneratorNepratel) má abstraktní tovární metodu VytvorNepritele() -> INepritel.',
    boxes: [
      {
        id: 'creator', x: 15, y: 15, w: 230, h: 78, stereotype: '«abstract»', title: 'GeneratorNepratel',
        members: ['+ SpustVlnu()', '+ abstract VytvorNepritele(): INepritel'], kind: 'abstract'
      },
      {
        id: 'ccreator', x: 15, y: 130, w: 230, h: 65, stereotype: '«class»', title: 'GeneratorProLes',
        members: ['+ override VytvorNepritele(): INepritel'], kind: 'class'
      },
      {
        id: 'prod', x: 300, y: 15, w: 210, h: 70, stereotype: '«interface»', title: 'INepritel',
        members: ['+ Zautoc(): void'], kind: 'interface'
      },
      {
        id: 'cprod', x: 300, y: 130, w: 210, h: 65, stereotype: '«class»', title: 'Kostlivec',
        members: ['+ Zautoc(): void'], kind: 'class'
      }
    ],
    edges: [
      { x1: 130, y1: 130, x2: 130, y2: 93, type: 'inherits' },
      { x1: 405, y1: 130, x2: 405, y2: 85, type: 'implements' },
      { x1: 245, y1: 50, x2: 300, y2: 50, type: 'dependency', label: 'creates' },
      { x1: 245, y1: 162, x2: 300, y2: 162, type: 'dependency', label: 'new' }
    ]
  },
  'abstract-factory': {
    note: 'Rozhraní továrny (INabytekFactory) vytváří celou rodinu souvisejících produktů (IZidle + IStul).',
    boxes: [
      {
        id: 'af', x: 15, y: 15, w: 235, h: 78, stereotype: '«interface»', title: 'INabytekFactory',
        members: ['+ VytvorZidli(): IZidle', '+ VytvorStul(): IStul'], kind: 'interface'
      },
      {
        id: 'cf', x: 15, y: 130, w: 235, h: 68, stereotype: '«class»', title: 'ModerniNabytekFactory',
        members: ['+ VytvorZidli(): IZidle', '+ VytvorStul(): IStul'], kind: 'class'
      },
      {
        id: 'p1', x: 305, y: 15, w: 205, h: 68, stereotype: '«interface»', title: 'IZidle / IStul',
        members: ['+ PosadSe() / + PolozKavu()'], kind: 'interface'
      },
      {
        id: 'cp1', x: 305, y: 130, w: 205, h: 68, stereotype: '«class»', title: 'ModerniZidle / Stul',
        members: ['+ PosadSe() / + PolozKavu()'], kind: 'class'
      }
    ],
    edges: [
      { x1: 132, y1: 130, x2: 132, y2: 93, type: 'implements' },
      { x1: 407, y1: 130, x2: 407, y2: 83, type: 'implements' },
      { x1: 250, y1: 50, x2: 305, y2: 50, type: 'dependency', label: 'rodina' },
      { x1: 250, y1: 164, x2: 305, y2: 164, type: 'dependency', label: 'new' }
    ]
  },
  builder: {
    note: 'Stavitel (IBuilder) skládá složitý objekt po krocích a na konci vrací hotový produkt přes Build().',
    boxes: [
      {
        id: 'dir', x: 15, y: 20, w: 195, h: 72, stereotype: '«class»', title: 'Director',
        members: ['- _builder: IBuilder', '+ PostavHerniPC()'], kind: 'client'
      },
      {
        id: 'ib', x: 265, y: 15, w: 245, h: 82, stereotype: '«interface»', title: 'IPocitacBuilder',
        members: ['+ PridejCPU()', '+ PridejGPU()', '+ Build(): Pocitac'], kind: 'interface'
      },
      {
        id: 'cb', x: 265, y: 130, w: 245, h: 68, stereotype: '«class»', title: 'HerniPCBuilder',
        members: ['- _pc: Pocitac', '+ PridejCPU() / + Build()'], kind: 'class'
      },
      {
        id: 'prod', x: 15, y: 130, w: 195, h: 68, stereotype: '«product»', title: 'Pocitac',
        members: ['+ CPU: string', '+ GPU: string'], kind: 'class'
      }
    ],
    edges: [
      { x1: 210, y1: 55, x2: 265, y2: 55, type: 'aggregation' },
      { x1: 387, y1: 130, x2: 387, y2: 97, type: 'implements' },
      { x1: 265, y1: 164, x2: 210, y2: 164, type: 'dependency', label: 'vytváří' }
    ]
  },
  adapter: {
    note: 'Adaptér implementuje cílové rozhraní (IPlatba - - ▷) a uvnitř drží cizí třídu přes kompozici (◇───> PayPalService).',
    boxes: [
      {
        id: 'target', x: 15, y: 15, w: 215, h: 70, stereotype: '«interface»', title: 'IPlatba (Target)',
        members: ['+ ZaplatKc(int castkaKc)'], kind: 'interface'
      },
      {
        id: 'adapter', x: 15, y: 125, w: 235, h: 72, stereotype: '«class»', title: 'PayPalAdapter',
        members: ['- _payPal: PayPalService', '+ ZaplatKc(int castkaKc)'], kind: 'class'
      },
      {
        id: 'adaptee', x: 300, y: 125, w: 215, h: 72, stereotype: '«adaptee»', title: 'PayPalService',
        members: ['+ SendPaymentInUsd(double usd)'], kind: 'class'
      }
    ],
    edges: [
      { x1: 122, y1: 125, x2: 122, y2: 85, type: 'implements' },
      { x1: 250, y1: 160, x2: 300, y2: 160, type: 'aggregation', label: '_payPal' }
    ]
  },
  proxy: {
    note: 'Proxy i Skutečná třída implementují STEJNÉ rozhraní (IDatabaze - - ▷) a Proxy drží odkaz na reálný objekt (◇───>).',
    boxes: [
      {
        id: 'subj', x: 155, y: 12, w: 220, h: 68, stereotype: '«interface»', title: 'IDatabaze (Subject)',
        members: ['+ NactiTajnaData(): string'], kind: 'interface'
      },
      {
        id: 'proxy', x: 15, y: 122, w: 235, h: 76, stereotype: '«proxy»', title: 'DatabazeProxy',
        members: ['- _skutecnaDb: SkutecnaDatabaze', '+ NactiTajnaData(): string'], kind: 'class'
      },
      {
        id: 'real', x: 295, y: 122, w: 220, h: 76, stereotype: '«real subject»', title: 'SkutecnaDatabaze',
        members: ['+ NactiTajnaData(): string'], kind: 'class'
      }
    ],
    edges: [
      { x1: 132, y1: 122, x2: 220, y2: 80, type: 'implements' },
      { x1: 405, y1: 122, x2: 310, y2: 80, type: 'implements' },
      { x1: 250, y1: 160, x2: 295, y2: 160, type: 'aggregation', label: '_skutecnaDb' }
    ]
  },
  decorator: {
    note: 'Dekorátor implementuje IKava (- - ▷) A ZÁROVEŇ drží uvnitř protected IKava _kava (◇───>) pro skládání do slupek cibule.',
    boxes: [
      {
        id: 'comp', x: 155, y: 10, w: 210, h: 66, stereotype: '«interface»', title: 'IKava',
        members: ['+ Popis(): string', '+ Cena(): int'], kind: 'interface'
      },
      {
        id: 'ccomp', x: 15, y: 115, w: 195, h: 70, stereotype: '«component»', title: 'Espresso',
        members: ['+ Popis(), + Cena()'], kind: 'class'
      },
      {
        id: 'dec', x: 265, y: 115, w: 250, h: 82, stereotype: '«abstract decorator»', title: 'KavaDecorator : IKava',
        members: ['# _kava: IKava', '+ virtual Popis() => _kava.Popis()', '+ override v SlekemDecorator'], kind: 'abstract'
      }
    ],
    edges: [
      { x1: 112, y1: 115, x2: 215, y2: 76, type: 'implements' },
      { x1: 360, y1: 115, x2: 310, y2: 76, type: 'implements' },
      { x1: 440, y1: 115, x2: 365, y2: 45, type: 'aggregation', label: '_kava' }
    ]
  },
  bridge: {
    note: 'Most odděluje Abstrakci (Tvar / DalkovyOvladac) od Implementace (IBarva / IZarizeni) pomocí kompozice (◇───>).',
    boxes: [
      {
        id: 'abs', x: 15, y: 15, w: 225, h: 75, stereotype: '«abstract»', title: 'Tvar (Abstraction)',
        members: ['# _barva: IBarva', '+ abstract Vykresli()'], kind: 'abstract'
      },
      {
        id: 'rabs', x: 15, y: 128, w: 225, h: 68, stereotype: '«refined»', title: 'Kruh : Tvar',
        members: ['+ override Vykresli()'], kind: 'class'
      },
      {
        id: 'impl', x: 300, y: 15, w: 215, h: 75, stereotype: '«interface»', title: 'IBarva (Implementor)',
        members: ['+ AplikujBarvu(): string'], kind: 'interface'
      },
      {
        id: 'cimpl', x: 300, y: 128, w: 215, h: 68, stereotype: '«concrete»', title: 'CervenaBarva',
        members: ['+ AplikujBarvu(): string'], kind: 'class'
      }
    ],
    edges: [
      { x1: 240, y1: 52, x2: 300, y2: 52, type: 'aggregation', label: 'most (_barva)' },
      { x1: 127, y1: 128, x2: 127, y2: 90, type: 'inherits' },
      { x1: 407, y1: 128, x2: 407, y2: 90, type: 'implements' }
    ]
  },
  flyweight: {
    note: 'Flyweight odděluje těžký sdílený vnitřní stav (DruhStromu v Dictionary) od lehkého vnějšího stavu (Strom X, Y).',
    boxes: [
      {
        id: 'fact', x: 15, y: 15, w: 230, h: 72, stereotype: '«factory»', title: 'TovarnaStromu',
        members: ['- _druhy: Dictionary<string, Druh>', '+ ZiskejDruh(nazev): DruhStromu'], kind: 'class'
      },
      {
        id: 'fw', x: 295, y: 15, w: 220, h: 75, stereotype: '«flyweight (intrinsic)»', title: 'DruhStromu',
        members: ['+ Nazev, Barva, Textura10MB', '+ Vykresli(int x, int y)'], kind: 'class'
      },
      {
        id: 'ctx', x: 140, y: 128, w: 255, h: 70, stereotype: '«context (extrinsic)»', title: 'Strom (1 000 000x)',
        members: ['+ X: int, + Y: int', '- _druh: DruhStromu (sdílený odkaz)'], kind: 'client'
      }
    ],
    edges: [
      { x1: 245, y1: 50, x2: 295, y2: 50, type: 'aggregation', label: 'cache' },
      { x1: 320, y1: 128, x2: 385, y2: 90, type: 'aggregation', label: '_druh' }
    ]
  },
  facade: {
    note: 'Fasáda poskytuje jednoduché rozhraní k sadě složitých subsystémů (Audio, Video, Kodek).',
    boxes: [
      {
        id: 'client', x: 15, y: 65, w: 125, h: 65, stereotype: '«client»', title: 'Program',
        members: ['Main()'], kind: 'client'
      },
      {
        id: 'facade', x: 185, y: 50, w: 170, h: 95, stereotype: '«facade»', title: 'KonvertorFacade',
        members: ['- _kodek, _audio', '+ PrevedVideo(soubor)'], kind: 'class'
      },
      {
        id: 'sub1', x: 395, y: 20, w: 120, h: 65, stereotype: '«subsystem»', title: 'VideoKodek',
        members: ['+ Dekoduj()'], kind: 'class'
      },
      {
        id: 'sub2', x: 395, y: 115, w: 120, h: 65, stereotype: '«subsystem»', title: 'AudioMixer',
        members: ['+ Smichej()'], kind: 'class'
      }
    ],
    edges: [
      { x1: 140, y1: 97, x2: 185, y2: 97, type: 'dependency' },
      { x1: 355, y1: 75, x2: 395, y2: 55, type: 'aggregation' },
      { x1: 355, y1: 120, x2: 395, y2: 145, type: 'aggregation' }
    ]
  },
  composite: {
    note: 'Kompozit (Slozka) i List (Soubor) implementují stejné rozhraní ISouborovySystem; Slozka obsahuje List<ISouborovySystem>.',
    boxes: [
      {
        id: 'comp', x: 150, y: 12, w: 225, h: 68, stereotype: '«interface»', title: 'ISouborovySystem',
        members: ['+ Zobraz(odsazeni)', '+ Velikost(): int'], kind: 'interface'
      },
      {
        id: 'leaf', x: 15, y: 122, w: 200, h: 72, stereotype: '«leaf»', title: 'Soubor',
        members: ['+ Velikost(): int'], kind: 'class'
      },
      {
        id: 'composite', x: 255, y: 122, w: 260, h: 76, stereotype: '«composite»', title: 'Slozka',
        members: ['- _polozky: List<ISouborovySystem>', '+ Pridej(ISouborovySystem)'], kind: 'class'
      }
    ],
    edges: [
      { x1: 115, y1: 122, x2: 220, y2: 80, type: 'implements' },
      { x1: 355, y1: 122, x2: 300, y2: 80, type: 'implements' },
      { x1: 460, y1: 122, x2: 375, y2: 46, type: 'aggregation', label: '_polozky' }
    ]
  },
  strategy: {
    note: 'Kontext (NakupniKosik) drží referenci na rozhraní IPlatebniBrana (◇───>) a umožňuje měnit algoritmus platby za běhu.',
    boxes: [
      {
        id: 'ctx', x: 15, y: 15, w: 235, h: 82, stereotype: '«context»', title: 'NakupniKosik',
        members: ['- _metoda: IPlatebniBrana', '+ NastavPlatebniMetodu(m)', '+ ZaplatitObjednavku(cena)'], kind: 'class'
      },
      {
        id: 'strat', x: 300, y: 15, w: 215, h: 72, stereotype: '«interface»', title: 'IPlatebniBrana',
        members: ['+ ProvedPlatbu(int kc): bool'], kind: 'interface'
      },
      {
        id: 'cs1', x: 280, y: 128, w: 235, h: 68, stereotype: '«concrete strategy»', title: 'PlatbaKartou / Krypto',
        members: ['+ ProvedPlatbu(int kc): bool'], kind: 'class'
      }
    ],
    edges: [
      { x1: 250, y1: 52, x2: 300, y2: 52, type: 'aggregation', label: '_metoda' },
      { x1: 405, y1: 128, x2: 405, y2: 87, type: 'implements' }
    ]
  },
  command: {
    note: 'Příkaz zabalí operaci do objektu s rozhraním IPrikaz (Execute / Undo), který ukládá Invoker do historie List<IPrikaz>.',
    boxes: [
      {
        id: 'inv', x: 15, y: 15, w: 215, h: 75, stereotype: '«invoker»', title: 'HistoriePrikazu',
        members: ['- _historie: Stack<IPrikaz>', '+ Spust(IPrikaz) / + Zpet()'], kind: 'class'
      },
      {
        id: 'cmd', x: 290, y: 15, w: 225, h: 75, stereotype: '«interface»', title: 'IPrikaz (Command)',
        members: ['+ Execute(): void', '+ Undo(): void'], kind: 'interface'
      },
      {
        id: 'ccmd', x: 290, y: 128, w: 225, h: 70, stereotype: '«concrete command»', title: 'VlozTextPrikaz',
        members: ['- _editor: TextEditor', '+ Execute() / + Undo()'], kind: 'class'
      },
      {
        id: 'rec', x: 15, y: 128, w: 215, h: 70, stereotype: '«receiver»', title: 'TextEditor',
        members: ['+ Obsah: string'], kind: 'client'
      }
    ],
    edges: [
      { x1: 230, y1: 52, x2: 290, y2: 52, type: 'aggregation', label: '_historie' },
      { x1: 402, y1: 128, x2: 402, y2: 90, type: 'implements' },
      { x1: 290, y1: 163, x2: 230, y2: 163, type: 'aggregation', label: '_editor' }
    ]
  },
  memento: {
    note: 'Originator (Editor) ukládá svůj vnitřní stav do neměnného snímku (Memento), který spravuje Caretaker bez porušení zapouzdření.',
    boxes: [
      {
        id: 'orig', x: 15, y: 20, w: 225, h: 82, stereotype: '«originator»', title: 'TextEditor',
        members: ['- _text: string', '+ UlozStav(): EditorMemento', '+ ObnovStav(EditorMemento)'], kind: 'class'
      },
      {
        id: 'mem', x: 295, y: 20, w: 220, h: 78, stereotype: '«memento»', title: 'EditorMemento',
        members: ['+ TextSnapshot: string {get}', '+ CasUlozeni: DateTime {get}'], kind: 'interface'
      },
      {
        id: 'care', x: 155, y: 130, w: 235, h: 68, stereotype: '«caretaker»', title: 'SpravceHistorie',
        members: ['- _zasobnik: Stack<EditorMemento>'], kind: 'client'
      }
    ],
    edges: [
      { x1: 240, y1: 58, x2: 295, y2: 58, type: 'dependency', label: 'creates' },
      { x1: 310, y1: 130, x2: 380, y2: 98, type: 'aggregation', label: 'snapshots' }
    ]
  },
  observer: {
    note: 'Vydavatel (Subject) drží seznam odběratelů List<IObserver> (◇───>) a při změně stavu jim v cyklu zavolá Update().',
    boxes: [
      {
        id: 'subj', x: 15, y: 20, w: 235, h: 95, stereotype: '«subject / publisher»', title: 'HerniHrdina',
        members: ['- _odberatele: List<IObserver>', '+ Prihlas(IObserver)', '+ UtrpZraneni(int) -> Notify()'], kind: 'class'
      },
      {
        id: 'obs', x: 300, y: 15, w: 215, h: 70, stereotype: '«interface»', title: 'IObserver',
        members: ['+ Update(zprava: string): void'], kind: 'interface'
      },
      {
        id: 'cobs', x: 300, y: 125, w: 215, h: 72, stereotype: '«concrete observer»', title: 'Statistiky / Achievement',
        members: ['+ Update(zprava: string): void'], kind: 'class'
      }
    ],
    edges: [
      { x1: 250, y1: 55, x2: 300, y2: 55, type: 'aggregation', label: '_odberatele' },
      { x1: 407, y1: 125, x2: 407, y2: 85, type: 'implements' }
    ]
  },
  state: {
    note: 'Kontext (Dokument) deleguje chování na aktuální stavový objekt IStavDokumentu (◇───> Koncept, Schvalovani, Publikovano).',
    boxes: [
      {
        id: 'ctx', x: 15, y: 20, w: 225, h: 85, stereotype: '«context»', title: 'Dokument',
        members: ['- _stav: IStavDokumentu', '+ ZmenStav(IStavDokumentu)', '+ Publikuj() => _stav.Publikuj()'], kind: 'class'
      },
      {
        id: 'st', x: 295, y: 15, w: 220, h: 70, stereotype: '«interface»', title: 'IStavDokumentu',
        members: ['+ Publikuj(Dokument doc)'], kind: 'interface'
      },
      {
        id: 'cst', x: 295, y: 125, w: 220, h: 72, stereotype: '«concrete states»', title: 'StavKoncept / Publikovano',
        members: ['+ Publikuj(Dokument doc)'], kind: 'class'
      }
    ],
    edges: [
      { x1: 240, y1: 55, x2: 295, y2: 55, type: 'aggregation', label: '_stav' },
      { x1: 405, y1: 125, x2: 405, y2: 85, type: 'implements' }
    ]
  }
};

export const PatternUMLDiagram: React.FC<PatternUMLDiagramProps> = ({ patternKey }) => {
  const spec = DIAGRAMS[patternKey] || DIAGRAMS.strategy;

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <svg viewBox="0 0 530 212" className="w-full h-auto min-w-[460px]">
          <defs>
            <marker id="uml-hollow-tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto">
              <polygon points="0 1, 11 6, 0 11" fill="#0f172a" stroke="#6366f1" strokeWidth="1.8" />
            </marker>
            <marker id="uml-open-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <polyline points="1 1, 9 5, 1 9" fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
            </marker>
            <marker id="uml-hollow-diamond" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="14" markerHeight="9" orient="auto">
              <polygon points="1 5, 8 1, 15 5, 8 9" fill="#0f172a" stroke="#10b981" strokeWidth="1.6" />
            </marker>
            <marker id="uml-filled-diamond" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="14" markerHeight="9" orient="auto">
              <polygon points="1 5, 8 1, 15 5, 8 9" fill="#10b981" stroke="#10b981" strokeWidth="1.4" />
            </marker>
          </defs>

          {/* Edges */}
          {spec.edges.map((e, idx) => {
            const isDashed = e.type === 'implements' || e.type === 'dependency';
            const strokeColor =
              e.type === 'implements' || e.type === 'inherits'
                ? '#6366f1'
                : e.type === 'aggregation' || e.type === 'composition'
                ? '#10b981'
                : '#8b5cf6';
            const markerEnd =
              e.type === 'implements' || e.type === 'inherits'
                ? 'url(#uml-hollow-tri)'
                : 'url(#uml-open-arrow)';
            const markerStart =
              e.type === 'aggregation'
                ? 'url(#uml-hollow-diamond)'
                : e.type === 'composition'
                ? 'url(#uml-filled-diamond)'
                : undefined;

            const midX = (e.x1 + e.x2) / 2;
            const midY = (e.y1 + e.y2) / 2 - 6;

            return (
              <g key={idx}>
                <line
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray={isDashed ? '5,4' : undefined}
                  markerStart={markerStart}
                  markerEnd={markerEnd}
                />
                {e.label && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-500 dark:fill-slate-400"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Class / Interface Boxes */}
          {spec.boxes.map((b) => {
            const strokeClass =
              b.kind === 'interface'
                ? 'stroke-indigo-500'
                : b.kind === 'abstract'
                ? 'stroke-purple-500'
                : b.kind === 'client'
                ? 'stroke-emerald-500'
                : 'stroke-slate-400 dark:stroke-slate-600';

            return (
              <g key={b.id}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="7"
                  className={`fill-white dark:fill-slate-900 ${strokeClass}`}
                  strokeWidth="1.8"
                />
                <line
                  x1={b.x}
                  y1={b.y + 34}
                  x2={b.x + b.w}
                  y2={b.y + 34}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                {b.stereotype && (
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + 13}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-indigo-500 dark:fill-indigo-400"
                  >
                    {b.stereotype}
                  </text>
                )}
                <text
                  x={b.x + b.w / 2}
                  y={b.y + 27}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-slate-900 dark:fill-white"
                >
                  {b.title}
                </text>
                {b.members.map((m, mIdx) => (
                  <text
                    key={mIdx}
                    x={b.x + 8}
                    y={b.y + 49 + mIdx * 14}
                    className="text-[9.5px] font-mono fill-slate-600 dark:fill-slate-300"
                  >
                    {m}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-300">{spec.note}</span>
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <span className="text-indigo-500">- - ▷ implementace</span>
          <span className="text-indigo-500">───▷ dědičnost</span>
          <span className="text-emerald-500">◇───&gt; kompozice</span>
        </div>
      </div>
    </div>
  );
};
