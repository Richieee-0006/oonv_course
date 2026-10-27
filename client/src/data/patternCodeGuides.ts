export interface PatternCodeGuide {
  whenToUse: string[];
  whenNotToUse: string;
  codeAnatomy: {
    step: string;
    codeLine: string;
    whyItWorks: string;
  }[];
}

export const patternCodeGuides: Record<string, PatternCodeGuide> = {
  singleton: {
    whenToUse: [
      'Když v celém programu smí existovat přesně 1 sdílená instance (konfigurace, logger, správce spojení s DB).',
      'Když potřebuješ k této jediné instanci globální přístupový bod odkudkoliv z kódu.'
    ],
    whenNotToUse: 'Nevhodný, pokud potřebuješ v testech podstrčit mock objekt nebo když třída drží měnitelný stav, který si různé části programu nečekaně přepisují.',
    codeAnatomy: [
      {
        step: '1. Privátní statické pole',
        codeLine: 'private static KonfiguraceSingleton? _instance;',
        whyItWorks: 'Patří samotné třídě (static), nikoliv objektu – drží v RAM odkaz na jedinou vytvořenou instanci.'
      },
      {
        step: '2. Privátní konstruktor (Zkouškové jádro!)',
        codeLine: 'private KonfiguraceSingleton() { }',
        whyItWorks: 'Zakáže kompilátoru volání new KonfiguraceSingleton() zvenčí. Bez private konstruktoru by šlo vytvořit více instancí.'
      },
      {
        step: '3. Statická vlastnost Instance (Lazy init)',
        codeLine: 'public static KonfiguraceSingleton Instance { get { if (_instance == null) _instance = new ...; return _instance; } }',
        whyItWorks: 'Při prvním zavolání instanci vytvoří a při každém dalším už vrací ten samý objekt z Heapu.'
      }
    ]
  },

  'factory-method': {
    whenToUse: [
      'Když dopředu nevíš, jaký konkrétní typ objektu budeš vytvářet, a chceš rozhodnutí nechat na podtřídách.',
      'Když máš společnou logiku (např. SpustVlnu()), která má pracovat s obecným rozhraním (INepritel) bez lepení new Kostlivec() přímo do ní.'
    ],
    whenNotToUse: 'Zbytečný, pokud máš jen jeden typ produktu a nikdy se nebude měnit způsob jeho vytváření.',
    codeAnatomy: [
      {
        step: '1. Společné rozhraní produktu',
        codeLine: 'public interface INepritel { void Zautoc(); }',
        whyItWorks: 'Tvůrce díky tomu nemusí znát konkrétní třídy (Kostlivec/Zombie), volá jen metodu ze smlouvy.'
      },
      {
        step: '2. Abstraktní tvůrce s tovární metodou',
        codeLine: 'public abstract INepritel VytvorNepritele();',
        whyItWorks: 'Předek v metodě SpustVlnu() zavolá VytvorNepritele(), ale samotné "new" odloží do potomků.'
      },
      {
        step: '3. Konkrétní tvůrce přepisující tovární metodu',
        codeLine: 'public override INepritel VytvorNepritele() => new Kostlivec();',
        whyItWorks: 'Přes polymorfismus (override / vtable) se za běhu vytvoří správný produkt podle toho, jakého tvůrce jsi zvolil.'
      }
    ]
  },

  'abstract-factory': {
    whenToUse: [
      'Když tvůj kód musí vytvářet celé RODINY souvisejících produktů, které k sobě musí ladit (např. Moderní židle + Moderní stůl vs. Retro židle + Retro stůl).',
      'Když chceš zabránit tomu, aby někdo omylem smíchal nekompatibilní produkty z různých rodin.'
    ],
    whenNotToUse: 'Pokud vyrábíš jen jeden samostatný objekt (pak stačí Factory Method) nebo se rodiny produktů nijak neliší.',
    codeAnatomy: [
      {
        step: '1. Rozhraní pro každý typ produktu v rodině',
        codeLine: 'public interface IZidle { ... }   public interface IStul { ... }',
        whyItWorks: 'Definuje kontrakty pro jednotlivé části nábytku nezávisle na stylu (Moderní / Retro).'
      },
      {
        step: '2. Rozhraní abstraktní továrny (více továrních metod)',
        codeLine: 'public interface INabytekFactory { IZidle VytvorZidli(); IStul VytvorStul(); }',
        whyItWorks: 'Na rozdíl od Factory Method (1 metoda) má Abstract Factory sadu metod pro celou rodinu produktů.'
      },
      {
        step: '3. Konkrétní továrna pro konkrétní rodinu',
        codeLine: 'public class ModerniNabytekFactory : INabytekFactory',
        whyItWorks: 'Zaručuje, že všechna volání VytvorZidli() i VytvorStul() vrátí produkty ze stejné rodiny (Moderní).'
      }
    ]
  },

  builder: {
    whenToUse: [
      'Když skládáš složitý objekt s mnoha volitelnými částmi a chceš se vyhnout tzv. teleskopickému konstruktoru (new Dum(true, false, null, 4, ...)).',
      'Když chceš stejným stavebním postupem vytvořit různé reprezentace objektu (např. Herní PC vs. Kancelářské PC).'
    ],
    whenNotToUse: 'Pro jednoduché objekty s 2–3 povinnými parametry, kde stačí obyčejný konstruktor.',
    codeAnatomy: [
      {
        step: '1. Rozhraní stavitele s kroky stavby',
        codeLine: 'public interface IPocitacBuilder { IPocitacBuilder NastavCPU(string cpu); ... Pocitac Build(); }',
        whyItWorks: 'Rozdělí konstrukci složitého objektu do přehledných samostatných metod místo obřího konstruktoru.'
      },
      {
        step: '2. Fluent zápis (vracení this)',
        codeLine: 'public IPocitacBuilder NastavCPU(string cpu) { _pc.CPU = cpu; return this; }',
        whyItWorks: 'Vracení this umožňuje řetězit volání za sebou: builder.NastavCPU(...).NastavGPU(...).Build().'
      },
      {
        step: '3. Finální metoda Build()',
        codeLine: 'public Pocitac Build() => _pc;',
        whyItWorks: 'Teprve na konci stavby odevzdá hotový a plně nakonfigurovaný objekt klientovi.'
      }
    ]
  },

  adapter: {
    whenToUse: [
      'Když máš hotovou cizí nebo starou třídu (Adaptee, např. PayPalService / CiziCryptoApi), kterou nemůžeš přepsat, ale má JINÉ názvy metod nebo typy parametrů, než očekává tvůj program.',
      'Funguje jako redukce do zásuvky – přeloží volání tvého rozhraní na volání cizí třídy.'
    ],
    whenNotToUse: 'Pokud můžeš cizí třídu přímo upravit nebo pokud už má stejné rozhraní (pak jde o Proxy nebo Decorator).',
    codeAnatomy: [
      {
        step: '1. Cílové rozhraní (Target), které tvůj kód vyžaduje',
        codeLine: 'public interface IPlatba { void ZaplatKc(int castkaKc); }',
        whyItWorks: 'Zbytek tvého e-shopu volá výhradně IPlatba.ZaplatKc() a nechce vědět nic o dolarech nebo bitcoinech.'
      },
      {
        step: '2. Adaptér implementuje Target a drží Adaptee (Kompozice)',
        codeLine: 'public class PayPalAdapter : IPlatba { private readonly PayPalService _payPal; ... }',
        whyItWorks: 'Navenek se tváří jako IPlatba (: IPlatba), ale uvnitř má uložený odkaz na nekompatibilní PayPalService.'
      },
      {
        step: '3. Překlad dat a provolání cizí metody',
        codeLine: 'public void ZaplatKc(int kc) { double usd = kc / 23.5; _payPal.SendPaymentInUsd(usd); }',
        whyItWorks: 'Uvnitř metody z rozhraní IPlatba provede konverzi parametrů a zavolá jinak pojmenovanou metodu na _payPal.'
      }
    ]
  },

  proxy: {
    whenToUse: [
      'Když potřebuješ před skutečný objekt postavit „vrátného“ se STEJNÝM rozhraním.',
      'Pro kontrolu oprávnění (Protection Proxy), líné vytvoření drahého objektu až při prvním dotazu (Virtual/Lazy Proxy), kešování výsledků (Caching Proxy) nebo logování.'
    ],
    whenNotToUse: 'Pokud potřebuješ změnit nekompatibilní rozhraní (použij Adapter) nebo dynamicky vrstvit nové funkce za běhu (použij Decorator).',
    codeAnatomy: [
      {
        step: '1. Společné rozhraní pro Reálný objekt i Proxy',
        codeLine: 'public interface IDatabaze { string NactiTajnaData(); }',
        whyItWorks: 'Klient pracuje s typem IDatabaze, takže vůbec nepozná, že místo SkutecnaDatabaze mluví s DatabazeProxy.'
      },
      {
        step: '2. Proxy implementuje stejné rozhraní a drží reálný objekt',
        codeLine: 'public class DatabazeProxy : IDatabaze { private SkutecnaDatabaze? _skutecnaDb; ... }',
        whyItWorks: 'Díky kompozici má Proxy plnou kontrolu nad tím, ZDA a KDY skutečnou databázi vytvoří a zavolá.'
      },
      {
        step: '3. Kontrola přístupu / Lazy init / Cache před delegováním',
        codeLine: 'if (_role != "Admin") return "Odepřeno"; _skutecnaDb ??= new SkutecnaDatabaze(); return _skutecnaDb.NactiTajnaData();',
        whyItWorks: 'Než předá práci skutečnému objektu, zkontroluje podmínky nebo vrátí data z mezipaměti.'
      }
    ]
  },

  decorator: {
    whenToUse: [
      'Když chceš objektu dynamicky za běhu přidávat nové chování (jako slupky cibule: káva + mléko + karamel, nebo zbraň + oheň + jed) bez vytváření desítek podtříd.',
      'Když potřebuješ chování libovolně kombinovat a vrstvit do sebe.'
    ],
    whenNotToUse: 'Pokud stačí přidat jednu pevnou vlastnost nebo potřebuješ jen omezit přístup k objektu (pak stačí Proxy).',
    codeAnatomy: [
      {
        step: '1. Společné rozhraní pro základ i všechny obaly',
        codeLine: 'public interface IKava { string Popis(); int Cena(); }',
        whyItWorks: 'Díky společnému rozhraní můžeš do dekorátoru zabalit jak základní Espresso, tak už zabalený jiný dekorátor.'
      },
      {
        step: '2. Abstraktní dekorátor (je IKava A ZÁROVEŇ drží IKava)',
        codeLine: 'public abstract class KavaDecorator : IKava { protected IKava _kava; public KavaDecorator(IKava k) => _kava = k; ... }',
        whyItWorks: 'Kombinuje implementaci rozhraní (: IKava) a kompozici (protected IKava _kava), které v konstruktoru předá vnitřní objekt.'
      },
      {
        step: '3. Konkrétní dekorátor přidávající chování přes override',
        codeLine: 'public override int Cena() => _kava.Cena() + 15;',
        whyItWorks: 'Zavolá metodu vnitřního objektu (_kava.Cena()) a k jejímu výsledku nabalí vlastní přidanou hodnotu (+ 15 Kč).'
      }
    ]
  },

  bridge: {
    whenToUse: [
      'Když máš dvě nezávislé dimenze, které se obě rozrůstají (např. Tvary: Kruh/Čtverec a Barvy: Červená/Modrá, nebo Ovladače a Zařízení: TV/Rádio).',
      'Zabraňuje kombinatorické explozi podtříd (místo M × N tříd jako CervenyKruh, ModryCtverec máš jen M + N tříd spojených mostem).'
    ],
    whenNotToUse: 'Pokud se mění jen jedna dimenze a druhá je pevně daná.',
    codeAnatomy: [
      {
        step: '1. Rozhraní implementace (druhá dimenze)',
        codeLine: 'public interface IBarva { string AplikujBarvu(); }',
        whyItWorks: 'Vyčlení druhou dimenzi (barvu/vykreslovač/zařízení) do samostatné hierarchie za rozhraní.'
      },
      {
        step: '2. Abstrakce držící most přes kompozici',
        codeLine: 'public abstract class Tvar { protected IBarva _barva; protected Tvar(IBarva b) => _barva = b; }',
        whyItWorks: 'Právě proměnná protected IBarva _barva uvnitř třídy Tvar tvoří onen „Most“ (Bridge) mezi oběma hierarchiemi.'
      },
      {
        step: '3. Nezávislé rozšíření obou stran',
        codeLine: 'Tvar k = new Kruh(new CervenaBarva());',
        whyItWorks: 'Můžeš přidat nový Tvar nebo novou Barvu bez jediného zásahu do druhé hierarchie.'
      }
    ]
  },

  flyweight: {
    whenToUse: [
      'Když v paměti RAM potřebuješ mít statisíce až miliony podobných objektů (stromy v lese, částice, znaky v dokumentu) a došla by ti paměť.',
      'Funguje pouze tehdy, když lze z objektů vyčlenit velká společná neměnná data.'
    ],
    whenNotToUse: 'Pokud máš v programu jen stovky objektů nebo se každý objekt ve všech atributech liší.',
    codeAnatomy: [
      {
        step: '1. Vnitřní sdílený stav (Intrinsic state – Flyweight)',
        codeLine: 'public class DruhStromu { public string Nazev { get; } public byte[] Textura { get; } ... }',
        whyItWorks: 'Obsahuje obří neměnná data (textura, model), která jsou pro všechny duby v lese úplně stejná – v RAM je jen 1x.'
      },
      {
        step: '2. Flyweight Factory (kešování ve slovníku)',
        codeLine: 'private static Dictionary<string, DruhStromu> _druhy = new();',
        whyItWorks: 'Při žádosti o "Dub" nejdřív koukne do Dictionary – pokud už existuje, vrátí existující referenci místo volání new.'
      },
      {
        step: '3. Vnější unikátní stav (Extrinsic state)',
        codeLine: 'public class Strom { public int X, Y; private DruhStromu _druh; }',
        whyItWorks: 'Každý z milionu stromů drží jen 8 bajtů souřadnic (X, Y) a ukazatel na sdílený DruhStromu.'
      }
    ]
  },

  facade: {
    whenToUse: [
      'Když máš složitý subsystém plný desítek tříd (kodeky, čtečky, mixéry, validátory) a chceš klientovi nabídnout jednu jednoduchou metodu (např. PrevedVideo()).',
      'Snižuje provázanost (coupling) mezi klientským kódem a vnitřkem knihovny.'
    ],
    whenNotToUse: 'Pokud klient potřebuje detailně nastavovat každý vnitřní krok subsystému zvlášť.',
    codeAnatomy: [
      {
        step: '1. Třídy složitého subsystému',
        codeLine: 'class VideoKodek { ... }   class AudioMixer { ... }   class BitrateReader { ... }',
        whyItWorks: 'Dělají skutečnou nízkoúrovňovou práci, ale jejich přímé volání ve správném pořadí je složité.'
      },
      {
        step: '2. Třída Fasády držící odkazy na subsystémy',
        codeLine: 'public class VideoKonvertorFacade { private VideoKodek _kodek = new(); ... }',
        whyItWorks: 'Schová všechny subsystémy za jednu přehlednou třídu.'
      },
      {
        step: '3. Jednoduchá metoda pro klienta',
        codeLine: 'public void PrevedVideo(string soubor) { _ctecka.Nacti(soubor); _kodek.Dekoduj(); _mixer.Smichej(); }',
        whyItWorks: 'Klient zavolá jediný řádek a Fasáda za oponou odřídí celý proces.'
      }
    ]
  },

  composite: {
    whenToUse: [
      'Když pracuješ se STROMOVOU strukturou (Soubory a Složky, Menu a Podmenu, Grafické prvky a Skupiny).',
      'Když chceš, aby klient volal stejnou metodu (např. Velikost() nebo Vykresli()) na jednotlivý prvek i na celou složku bez rozlišování přes if/else.'
    ],
    whenNotToUse: 'Pokud tvoje data netvoří stromovou hierarchii část–celek.',
    codeAnatomy: [
      {
        step: '1. Společné rozhraní pro List (Soubor) i Kompozit (Složku)',
        codeLine: 'public interface ISouborovySystem { int ZiskejVelikost(); }',
        whyItWorks: 'Klient se ptá na ISouborovySystem.ZiskejVelikost() a neřeší, zda jde o jeden soubor nebo složku plnou podsložek.'
      },
      {
        step: '2. Jednoduchý prvek (Leaf / Soubor)',
        codeLine: 'public class Soubor : ISouborovySystem { public int ZiskejVelikost() => _velikost; }',
        whyItWorks: 'Koncový prvek stromu nemá žádné potomky, rovnou vrátí svou hodnotu.'
      },
      {
        step: '3. Složený prvek (Composite / Složka) obsahující seznam rozhraní',
        codeLine: 'public class Slozka : ISouborovySystem { private List<ISouborovySystem> _polozky = new(); ... }',
        whyItWorks: 'Protože seznam drží typ ISouborovySystem, může složka obsahovat jak Soubory, tak další Složky (rekurzivní strom).'
      }
    ]
  },

  strategy: {
    whenToUse: [
      'Když máš více různých algoritmů nebo způsobů provedení téže akce (platba Kartou / PayPal / Krypto; řazení; výpočet trasy) a chceš je přepínat za běhu programu.',
      'Nahrazuje dlouhé a nepřehledné bloky if/else nebo switch.'
    ],
    whenNotToUse: 'Pokud máš jen dva triviální případy, které se nikdy nebudou rozšiřovat.',
    codeAnatomy: [
      {
        step: '1. Rozhraní strategie',
        codeLine: 'public interface IPlatebniBrana { bool ProvedPlatbu(int castkaKc); }',
        whyItWorks: 'Definuje jednotnou hlavičku pro všechny algoritmy (způsoby platby).'
      },
      {
        step: '2. Samostatné třídy pro každý algoritmus',
        codeLine: 'public class PlatbaKartou : IPlatebniBrana { ... }',
        whyItWorks: 'Každý způsob platby je izolovaný ve vlastní třídě – přidání nové platby nerozbije stávající kód (Open/Closed Principle).'
      },
      {
        step: '3. Kontext umožňující výměnu strategie za běhu',
        codeLine: 'public class NakupniKosik { private IPlatebniBrana _metoda; public void NastavMetodu(IPlatebniBrana m) => _metoda = m; }',
        whyItWorks: 'Košík drží jen rozhraní IPlatebniBrana – zavoláním NastavMetodu() za běhu okamžitě změníš chování košíku.'
      }
    ]
  },

  command: {
    whenToUse: [
      'Když potřebuješ samotnou AKCI (požadavek) zabalit do objektu, abys ji mohl uložit do seznamu (historie), řadit do fronty, logovat nebo vracet zpět (Undo / Ctrl+Z).',
      'Odděluje objekt, který akci vyvolává (Tlačítko/Klávesová zkratka), od objektu, který ji skutečně vykonává (TextEditor / Hrdina).'
    ],
    whenNotToUse: 'Pro běžné přímé volání metod, kde nepotřebuješ historii, Undo ani frontu úloh.',
    codeAnatomy: [
      {
        step: '1. Rozhraní příkazu s Execute() a Undo()',
        codeLine: 'public interface IPrikaz { void Execute(); void Undo(); }',
        whyItWorks: 'Promění volání metody v plnohodnotný objekt, se kterým lze pracovat jako s daty.'
      },
      {
        step: '2. Konkrétní příkaz držící příjemce (Receiver) a parametry akce',
        codeLine: 'public class VlozTextPrikaz : IPrikaz { private TextEditor _editor; private string _text; ... }',
        whyItWorks: 'Objekt příkazu si pamatuje, NA ČEM a S JAKÝMI DATY se akce provedla, takže ji v Undo() dokáže přesně odčinit.'
      },
      {
        step: '3. Invoker s historií příkazů',
        codeLine: 'private Stack<IPrikaz> _historie = new(); public void Spust(IPrikaz p) { p.Execute(); _historie.Push(p); }',
        whyItWorks: 'Každý vykonaný příkaz se uloží na zásobník; pro Krok zpět (Undo) stačí zavolat _historie.Pop().Undo().'
      }
    ]
  },

  memento: {
    whenToUse: [
      'Když potřebuješ uložit snímek (snapshot) vnitřního stavu objektu a později se k němu vrátit (Undo / Checkpoint ve hře), ANIŽ bys porušil zapouzdření (private pole).',
      'Skvěle se kombinuje se vzorem Command (příkaz si před vykonáním uloží Memento).'
    ],
    whenNotToUse: 'Pokud objekt obsahuje obrovské množství dat v RAM a ukládání kopie stavu při každém kroku by zahltilo paměť.',
    codeAnatomy: [
      {
        step: '1. Třída Memento (neměnná časová kapsle)',
        codeLine: 'public class EditorMemento { public string Obsah { get; } public EditorMemento(string o) => Obsah = o; }',
        whyItWorks: 'Má pouze gettery (žádný set) – nikdo zvenčí nemůže uloženou zálohu zpětně poškodit.'
      },
      {
        step: '2. Originator vytvářející a obnovující snímek',
        codeLine: 'public EditorMemento Uloz() => new EditorMemento(_tajnyObsah);   public void Obnov(EditorMemento m) => _tajnyObsah = m.Obsah;',
        whyItWorks: 'Pouze samotný Originator (Editor) má přístup ke svým private proměnným a umí je zabalit do Mementa a zase rozbalit.'
      },
      {
        step: '3. Caretaker (Správce historie)',
        codeLine: 'private Stack<EditorMemento> _historie = new();',
        whyItWorks: 'Správce historie mementa pouze bezpečně uchovává v zásobníku, aniž by musel vidět dovnitř stavu objektu.'
      }
    ]
  },

  observer: {
    whenToUse: [
      'Když při změně stavu jednoho objektu (Subject / Vydavatel) potřebuješ automaticky upozornit libovolný počet dalších objektů (Observers / Odběratelé), aniž by na ně byl Vydavatel pevně napojený.',
      'Např. změna zdraví hrdiny automaticky aktualizuje UI lištu, zapíše statistiku a zkontroluje Achievementy.'
    ],
    whenNotToUse: 'Pokud máš jen jednoho pevného příjemce nebo by kaskáda notifikací způsobila zacyklení.',
    codeAnatomy: [
      {
        step: '1. Rozhraní pozorovatele (Odběratele)',
        codeLine: 'public interface IObserver { void Update(string udalost); }',
        whyItWorks: 'Vydavatel nemusí vědět, zda ho poslouchá UI, Logger nebo Achievement systém – ví jen, že mají metodu Update().'
      },
      {
        step: '2. Vydavatel (Subject) se seznamem odběratelů',
        codeLine: 'private List<IObserver> _odberatele = new(); public void Prihlas(IObserver o) => _odberatele.Add(o);',
        whyItWorks: 'Odběratelé se mohou dynamicky přihlašovat a odhlašovat za běhu programu.'
      },
      {
        step: '3. Hromadná notifikace ve foreach cyklu',
        codeLine: 'foreach (var o in _odberatele) { o.Update("Zdraví kleslo!"); }',
        whyItWorks: 'Jakmile se v Subjectu změní stav, v cyklu oběhne všechny přihlášené pozorovatele a zavolá jim Update().'
      }
    ]
  },

  state: {
    whenToUse: [
      'Když se objekt chová úplně jinak podle svého vnitřního stavu (např. Dokument: Koncept -> Schvalování -> Publikováno; nebo Objednávka / Hráč) a v metodách ti bobtnají obří podmínky if/else nebo switch.',
      'Každý stav vyčleníš do samostatné třídy se společným rozhraním.'
    ],
    whenNotToUse: 'Pokud má objekt jen 2 stavy s minimální logikou, kde jednoduchý if/else bohatě stačí.',
    codeAnatomy: [
      {
        step: '1. Rozhraní stavu',
        codeLine: 'public interface IStavDokumentu { void Publikuj(Dokument doc); }',
        whyItWorks: 'Předepisuje akce, které jsou závislé na aktuálním stavu objektu.'
      },
      {
        step: '2. Konkrétní třídy pro každý stav',
        codeLine: 'public class StavKoncept : IStavDokumentu { public void Publikuj(Dokument d) => d.ZmenStav(new StavSchvalovani()); }',
        whyItWorks: 'Žádné if (stav == ...). Každá stavová třída řeší jen chování ve svém stavu a může objekt přepnout do stavu dalšího.'
      },
      {
        step: '3. Kontext delegující volání na aktuální stav',
        codeLine: 'public class Dokument { private IStavDokumentu _stav; public void Publikuj() => _stav.Publikuj(this); }',
        whyItWorks: 'Hlavní třída Dokument jen předá práci aktuálnímu objektu v _stav. Změnou objektu v _stav se změní chování celého dokumentu.'
      }
    ]
  }
};
