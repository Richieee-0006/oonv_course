export type ScopeKey =
  | 'sameClass'
  | 'derivedSameAssembly'
  | 'nonDerivedSameAssembly'
  | 'derivedDiffAssembly'
  | 'nonDerivedDiffAssembly';

export interface ScopeDefinition {
  key: ScopeKey;
  label: string;
  shortLabel: string;
  description: string;
}

export const SCOPE_DEFINITIONS: ScopeDefinition[] = [
  {
    key: 'sameClass',
    label: 'Uvnitř stejné třídy',
    shortLabel: 'Táž třída',
    description: 'Metody, vlastnosti a kód deklarovaný ve stejném těle třídy nebo struktury.'
  },
  {
    key: 'derivedSameAssembly',
    label: 'Odvozená třída (stejné assembly)',
    shortLabel: 'Odvozená (stejné dll)',
    description: 'Třída dědící z dané třídy ve stejném zkompilovaném projektu (.dll / .exe).'
  },
  {
    key: 'nonDerivedSameAssembly',
    label: 'Neodvozená třída (stejné assembly)',
    shortLabel: 'Cizí třída (stejné dll)',
    description: 'Jakákoliv jiná třída v rámci stejného zkompilovaného projektu/assembly.'
  },
  {
    key: 'derivedDiffAssembly',
    label: 'Odvozená třída (jiné assembly)',
    shortLabel: 'Odvozená (cizí dll)',
    description: 'Třída v externí knihovně nebo jiném projektu, která dědí z naší třídy.'
  },
  {
    key: 'nonDerivedDiffAssembly',
    label: 'Neodvozená třída (jiné assembly)',
    shortLabel: 'Cizí třída (cizí dll)',
    description: 'Zcela externí kód mimo projekt bez dědického vztahu (veřejný konzument API).'
  }
];

export interface AccessModifierInfo {
  id: string;
  name: string;
  keyword: string;
  badgeColor: string;
  scopes: Record<ScopeKey, boolean>;
  summary: string;
  ruleExplanation: string;
  mnemonic: string;
  exampleCode: string;
  examWatchout: string;
}

