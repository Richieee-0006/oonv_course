export interface CategorizationItem {
  id: string;
  label: string;
  targetBucketId: string;
  explanation: string;
}

export interface CategorizationBucket {
  id: string;
  title: string;
  subtitle: string;
}

export interface CategorizationTask {
  id: string;
  type: 'categorize';
  title: string;
  description: string;
  buckets: CategorizationBucket[];
  items: CategorizationItem[];
}

export interface MatchingPair {
  id: string;
  leftText: string;
  rightText: string;
  explanation: string;
}

export interface MatchingTask {
  id: string;
  type: 'matching';
  title: string;
  description: string;
  pairs: MatchingPair[];
}

export type DragDropExercise = CategorizationTask | MatchingTask;

export const dragDropExercises: DragDropExercise[] = [
  // ==========================================================
  // 1. ROZTŘÍDĚNÍ VZORŮ DO 3 RODIN GoF
  // ==========================================================
  {
    id: 'dd-gof-families',
    type: 'categorize',
    title: '1. Roztřídění: 3 rodiny návrhových vzorů GoF',
    description: 'Přetáhni (nebo kliknutím přiřaď) každý návrhový vzor do správné rodiny podle toho, jaký problém řeší.',
    buckets: [
      {
        id: 'creational',
        title: 'Vytvářející (Creational)',
        subtitle: 'Jak vytvářet objekty bez lepení new všude po kódu'
      },
      {
        id: 'structural',
        title: 'Strukturální (Structural)',
        subtitle: 'Jak skládat třídy a objekty do větších celků'
      },
      {
        id: 'behavioral',
        title: 'Vzory chování (Behavioral)',
        subtitle: 'Jak spolu objekty komunikují a dělí si práci'
      }
    ],
    items: [
      {
        id: 'item-singleton',
        label: 'Singleton (Jedináček)',
        targetBucketId: 'creational',
        explanation: 'Vytvářející vzor: zajišťuje jedinou instanci třídy (private konstruktor + static Instance).'
      },
      {
        id: 'item-factory-method',
        label: 'Factory Method (Tovární metoda)',
        targetBucketId: 'creational',
        explanation: 'Vytvářející vzor: deleguje vytváření produktu (new) na podtřídy přes override.'
      },
      {
        id: 'item-abstract-factory',
        label: 'Abstract Factory (Abstraktní továrna)',
        targetBucketId: 'creational',
        explanation: 'Vytvářející vzor: vyrábí celé rodiny souvisejících produktů (např. Moderní vs. Retro nábytek).'
      },
      {
        id: 'item-builder',
        label: 'Builder (Stavitel)',
        targetBucketId: 'creational',
        explanation: 'Vytvářející vzor: skládá složitý objekt krok za krokem (.PridejCPU().Build()).'
      },
      {
        id: 'item-adapter',
        label: 'Adapter (Adaptér)',
        targetBucketId: 'structural',
        explanation: 'Strukturální vzor: převádí nekompatibilní rozhraní cizí třídy na rozhraní, které klient čeká.'
      },
      {
        id: 'item-proxy',
        label: 'Proxy (Zástupce)',
        targetBucketId: 'structural',
        explanation: 'Strukturální vzor: zastupuje jiný objekt se stejným rozhraním (kontrola přístupu, cache, lazy init).'
      },
      {
        id: 'item-decorator',
        label: 'Decorator (Dekorátor)',
        targetBucketId: 'structural',
        explanation: 'Strukturální vzor: obaluje objekt do „slupek cibule“ a dynamicky přidává chování.'
      },
      {
        id: 'item-bridge',
        label: 'Bridge (Most)',
        targetBucketId: 'structural',
        explanation: 'Strukturální vzor: odděluje dvě nezávislé dimenze (Tvar a IBarva) přes kompozici místo kombinatorické dědičnosti.'
      },
      {
        id: 'item-flyweight',
        label: 'Flyweight (Muší váha)',
        targetBucketId: 'structural',
        explanation: 'Strukturální vzor: šetří RAM sdílením velkého vnitřního stavu (DruhStromu v Dictionary) mezi miliony objektů.'
      },
      {
        id: 'item-strategy',
        label: 'Strategy (Strategie)',
        targetBucketId: 'behavioral',
        explanation: 'Vzor chování: vyčlení zaměnitelné algoritmy (způsoby platby) za společné rozhraní.'
      },
      {
        id: 'item-command',
        label: 'Command (Příkaz)',
        targetBucketId: 'behavioral',
        explanation: 'Vzor chování: zabalí požadavek/akci do samostatného objektu s Execute() a Undo().'
      },
      {
        id: 'item-memento',
        label: 'Memento (Memo)',
        targetBucketId: 'behavioral',
        explanation: 'Vzor chování: ukládá snímek vnitřního stavu objektu pro návrat zpět bez porušení zapouzdření.'
      },
      {
        id: 'item-observer',
        label: 'Observer (Pozorovatel)',
        targetBucketId: 'behavioral',
        explanation: 'Vzor chování: Subject drží List<IObserver> a při změně stavu všem zavolá Update().'
      }
    ]
  },

  // ==========================================================
  // 2. ROZTŘÍDĚNÍ PAMĚTI: STACK vs HEAP
  // ==========================================================
  {
    id: 'dd-stack-vs-heap',
    type: 'categorize',
    title: '2. Roztřídění: Hodnotové typy (Stack) vs. Referenční typy (Heap)',
    description: 'Zařaď datové typy a vlastnosti paměti v C# do správné kategorie (častá otázka u zkoušky!).',
    buckets: [
      {
        id: 'stack',
        title: 'Stack (Hodnotové typy / Value Types)',
        subtitle: 'Kopíruje se samotná hodnota, rychlý zásobník'
      },
      {
        id: 'heap',
        title: 'Heap (Referenční typy / Reference Types)',
        subtitle: 'V proměnné je jen adresa (odkaz), maže je Garbage Collector'
      }
    ],
    items: [
      {
        id: 'sh-int',
        label: 'int, double, bool, char',
        targetBucketId: 'stack',
        explanation: 'Základní primitivní typy jsou v C# hodnotové (Value Types) a leží přímo na zásobníku (Stack).'
      },
      {
        id: 'sh-struct',
        label: 'struct a enum (např. struct Bod)',
        targetBucketId: 'stack',
        explanation: 'Struktury (struct) a výčtové typy (enum) jsou v C# hodnotové typy – při b = a vznikne nezávislá kopie.'
      },
      {
        id: 'sh-class',
        label: 'class a interface (např. class Uzivatel)',
        targetBucketId: 'heap',
        explanation: 'Všechny třídy (class) jsou referenční typy – objekt žije na Haldě (Heap), proměnná drží jen adresu.'
      },
      {
        id: 'sh-array',
        label: 'Pole (např. int[] cisla)',
        targetBucketId: 'heap',
        explanation: 'I když je pole plné intů, samotné pole int[] je v C# vždy referenční typ uložený na Heapu!'
      },
      {
        id: 'sh-string',
        label: 'string (immutable referenční typ)',
        targetBucketId: 'heap',
        explanation: 'Chyták ke zkoušce: string je referenční typ (class) na Heapu, jen se chová jako hodnotový, protože je neměnný (immutable).'
      },
      {
        id: 'sh-copy-val',
        label: 'Při a = b vznikne plně nezávislá kopie dat',
        targetBucketId: 'stack',
        explanation: 'U hodnotových typů na Stacku přiřazení zkopíruje samotnou hodnotu.'
      },
      {
        id: 'sh-copy-ref',
        label: 'Při a = b obě proměnné ukazují na stejný objekt',
        targetBucketId: 'heap',
        explanation: 'U referenčních typů se zkopíruje pouze adresa odkazu, takže změna b.Jmeno změní i a.Jmeno.'
      },
      {
        id: 'sh-gc',
        label: 'Z paměti je maže automaticky Garbage Collector (GC)',
        targetBucketId: 'heap',
        explanation: 'Objekty na Haldě (Heap) uklízí Garbage Collector, když na ně už neukazuje žádná reference.'
      },
      {
        id: 'sh-scope',
        label: 'Zmizí okamžitě po skončení bloku { }, kde vznikly',
        targetBucketId: 'stack',
        explanation: 'Lokální hodnotové proměnné na Stacku se uvolní okamžitě při opuštění metody/bloku.'
      }
    ]
  },

  // ==========================================================
  // 3. SPOJOVAČKA: NÁVRHOVÝ VZOR <-> TYPICKÝ C# KÓD
  // ==========================================================
  {
    id: 'dd-match-patterns-code',
    type: 'matching',
    title: '3. Spojovačka: Poznej návrhový vzor podle C# kódu',
    description: 'Klikni na návrhový vzor vlevo a spoj ho s jeho typickou C# implementací vpravo.',
    pairs: [
      {
        id: 'mp-singleton',
        leftText: 'Singleton (Jedináček)',
        rightText: 'private Konstruktor() + public static Instance { get; }',
        explanation: 'Jedináček zakáže volání new zvenčí přes private konstruktor a nabízí statickou vlastnost Instance.'
      },
      {
        id: 'mp-adapter',
        leftText: 'Adapter (Adaptér)',
        rightText: 'Implementuje IPlatba a uvnitř volá cizí _payPal.SendPaymentInUsd()',
        explanation: 'Adaptér překládá volání z našeho rozhraní IPlatba na nekompatibilní rozhraní cizí třídy.'
      },
      {
        id: 'mp-proxy',
        leftText: 'Proxy (Zástupce)',
        rightText: 'Implementuje IDatabaze, kontroluje roli Admin a pak volá _skutecnaDb.Nacti()',
        explanation: 'Proxy má úplně stejné rozhraní jako skutečný objekt a hlídá přístup, kešuje nebo odkládá vytvoření.'
      },
      {
        id: 'mp-decorator',
        leftText: 'Decorator (Dekorátor)',
        rightText: 'Abstraktní obal : IKava držící protected IKava _kava (slupky cibule)',
        explanation: 'Dekorátor implementuje IKava a zároveň uvnitř drží IKava, takže lze objekty vrstvit do sebe.'
      },
      {
        id: 'mp-bridge',
        leftText: 'Bridge (Most)',
        rightText: 'abstract class Tvar obsahuje protected IBarva _barva (spojení 2 hierarchií)',
        explanation: 'Most nahrazuje kombinatorickou dědičnost (CervenyKruh) kompozicí mezi dvěma nezávislými stromy.'
      },
      {
        id: 'mp-flyweight',
        leftText: 'Flyweight (Muší váha)',
        rightText: 'Sdílený DruhStromu (10 MB) v Dictionary<string, Druh> + lehký Strom(X, Y)',
        explanation: 'Flyweight oddělí velký neměnný vnitřní stav od malého vnějšího stavu (souřadnic).'
      },
      {
        id: 'mp-command',
        leftText: 'Command (Příkaz)',
        rightText: 'Objekt akce implementující IPrikaz { void Execute(); void Undo(); }',
        explanation: 'Příkaz zabalí operaci do objektu, takže lze dělat historii příkazů a tlačítko Zpět (Undo).'
      },
      {
        id: 'mp-observer',
        leftText: 'Observer (Pozorovatel)',
        rightText: 'Subject drží List<IObserver> a ve foreach cyklu volá o.Update()',
        explanation: 'Pozorovatel automaticky notifikuje všechny přihlášené odběratele při změně stavu.'
      }
    ]
  },

  // ==========================================================
  // 4. SPOJOVAČKA: C# KLÍČOVÁ SLOVA & UML ŠIPKY
  // ==========================================================
  {
    id: 'dd-match-csharp-keywords',
    type: 'matching',
    title: '4. Spojovačka: Klíčová slova C# a UML šipky ke zkoušce',
    description: 'Spoj každé C# klíčové slovo nebo UML šipku vlevo s přesným významem vpravo.',
    pairs: [
      {
        id: 'mk-virtual',
        leftText: 'virtual (u metody předka)',
        rightText: 'Metoda má výchozí tělo, ale potomek ji MŮŽE přepsat přes override',
        explanation: 'V C# nelze běžnou metodu přepsat, dokud ji rodič neoznačí jako virtual nebo abstract.'
      },
      {
        id: 'mk-abstract',
        leftText: 'abstract (u metody předka)',
        rightText: 'Metoda nemá tělo { }, potomek ji MUSÍ přepsat přes override',
        explanation: 'Abstraktní metoda pouze předepisuje hlavičku v abstraktní třídě.'
      },
      {
        id: 'mk-new',
        leftText: 'new (u metody potomka)',
        rightText: 'Zastínění (method hiding) – zruší polymorfismus, volá se podle typu proměnné vlevo',
        explanation: 'Chyták u zkoušky: Rodic r = new Potomek(); při new zavolá metodu Rodiče, nikoliv Potomka!'
      },
      {
        id: 'mk-sealed',
        leftText: 'sealed override',
        rightText: 'Potomek metodu přepíše a ZAKÁŽE její další přepisování v dalších potomcích',
        explanation: 'Uzamkne virtuální metodu pro další generace dědičnosti.'
      },
      {
        id: 'mk-internal',
        leftText: 'internal (výchozí pro class)',
        rightText: 'Viditelné odkudkoliv, ale pouze uvnitř stejného projektu (.dll / .exe)',
        explanation: 'Pokud před class nenapíšeš public, je v C# automaticky internal.'
      },
      {
        id: 'mk-uml-impl',
        leftText: 'UML šipka:  - - - ▷ (přerušovaná s prázdnou šipkou)',
        rightText: 'Implementace rozhraní (public class Adapter : ITarget)',
        explanation: 'Přerušovaná čára s bílým trojúhelníkem značí realizaci kontraktu interface.'
      },
      {
        id: 'mk-uml-comp',
        leftText: 'UML šipka:  ◇────> (plná čára s kosočtvercem u paty)',
        rightText: 'Kompozice / Agregace (třída drží uvnitř privátní referenci na jiný objekt)',
        explanation: 'Základ téměř všech návrhových vzorů (Adapter, Proxy, Decorator, Strategy, Bridge).'
      }
    ]
  }
];