export const ACCESS_MODIFIERS_DATA: AccessModifierInfo[] = [
  {
    id: 'public',
    name: 'Public',
    keyword: 'public',
    badgeColor: 'emerald',
    scopes: {
      sameClass: true,
      derivedSameAssembly: true,
      nonDerivedSameAssembly: true,
      derivedDiffAssembly: true,
      nonDerivedDiffAssembly: true
    },
    summary: 'Úplný přístup odkudkoliv bez jakéhokoliv omezení.',
    ruleExplanation: 'Prvek je dostupný pro veškerý kód ve stejném sestavení i pro jakékoliv jiné sestavení, které na něj odkazuje.',
    mnemonic: 'Otevřené dveře pro celý svět.',
    exampleCode: `public class Zamestnanec\n{\n    public string Jmeno { get; set; } // Přístupné odkudkoliv\n}`,
    examWatchout: 'Výchozí přístup pro členy rozhraní (interface). Nikdy neporušuj zapouzdření dáváním public členským polím (fieldům)!'
  },
  {
    id: 'protected-internal',
    name: 'Protected Internal',
    keyword: 'protected internal',
    badgeColor: 'sky',
    scopes: {
      sameClass: true,
      derivedSameAssembly: true,
      nonDerivedSameAssembly: true,
      derivedDiffAssembly: true,
      nonDerivedDiffAssembly: false
    },
    summary: 'Logické NEBO (OR): kdekoliv ve stejném assembly NEBO v odvozených třídách kdekoliv.',
    ruleExplanation: 'Prvek je přístupný z jakékoliv třídy ve stejném sestavení A ZÁROVEŇ ze všech odvozených tříd, a to i když jsou deklarovány v jiném sestavení.',
    mnemonic: 'OR (Sjednocení) = "Buď jsi v mém assembly, NEBO jsi můj potomek".',
    exampleCode: `public class BaseSestava\n{\n    // Přístupné kolegům v projektu i potomkům v cizím projektu\n    protected internal void NastavJadro() { }\n}`,
    examWatchout: 'Častý zkouškový chyták! Neplést s private protected! Protected internal je VOLNĚJŠÍ než protected i internal samostatně.'
  },
  {
    id: 'internal',
    name: 'Internal',
    keyword: 'internal',
    badgeColor: 'amber',
    scopes: {
      sameClass: true,
      derivedSameAssembly: true,
      nonDerivedSameAssembly: true,
      derivedDiffAssembly: false,
      nonDerivedDiffAssembly: false
    },
    summary: 'Přístup omezen pouze na aktuální sestavení (.dll nebo .exe).',
    ruleExplanation: 'Prvek je dostupný z jakéhokoliv kódu uvnitř téhož sestavení, ale je zcela skrytý pro externí projekty a balíčky.',
    mnemonic: 'Hranice projektu: co je uvnitř assembly, to vidí; co je za plotem, nevidí nic.',
    exampleCode: `internal class InterniPomocnik\n{\n    // Viditelné jen v tomto projektu (.dll)\n    internal static void Zvaliduj() { }\n}`,
    examWatchout: 'Výchozí (default) specifikátor pro třídy a rozhraní deklarované přímo v namespace (pokud neuvedeš nic, class Foo je internal).'
  },
  {
    id: 'protected',
    name: 'Protected',
    keyword: 'protected',
    badgeColor: 'indigo',
    scopes: {
      sameClass: true,
      derivedSameAssembly: true,
      nonDerivedSameAssembly: false,
      derivedDiffAssembly: true,
      nonDerivedDiffAssembly: false
    },
    summary: 'Pouze obsahující třída a její potomci (odvozené třídy) kdekoliv.',
    ruleExplanation: 'Prvek je přístupný v těle definující třídy a ve všech třídách, které z ní dědí — bez ohledu na to, zda jsou ve stejném nebo jiném assembly.',
    mnemonic: 'Rodinné stříbro: vidí jen rodič a děti (i odstěhované do jiného města/assembly).',
    exampleCode: `public class Rodic\n{\n    // Vidí jen Rodic a potomci (např. Potomek : Rodic)\n    protected int _citacStavu;\n}`,
    examWatchout: 'Neodvozená třída ve stejném assembly k němu NEMÁ přístup! Potomek k němu přistupuje pouze přes svůj zděděný kontext.'
  },
  {
    id: 'private-protected',
    name: 'Private Protected',
    keyword: 'private protected',
    badgeColor: 'purple',
    scopes: {
      sameClass: true,
      derivedSameAssembly: true,
      nonDerivedSameAssembly: false,
      derivedDiffAssembly: false,
      nonDerivedDiffAssembly: false
    },
    summary: 'Logické A (AND): pouze odvozené třídy, které JSOU ZÁROVEŇ ve stejném assembly.',
    ruleExplanation: 'Představeno v C# 7.2. Prvek je přístupný pouze v definující třídě a odvozených třídách, pokud jsou zkompilovány ve stejném sestavení.',
    mnemonic: 'AND (Průnik) = "Musíš být můj potomek A ZÁROVEŇ bydlet ve stejném domě (assembly)".',
    exampleCode: `public class ZakladniKomponenta\n{\n    // Potomek v jiném assembly k tomuto přístup NEMÁ!\n    private protected void InterniInicializace() { }\n}`,
    examWatchout: 'PŘÍSNĚJŠÍ než protected! Zabraňuje cizím knihovnám zasahovat do interních mechanismů dědičnosti vaší knihovny.'
  },
  {
    id: 'private',
    name: 'Private',
    keyword: 'private',
    badgeColor: 'rose',
    scopes: {
      sameClass: true,
      derivedSameAssembly: false,
      nonDerivedSameAssembly: false,
      derivedDiffAssembly: false,
      nonDerivedDiffAssembly: false
    },
    summary: 'Pouze uvnitř těla deklarující třídy nebo struktury.',
    ruleExplanation: 'Prvek je přísně zapouzdřen. Ani odvozená třída ani kód ve stejném assembly k němu nemá přímý přístup.',
    mnemonic: 'Osobní tajemství zamčené v trezoru dané třídy.',
    exampleCode: `public class BankovniUcet\n{\n    // Výchozí pro členské proměnné třídy\n    private decimal _zustatek;\n}`,
    examWatchout: 'Výchozí specifikátor pro členy tříd a struktur (proměnné, metody, vnořené typy), pokud není uveden žádný modifikátor.'
  }
];

export interface UmlArrowRelation {
  id: string;
  name: string;
  nameEn: string;
  symbol: string;
  svgType: 'inheritance' | 'realization' | 'composition' | 'aggregation' | 'association' | 'dependency';
  relationshipKind: string;
  couplingLevel: string;
  lifeCycleRule: string;
  description: string;
  csharpCode: string;
  quickTip: string;
}

export const UML_ARROWS_DATA: UmlArrowRelation[] = [
  {
    id: 'inheritance',
    name: 'Dědičnost / Generalizace',
    nameEn: 'Inheritance / Generalization',
    symbol: '────────▷',
    svgType: 'inheritance',
    relationshipKind: 'Je druhem (is-a)',
    couplingLevel: 'Nejsilnější (těsná vazba)',
    lifeCycleRule: 'Potomek sdílí kód a strukturu předka. V C# platí striktní jednoduchá dědičnost tříd.',
    description: 'Plná čára s nevyplněným trojúhelníkem směřujícím k bázové třídě. Potomek dědí stav i chování.',
    csharpCode: `// Plná čára s bílým trojúhelníkem směřujícím k Zamestnanec\npublic class Programator : Zamestnanec\n{\n    public Programator(string jmeno, int plat)\n        : base(jmeno, plat) { } // Povinné volání předka!\n}`,
    quickTip: 'U zkoušky: Hledej plnou čáru s bílým trojúhelníkem. V C# se píše za dvojtečku `: BaseClass`. Pozor na vtable u `override`!'
  },
  {
    id: 'realization',
    name: 'Realizace / Implementace rozhraní',
    nameEn: 'Realization / Interface Implementation',
    symbol: '- - - - ▷',
    svgType: 'realization',
    relationshipKind: 'Splňuje kontrakt (can-do)',
    couplingLevel: 'Volná (programování proti rozhraní)',
    lifeCycleRule: 'Rozhraní nedefinuje životní cyklus ani stav, pouze předepisuje veřejný protokol.',
    description: 'Čárkovaná čára s nevyplněným trojúhelníkem směřujícím k rozhraní. Třída implementuje metody rozhraní.',
    csharpCode: `// Čárkovaná čára s bílým trojúhelníkem směřujícím k IPlatebniMetoda\npublic class PlatebniKarta : IPlatebniMetoda\n{\n    public void Zaplat(decimal castka)\n    {\n        Console.WriteLine($"Platba kartou: {castka} Kč");\n    }\n}`,
    quickTip: 'Zlaté pravidlo GoF: "Programuj proti rozhraní, ne proti implementaci." C# umožňuje implementovat libovolný počet rozhraní.'
  },
  {
    id: 'composition',
    name: 'Kompozice (Silné vlastnictví)',
    nameEn: 'Composition (Strong Ownership)',
    symbol: '◆───────>',
    svgType: 'composition',
    relationshipKind: 'Výlučně vlastní (part-of / strong)',
    couplingLevel: 'Silná strukturální vazba',
    lifeCycleRule: 'Životní cyklus části je plně svázán s celkem. Zánikem celku zaniká i vnitřní objekt.',
    description: 'Plná čára s černým (vyplněným) kosočtvercem na straně celku. Objekt uvnitř je obvykle instanciován přímo v konstruktoru.',
    csharpCode: `// Plný kosočtverec u Auto, šipka směřuje k Motor\npublic class Auto\n{\n    // Motor vzniká s autem a zaniká s autem\n    private readonly Motor _motor = new Motor();\n}`,
    quickTip: 'GoF pravidlo #2: "Upřednostňuj kompozici před dědičností." Pokud část nemůže smysluplně žít bez celku, je to kompozice (černý kosočtverec).'
  },
  {
    id: 'aggregation',
    name: 'Agregace (Volné sdílení)',
    nameEn: 'Aggregation (Shared / Weak Ownership)',
    symbol: '◇───────>',
    svgType: 'aggregation',
    relationshipKind: 'Skládá se z (has-a / weak)',
    couplingLevel: 'Střední (vyměnitelná komponenta)',
    lifeCycleRule: 'Objekt existuje nezávisle na celku. Bývá předán zvenčí (Dependency Injection) a po zániku celku existuje dál.',
    description: 'Plná čára s prázdným (bílým) kosočtvercem na straně celku. Celek objekt pouze eviduje nebo používá.',
    csharpCode: `// Prázdný kosočtverec u NakupniKosik, šipka směřuje k IPlatebniBrana\npublic class NakupniKosik\n{\n    private readonly IPlatebniBrana _brana;\n    // Brána existovala před košíkem a přežije jeho zánik\n    public NakupniKosik(IPlatebniBrana brana) => _brana = brana;\n}`,
    quickTip: 'Základ pro vzory Strategy, Decorator a Adapter. Prázdný kosočtverec = předává se zvenku parametrem konstruktoru.'
  },
  {
    id: 'association',
    name: 'Asociace (Strukturální reference)',
    nameEn: 'Association (Structural Reference)',
    symbol: '───────>',
    svgType: 'association',
    relationshipKind: 'Zná / odkazuje (knows-a)',
    couplingLevel: 'Středně volná',
    lifeCycleRule: 'Nezávislé objekty. Jeden objekt drží referenci na druhý jako členskou proměnnou (field nebo property).',
    description: 'Plná čára s jednoduchou otevřenou šipkou. Vyjadřuje trvalejší navigační vztah mezi objekty bez vlastnického vztahu.',
    csharpCode: `// Plná čára s otevřenou šipkou směřující k Pacient\npublic class Lekar\n{\n    // Lékař má referenci na pacienta, ale nevlastní ho\n    public Pacient? AktualniPacient { get; set; }\n}`,
    quickTip: 'Rozdíl oproti závislosti: asociace je instanční proměnná (trvalý odkaz), kdežto závislost je jen parametr metody.'
  },
  {
    id: 'dependency',
    name: 'Závislost (Dočasné použití)',
    nameEn: 'Dependency (Temporary Usage)',
    symbol: '- - - - >',
    svgType: 'dependency',
    relationshipKind: 'Dočasně používá (uses-a)',
    couplingLevel: 'Velmi volná',
    lifeCycleRule: 'Objekt je použit pouze po dobu vykonávání jedné metody nebo jako lokální proměnná.',
    description: 'Čárkovaná čára s jednoduchou otevřenou šipkou. Třída A potřebuje třídu B ke splnění konkrétní operace.',
    csharpCode: `// Čárkovaná čára s otevřenou šipkou směřující k Tiskarna\npublic class SpravceDokumentu\n{\n    // Pouze parametr metody, není uložen jako stav\n    public void Vytiskni(Tiskarna tiskarna)\n    {\n        tiskarna.Tisk("Dokument.pdf");\n    }\n}`,
    quickTip: 'Nejslabší vazba ze všech. Změna signatury třídy B může ovlivnit implementaci metody ve třídě A.'
  }
];

export interface PatternQuickSummary {
  id: string;
  name: string;
  czechName: string;
  category: 'creational' | 'structural' | 'behavioral';
  categoryCzech: string;
  intent: string;
  oneLinerCsharp: string;
  gofRule: string;
  week: string;
  examKey: string;
}

export const PATTERNS_QUICK_SUMMARY: PatternQuickSummary[] = [
  // Creational
  {
    id: 'singleton',
    name: 'Singleton',
    czechName: 'Jedináček',
    category: 'creational',
    categoryCzech: 'Vytvářející',
    intent: 'Zaručuje právě jednu instanci třídy v celé aplikaci a poskytuje globální přístup.',
    oneLinerCsharp: 'public static Lazy<Singleton> Instance { get; } // private Singleton()',
    gofRule: 'Zapouzdři instanciaci do statické vlastnosti a uzamkni konstruktor jako private.',
    week: 'Týdny 6–7',
    examKey: 'Privátní konstruktor zabrání "new", lazy inicializace přes statickou vlastnost.'
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    czechName: 'Tovární metoda',
    category: 'creational',
    categoryCzech: 'Vytvářející',
    intent: 'Definuje rozhraní pro tvorbu objektu, ale deleguje volbu konkrétní třídy na potomky.',
    oneLinerCsharp: 'public abstract IProduct CreateProduct(); // implementují potomci Creator',
    gofRule: 'Nech potomky rozhodnout, který konkrétní objekt se má vytvořit.',
    week: 'Týdny 6–7',
    examKey: 'Abstraktní/virtuální metoda v bázové třídě vracející rozhraní produktu.'
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    czechName: 'Abstraktní továrna',
    category: 'creational',
    categoryCzech: 'Vytvářející',
    intent: 'Poskytuje rozhraní pro vytváření celých rodin souvisejících objektů bez vazby na konkrétní třídy.',
    oneLinerCsharp: 'interface IFactory { IButton CreateBtn(); IWindow CreateWin(); }',
    gofRule: 'Vytvářej kompatibilní rodiny produktů (např. DarkTheme vs LightTheme) jednotně.',
    week: 'Týdny 6–7',
    examKey: 'Továrna továren: rozhraní obsahuje více továrních metod pro ucelenou sadu komponent.'
  },
  {
    id: 'builder',
    name: 'Builder',
    czechName: 'Stavitel',
    category: 'creational',
    categoryCzech: 'Vytvářející',
    intent: 'Odděluje konstrukci složitého objektu od jeho reprezentace; umožňuje řetězenou stavbu (Fluent API).',
    oneLinerCsharp: 'builder.SetCpu("i9").SetRam(64).Build(); // fluent methods return this',
    gofRule: 'Zabraň "telescopic konstruktorům" s deseti parametry a umožni krok za krokem tvorbu.',
    week: 'Týdny 6–7',
    examKey: 'Metody vrací `this` pro řetězení a finální `Build()` vrátí hotový neměnný objekt.'
  },

  // Structural
  {
    id: 'adapter',
    name: 'Adapter',
    czechName: 'Adaptér (Wrapper)',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Převádí rozhraní třídy na jiné rozhraní požadované klientem; propojuje nekompatibilní třídy.',
    oneLinerCsharp: 'class Adapter : ITarget { private readonly Adaptee _a; public void Request() => _a.Specific(); }',
    gofRule: 'Umožni spolupráci třídám s nekompatibilními rozhraními bez úpravy jejich zdrojového kódu.',
    week: 'Týdny 8–9',
    examKey: 'Objektový adaptér skládá Adaptee (kompozice), Třídní adaptér dědí z Adaptee a ITarget.'
  },
  {
    id: 'proxy',
    name: 'Proxy',
    czechName: 'Zástupce',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Poskytuje náhradní zástupný objekt pro řízení přístupu, líné načtení, cachování či ochranu.',
    oneLinerCsharp: 'class Proxy : IService { private Service? _real; public void Op() { /* check/lazy */ _real.Op(); } }',
    gofRule: 'Měj stejné rozhraní jako reálný objekt, ale vlož před něj vrstvu řízení přístupu.',
    week: 'Týdny 8–9',
    examKey: 'Virtuální (líná inicializace), Ochranná (oprávnění) nebo Cachovací proxy se stejným rozhraním.'
  },
  {
    id: 'decorator',
    name: 'Decorator',
    czechName: 'Dekorátor',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Dynamicky přidává objektu nové schopnosti zabalením do obalových tříd (cibulový model).',
    oneLinerCsharp: 'class Decorator : IComponent { protected IComponent _wrapee; /* + nová funkcionalita */ }',
    gofRule: 'Přednost skládání objektů před statickou dědičností při rozšiřování funkčnosti za běhu.',
    week: 'Týdny 8–9',
    examKey: 'Implementuje stejné rozhraní IComponent A ZÁROVEŇ obsahuje referenci na vnitřní IComponent.'
  },
  {
    id: 'bridge',
    name: 'Bridge',
    czechName: 'Most',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Odděluje abstrakci od její implementace, aby se obě hierarchie mohly vyvíjet nezávisle.',
    oneLinerCsharp: 'abstract class RemoteControl { protected IDevice _device; } // ortogonální osy',
    gofRule: 'Zabraň kartézskému součinu tříd rozštěpením do dvou samostatných hierarchií.',
    week: 'Týdny 8–9',
    examKey: 'Most spojuje dvě nezávislé osy (např. Dálkový ovladač a Zařízení: TV vs Rádio).'
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    czechName: 'Muší váha',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Šetří RAM sdílením společného vnitřního stavu (intrinsic) mezi velkým množstvím malých objektů.',
    oneLinerCsharp: 'class TreeType { /* intrinsic shared data */ } // extrinsic (souřadnice x,y) předán zvenčí',
    gofRule: 'Odděl vnitřní neměnný sdílený stav od vnějšího kontextového stavu.',
    week: 'Týdny 8–9',
    examKey: 'Intrinsic = společná sdílená data v RAM (1x), Extrinsic = kontextové souřadnice/parametry.'
  },
  {
    id: 'facade',
    name: 'Facade',
    czechName: 'Fasáda',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Poskytuje zjednodušené jednotné rozhraní k celé složité knihovně nebo subsystému.',
    oneLinerCsharp: 'class ConverterFacade { public void Convert(string f) { _sub1.Init(); _sub2.Process(); } }',
    gofRule: 'Zpřístupni komplexní podsystém přes jednu jednoduchou fasádní třídu pro 90 % běžných scénářů.',
    week: 'Týdny 8–9',
    examKey: 'Fasáda nebalí jeden objekt (jako Adapter), ale zjednodušuje volání celé sítě objektů.'
  },
  {
    id: 'composite',
    name: 'Composite',
    czechName: 'Kompozit',
    category: 'structural',
    categoryCzech: 'Strukturální',
    intent: 'Skládá objekty do stromových struktur; klient zachází s jednotlivými listy i celými větvemi stejně.',
    oneLinerCsharp: 'class Composite : IComponent { private List<IComponent> _children; }',
    gofRule: 'Umožni klientům ignorovat rozdíl mezi složenými objekty a jednotlivými primitivními prvky.',
    week: 'Týdny 8–9',
    examKey: 'Stromová struktura: List (soubor) i Uzel (složka) implementují stejné rozhraní IComponent.'
  },

  // Behavioral
  {
    id: 'strategy',
    name: 'Strategy',
    czechName: 'Strategie',
    category: 'behavioral',
    categoryCzech: 'Chování',
    intent: 'Definuje rodinu algoritmů, zapouzdřuje je do samostatných tříd a činí je za běhu záměnnými.',
    oneLinerCsharp: 'class Context { private IPaymentStrategy _s; public void SetStrategy(IPaymentStrategy s) => _s = s; }',
    gofRule: 'Nahraď rozvětvené přepínače if/switch a dědičnost kompozicí vyměnitelného algoritmu.',
    week: 'Týdny 10–11',
    examKey: 'Kontext obsahuje referenci na IStrategy a deleguje na ni vykonání algoritmu.'
  },
  {
    id: 'command',
    name: 'Command',
    czechName: 'Příkaz',
    category: 'behavioral',
    categoryCzech: 'Chování',
    intent: 'Zapouzdřuje požadavek jako objekt, což umožňuje parametrizaci klientů, frontování a operace Undo/Redo.',
    oneLinerCsharp: 'interface ICommand { void Execute(); void Undo(); }',
    gofRule: 'Odděl odesílatele požadavku (Invoker) od jeho příjemce a vykonavatele (Receiver).',
    week: 'Týdny 10–11',
    examKey: 'Objekt příkazu si pamatuje přijímače i parametry; obsahuje Execute() i Undo() pro návrat zpět.'
  },
  {
    id: 'memento',
    name: 'Memento',
    czechName: 'Upomínka',
    category: 'behavioral',
    categoryCzech: 'Chování',
    intent: 'Zachycuje a ukládá vnitřní stav objektu bez porušení zapouzdření, aby jej bylo možné později obnovit.',
    oneLinerCsharp: 'class Editor { public Memento Save(); public void Restore(Memento m); }',
    gofRule: 'Ulož snímek stavu objektu (snapshot) tak, aby do něj cizí třídy nemohly zasahovat.',
    week: 'Týdny 10–11',
    examKey: 'Originator vytváří a čte Memento; Caretaker (správce historie) Memento pouze drží, ale nečte.'
  },
  {
    id: 'observer',
    name: 'Observer',
    czechName: 'Pozorovatel (Pub/Sub)',
    category: 'behavioral',
    categoryCzech: 'Chování',
    intent: 'Definuje závislost 1:N; při změně stavu subjektu jsou všichni registrovaní pozorovatelé automaticky upozorněni.',
    oneLinerCsharp: 'interface IObserver { void Update(T data); } // Subject drží List<IObserver> a volá Notify()',
    gofRule: 'Volná vazba mezi subjektem a posluchači — subjekt neví, kdo přesně naslouchá.',
    week: 'Týdny 10–11',
    examKey: 'Subject udržuje kolekci `List<IObserver>`, metody `Attach`, `Detach` a vnitřní smyčku `Notify()`.'
  },
  {
    id: 'state',
    name: 'State',
    czechName: 'Stav',
    category: 'behavioral',
    categoryCzech: 'Chování',
    intent: 'Umožňuje objektu měnit své chování při změně vnitřního stavu; tváří se, jako by změnil svou třídu.',
    oneLinerCsharp: 'interface IState { void Handle(OrderContext ctx); } // ctx.TransitionTo(new ShippedState())',
    gofRule: 'Odstraň masivní switch(stav) přesunem stavově závislého chování do samostatných tříd stavů.',
    week: 'Týdny 10–11',
    examKey: 'Podobné Strategy, ale stavy znají kontext a samy iniciují přechod do následujícího stavu.'
  }
];

export interface ExamTrapItem {
  id: string;
  number: number;
  title: string;
  concept: string;
  severity: 'Vysoká' | 'Kritická';
  question: string;
  code: string;
  output: string;
  whyItHappens: string;
  howToSolve: string;
  examRule: string;
}

export const EXAM_TRAPS_DATA: ExamTrapItem[] = [
  {
    id: 'vtable-vs-static-bind',
    number: 1,
    title: 'V-Table (override) vs. Statická vazba (new zastínění)',
    concept: 'Polymorfismus & Volání virtuálních metod',
    severity: 'Kritická',
    question: 'Co vypíše kód, pokud proměnná bázového typu ukazuje na instanci potomka a metoda je deklarována s "new" místo "override"?',
    code: `public class Rodic\n{\n    public virtual void Pozdrav() => Console.WriteLine("Ahoj z Rodice");\n}\n\npublic class Potomek : Rodic\n{\n    // POZOR: Použito klíčové slovo 'new' (zastínění), nikoliv 'override'!\n    public new void Pozdrav() => Console.WriteLine("Ahoj z Potomka");\n}\n\n// Kód u zkoušky:\nRodic r = new Potomek();\nr.Pozdrav(); // <-- CO SE ZDE VYPÍŠe?`,
    output: 'Ahoj z Rodice',
    whyItHappens: 'Klíčové slovo `new` nevkládá novou metodu do tabulky virtuálních metod (vtable) původního předka! Vytváří zcela novou, nezávislou metodu se stejným jménem. Protože proměnná `r` je typu `Rodic`, kompilátor použije statickou vazbu na základě typu proměnné (levá strana) a zavolá metodu `Rodic.Pozdrav()`.',
    howToSolve: 'Pokud chceš dynamický polymorfismus řízený skutečným objektem na haldě (pozdní vazbu přes vtable), MUSÍŠ v potomku použít klíčové slovo `override`.',
    examRule: 'Pravidlo zkoušky: `override` volá metodu podle objektu v RAM (pravá strana). `new` volá metodu podle typu proměnné (levá strana).'
  },
  {
    id: 'value-vs-ref-assignment',
    number: 2,
    title: 'Value Type (struct) vs. Reference Type (class) při přiřazení `b = a`',
    concept: 'Paměťový model: Zásobník (Stack) vs. Halda (Heap)',
    severity: 'Kritická',
    question: 'Změní se hodnota v proměnné `a`, pokud po přiřazení `b = a` změníme vlastnost v `b` u struktury vs. u třídy?',
    code: `public struct BodStruct { public int X; }\npublic class BodClass  { public int X; }\n\n// 1. STRUKTURA (Value type):\nBodStruct s1 = new BodStruct { X = 10 };\nBodStruct s2 = s1; // Zkopíruje celou hodnotu bit po bitu na zásobníku!\ns2.X = 99;\nConsole.WriteLine($"Struct s1.X: {s1.X}");\n\n// 2. TŘÍDA (Reference type):\nBodClass c1 = new BodClass { X = 10 };\nBodClass c2 = c1; // Zkopíruje POUZE 64bitovou adresu (odkaz na stejný objekt na haldě)!\nc2.X = 99;\nConsole.WriteLine($"Class c1.X: {c1.X}");`,
    output: `Struct s1.X: 10\nClass c1.X: 99`,
    whyItHappens: 'U struktur (`struct`) je hodnota uložena přímo v proměnné na zásobníku. Přiřazení `s2 = s1` vytvoří nezávislý duplikát. U tříd (`class`) proměnná obsahuje pouhý pointer (referenci) na objekt v haldě. Přiřazení `c2 = c1` zkopíruje pouze referenci — obě proměnné ukazují na totéž místo v paměti RAM.',
    howToSolve: 'Při práci se strukturami pamatuj, že jakékoliv předání hodnotou nebo přiřazení vytváří kopii. Chceš-li sdílený mutabilní stav, použij `class` (nebo předávej struct s klíčovým slovem `ref`).',
    examRule: 'Pravidlo zkoušky: Struct přiřazením klonuje hodnotu (`s1` zůstává nezměněn). Class přiřazením sdílí objekt v haldě (`c1` je modifikován).'
  },
  {
    id: 'string-immutability',
    number: 3,
    title: 'Immutabilita řetězců (String Immutability) a paměťová alokace',
    concept: 'Řetězce jako neměnné objekty na haldě',
    severity: 'Vysoká',
    question: 'Proč volání metody `s.ToUpper()` nezmění hodnotu v proměnné `s` a co se stane při zřetězení v cyklu?',
    code: `string zprava = "ahoj";\nzprava.ToUpper(); // <-- ZKOUŠKOVÝ CHYTÁK: Není přiřazeno zpět!\nConsole.WriteLine($"Výsledek: {zprava}");\n\n// V cyklu:\nstring vysledek = "";\nfor (int i = 0; i < 3; i++)\n{\n    vysledek += i; // Vytváří novou alokaci v RAM při každé iteraci!\n}\nConsole.WriteLine($"Cyklický string: {vysledek}");`,
    output: `Výsledek: ahoj\nCyklický string: 012`,
    whyItHappens: 'Typ `string` je v C# referenční typ, ale je striktně NEMĚNNÝ (immutable). Žádná metoda třídy `string` nemění stávající objekt v paměti — vždy alokuje a vrátí NOVÝ objekt na haldě. Pokud návratovou hodnotu nepřiřadíš zpět (`zprava = zprava.ToUpper()`), původní proměnná zůstane netknutá.',
    howToSolve: 'Vždy zachyť návratovou hodnotu metod řetězců. Pro intenzivní spojování řetězců v cyklech vždy použij `System.Text.StringBuilder`, který alokuje vnitřní buffer a nevytváří zbytečné instance pro garbage collector.',
    examRule: 'Pravidlo zkoušky: `string` metody nikdy nemutují původní instanci. Výsledek se bez nového přiřazení zahodí!'
  },
  {
    id: 'struct-copy-and-boxing',
    number: 4,
    title: 'Kopírování struktur a skrytý Boxing při přetypování na rozhraní',
    concept: 'Boxing / Unboxing & mutace hodnotových typů',
    severity: 'Kritická',
    question: 'Proč volání mutující metody rozhraní na zabalené (boxed) struktuře nezmění původní proměnnou struktury?',
    code: `public interface IPocitadlo\n{\n    void Inkrementuj();\n}\n\npublic struct Citac : IPocitadlo\n{\n    public int Hodnota { get; private set; }\n    public void Inkrementuj() => Hodnota++;\n}\n\n// Zkouškový kód:\nCitac c = new Citac();\nc.Inkrementuj(); // Hodnota je 1\n\n// Pozor: Přetypování struktury na interface způsobí BOXING na haldu!\n((IPocitadlo)c).Inkrementuj();\n\nConsole.WriteLine($"Skutečná hodnota c: {c.Hodnota}");`,
    output: 'Skutečná hodnota c: 1',
    whyItHappens: 'Rozhraní (`interface`) je referenční typ. Když přetypuješ hodnotový typ (`struct`) na rozhraní `IPocitadlo`, runtime provede tzv. BOXING: zabalí data struktury do nového objektu alokovaného na haldě. Metoda `Inkrementuj()` se provede na tomto dočasném objektu na haldě, zatímco původní proměnná `c` na zásobníku zůstane 1.',
    howToSolve: 'Nikdy nevytvářej mutabilní struktury (struktury by měly být deklarovány jako `readonly struct`). Pokud struktura implementuje rozhraní, nevolej mutující metody přes interface cast.',
    examRule: 'Pravidlo zkoušky: Struct -> Interface = BOXING (kopie na haldu). Jakákoliv mutace proběhne na dočasném objektu a zahodí se!'
  },
  {
    id: 'is-vs-as-cast',
    number: 5,
    title: 'Přetypování: Přímé `(Typ)` vs. bezpečné `as` vs. Pattern Matching `is`',
    concept: 'Typový systém, Upcasting, Downcasting a InvalidCastException',
    severity: 'Vysoká',
    question: 'Jaký je rozdíl mezi přímým přetypováním `(Pes)z`, operátorem `z as Pes` a moderním `if (z is Pes p)`?',
    code: `object textObj = "Tohle je text";\n\n// 1. Přímé přetypování (vyhodí výjimku, pokud typ nesouhlasí):\ntry\n{\n    int cislo = (int)textObj; // BUM! InvalidCastException za běhu\n}\ncatch (InvalidCastException)\n{\n    Console.WriteLine("Přímý cast selhal s InvalidCastException.");\n}\n\n// 2. Operátor 'as' (funguje POUZE s referenčními a nullable typy):\nstring? s = textObj as string; // Úspěch -> "Tohle je text"\n// int? x = textObj as int;    // Pozor: pro value type nutno explicitně int?\n\n// 3. Doporučený moderní způsob (Pattern matching 'is'):\nif (textObj is string platnyText)\n{\n    Console.WriteLine($"Ověřeno a bezpečně přetypováno: {platnyText.Length} znaků");\n}`,
    output: `Přímý cast selhal s InvalidCastException.\nOvěřeno a bezpečně přetypováno: 14 znaků`,
    whyItHappens: 'Přímý cast `(Typ)` předpokládá jistotu vývojáře — pokud se splete, .NET vygeneruje `InvalidCastException`. Operátor `as` se pokusí o downcast a při neúspěchu vrátí `null` (proto nemůže fungovat s běžným `int`, leda s `int?`). Konstrukce `is` s deklarací proměnné spojuje test typu i bezpečné přiřazení do jednoho kroku.',
    howToSolve: 'U zkoušky i v praxi preferuj `if (obj is CilovyTyp cil) { /* práce s cil */ }`. Eliminuje riziko výjimky i nutnost kontroly na `null`.',
    examRule: 'Pravidlo zkoušky: `(Typ)` vyhazuje výjimku, `as` vrací `null` (jen pro reference/nullable), `is Typ x` je idiomatický bezpečný cast.'
  }
];
