export type FlashcardCategory = 'creational' | 'structural' | 'behavioral' | 'oop-theory';

export interface Flashcard {
  id: string;
  title: string;
  czechTitle: string;
  category: FlashcardCategory;
  problemScenario: string;
  hint: string;
  gofRule: string;
  whenToUse: string[];
  whenNotToUse: string;
  codeSnippet: string;
  patternId?: string; // odpovídá patternKey v PatternUMLDiagram
  examTrap?: string;
}

export const flashcardsData: Flashcard[] = [
  // =========================================================================
  // CREATIONAL PATTERNS (Vytvářející vzory)
  // =========================================================================
  {
    id: 'fc-singleton',
    title: 'Singleton',
    czechTitle: 'Jedináček',
    category: 'creational',
    patternId: 'singleton',
    problemScenario:
      'Aplikace potřebuje centrální správu sdíleného zdroje (např. konfiguraci, logger, pool připojení k DB). Běžné volání "new" by vytvořilo více různých instancí s nekonzistentním stavem a plýtvalo pamětí.',
    hint: 'Zkouškový chyták: Co musí mít konstruktor a jaká statická vlastnost vrací instanci z Heapu?',
    gofRule: 'Zapouzdři vytváření jediné instance přímo do samotné třídy a poskytni k ní globální přístupový bod.',
    whenToUse: [
      'Když v celém programu smí existovat přesně jedna sdílená instance.',
      'Když potřebuješ ke sdílené instanci přistupovat odkudkoliv bez předávání přes 10 vrstev konstruktorů.'
    ],
    whenNotToUse:
      'Při psaní jednotkových testů (těžko se mockuje) nebo pokud třída drží měnitelný stav, který různé komponenty nečekaně přepisují (vytváří skryté závislosti).',
    codeSnippet: `public class KonfiguraceSingleton
{
    private static KonfiguraceSingleton? _instance;

    // ZKOUŠKOVÁ PODMÍNKA: Privátní konstruktor zabrání 'new'!
    private KonfiguraceSingleton() { }

    public static KonfiguraceSingleton Instance
    {
        get
        {
            if (_instance == null) _instance = new KonfiguraceSingleton();
            return _instance;
        }
    }
}`,
    examTrap: 'Chybějící "private" u konstruktoru: C# kompilátor by jinak automaticky vygeneroval veřejný parameterless konstruktor a kdokoliv by mohl volat new!'
  },

  {
    id: 'fc-factory-method',
    title: 'Factory Method',
    czechTitle: 'Tovární metoda',
    category: 'creational',
    patternId: 'factory-method',
    problemScenario:
      'Máš společnou herní logiku (např. SpustVlnu()), která potřebuje vytvářet a ovládat nepřátele. Dopředu však nevíš, jaký konkrétní typ nepřítele (Zombie, Kostlivec, Boss) v jakém prostředí vznikne, a nechceš do jádra kódu lepit "switch/case" s operátory "new".',
    hint: 'Kdo dědí a přepisuje virtuální/abstraktní metodu? Jak se jmenuje metoda vracející rozhraní produktu?',
    gofRule: 'Definuj rozhraní pro vytváření objektu, ale nech podtřídy rozhodnout, jakou třídu instanciovat.',
    whenToUse: [
      'Když předem neznáš přesné typy a závislosti objektů, se kterými má kód pracovat.',
      'Když chceš uživatelům knihovny či frameworku umožnit rozšířit její interní komponenty pomocí dědičnosti.'
    ],
    whenNotToUse:
      'Když vytváříš jen jednu jednoduchou třídu, jejíž typ se nikdy nemění – zbytečná hierarchie tvůrců zvyšuje komplexitu.',
    codeSnippet: `// 1. Společné rozhraní produktu
public interface INepritel { void Zautoc(); }

// 2. Abstraktní tvůrce s tovární metodou
public abstract class GeneratorNepratel
{
    public abstract INepritel VytvorNepritele(); // Factory Method
    
    public void SpustVlnu()
    {
        INepritel n = VytvorNepritele();
        n.Zautoc();
    }
}

// 3. Konkrétní tvůrce
public class GeneratorLes : GeneratorNepratel
{
    public override INepritel VytvorNepritele() => new Vlk();
}`,
    examTrap: 'Tovární metoda je V METODĚ předka (abstraktní/virtuální), ne ve statické pomocné třídě (to by byla Simple Factory, nikoliv GoF Factory Method).'
  },

  {
    id: 'fc-abstract-factory',
    title: 'Abstract Factory',
    czechTitle: 'Abstraktní továrna',
    category: 'creational',
    patternId: 'abstract-factory',
    problemScenario:
      'Aplikace potřebuje vytvářet celé rodiny souvisejících nebo závislých produktů (např. Moderní Židle + Moderní Stůl vs. Viktoriánská Židle + Viktoriánský Stůl) tak, aby klient nekombinoval nekompatibilní prvky různých stylů.',
    hint: 'Továrna na továrny! Rozhraní obsahuje více metod: VytvorZidli() a VytvorStul().',
    gofRule: 'Poskytni rozhraní pro vytváření celých rodin závislých objektů bez specifikování jejich konkrétních tříd.',
    whenToUse: [
      'Systém musí být nezávislý na tom, jak jsou jeho produkty vytvářeny a skládány.',
      'Systém má být konfigurován s jednou z několika ucelených rodin produktů (např. GUI komponenty pro Windows vs macOS).'
    ],
    whenNotToUse:
      'Když se často přidávají zcela nové druhy produktů do rodiny – přidání metody do rozhraní továrny vyžaduje úpravu všech konkrétních továren.',
    codeSnippet: `public interface INabytekFactory
{
    IZidle VytvorZidli();
    IStul VytvorStul();
}

public class ModerniNabytekFactory : INabytekFactory
{
    public IZidle VytvorZidli() => new ModerniZidle();
    public IStul VytvorStul() => new ModerniStul();
}

// Klientský kód přijímá pouze INabytekFactory:
// Židle a stůl k sobě budou VŽDY stylově ladit!`,
    examTrap: 'Rozdíl oproti Factory Method: Factory Method řeší 1 metodu pro 1 produkt. Abstract Factory řeší celou sadu metod pro rodinu souvisejících produktů.'
  },

  {
    id: 'fc-builder',
    title: 'Builder',
    czechTitle: 'Stavitel',
    category: 'creational',
    patternId: 'builder',
    problemScenario:
      'Objekt má desítky konfigurovatelných parametrů, z nichž většina je volitelná (tzv. Telescoping Constructor anti-pattern s 8 přetíženými konstruktory plnými null a false parametrů).',
    hint: 'Plynulé rozhraní (Fluent API): builder.PridajRam().PridajMotor().Build();',
    gofRule: 'Odděl konstrukci složitého objektu od jeho reprezentace, takže stejný konstrukční proces může vytvořit různé reprezentace.',
    whenToUse: [
      'Pro odstranění "teleskopického konstruktoru" s mnoha parametry.',
      'Když potřebuješ objekt sestavovat krok za krokem a vracet různé varianty (Director).',
      'Při tvorbě neměnných (immutable) složitých objektů.'
    ],
    whenNotToUse:
      'Pro jednoduché datové třídy s 2–3 povinnými parametry – režie tříd stavitele by byla zbytečná.',
    codeSnippet: `public class HerniPostavaBuilder
{
    private HerniPostava _postava = new();

    public HerniPostavaBuilder NastavJmeno(string jmeno)
    {
        _postava.Jmeno = jmeno;
        return this; // Umožňuje řetězení metod (fluent API)
    }

    public HerniPostavaBuilder PridejMec()
    {
        _postava.Zbran = "Obouruční meč";
        return this;
    }

    public HerniPostava Build() => _postava;
}`,
    examTrap: 'Nezapomeň vracet "return this;" v každém kroku stavitele, aby klient mohl volat metody plynule v řetězu.'
  },

  // =========================================================================
  // STRUCTURAL PATTERNS (Strukturální vzory)
  // =========================================================================
  {
    id: 'fc-adapter',
    title: 'Adapter',
    czechTitle: 'Adaptér',
    category: 'structural',
    patternId: 'adapter',
    problemScenario:
      'Máš existující systém očekávající rozhraní IPlatebniProcesor s metodou Zaplat(castka), ale integruješ externí knihovnu PayPalApi, která nabízí metodu SendPayment(double amount, string currency). Rozhraní jsou nekompatibilní a zdroják cizí knihovny nemůžeš měnit.',
    hint: 'Zásuvková redukce! Drží instanci cizí třídy (Adaptee) a implementuje očekávané rozhraní (Target).',
    gofRule: 'Převeď rozhraní jedné třídy na rozhraní, které klient očekává. Umožňuje spolupráci tříd, které by jinak kvůli nekompatibilitě nemohly spolupracovat.',
    whenToUse: [
      'Když chceš použít existující třídu, ale její rozhraní neodpovídá zbytku systému.',
      'Při integraci knihoven třetích stran nebo legacy kódu.'
    ],
    whenNotToUse:
      'Pokud máš plnou kontrolu nad oběma třídami – často je čistší refaktorovat původní rozhraní napřímo.',
    codeSnippet: `// 1. Cílové rozhraní pro náš systém
public interface IPlatebniProcesor { void Zaplat(int kc); }

// 2. Objektový adaptér zabalí nekompatibilní službu
public class PayPalAdapter : IPlatebniProcesor
{
    private readonly PayPalApi _adaptee;
    public PayPalAdapter(PayPalApi adaptee) => _adaptee = adaptee;

    public void Zaplat(int kc)
    {
        // Převod rozhraní a parametrů
        _adaptee.SendPayment((double)kc, "CZK");
    }
}`,
    examTrap: 'Objektový adaptér využívá kompozici (drží referenci v poli). Třídní adaptér v C# využívá vícenásobnou dědičnost přes rozhraní (dědí z třídy a implementuje interface).'
  },

  {
    id: 'fc-proxy',
    title: 'Proxy',
    czechTitle: 'Zástupce',
    category: 'structural',
    patternId: 'proxy',
    problemScenario:
      'Objekt je příliš náročný na paměť při startu (např. obří video či DB spojení), nebo potřebuješ před každým voláním ověřit přístupová práva uživatele, případně cachovat výsledky náročných SQL dotazů.',
    hint: 'Zástupce implementuje STEJNÉ rozhraní jako skutečný objekt, kontroluje přístup a deleguje volání.',
    gofRule: 'Poskytni náhradníka nebo zástupný symbol pro jiný objekt, aby se řídil přístup k němu.',
    whenToUse: [
      'Virtual / Lazy Proxy: Zpožděná inicializace těžkého objektu až při prvním skutečném použití.',
      'Protection Proxy: Kontrola oprávnění (např. zda je volající Admin).',
      'Caching / Remote Proxy: Ukládání výsledků do mezipaměti nebo síťová komunikace.'
    ],
    whenNotToUse:
      'Když objekt nepřináší žádnou přidanou hodnotu v kontrole přístupu ani cachování – jen přidává zbytečnou vrstvu.',
    codeSnippet: `public interface IDatabaze { string Dotaz(string sql); }

public class DatabazeProxy : IDatabaze
{
    private SkutecnaDatabaze? _realnaDb; // Lazy load
    private readonly Uzivatel _user;

    public DatabazeProxy(Uzivatel user) => _user = user;

    public string Dotaz(string sql)
    {
        if (_user.Role != "Admin") throw new UnauthorizedAccessException();
        _realnaDb ??= new SkutecnaDatabaze(); // Inicializace až teď!
        return _realnaDb.Dotaz(sql);
    }
}`,
    examTrap: 'Rozdíl Adapter vs Proxy: Adapter mění nekompatibilní rozhraní na jiné. Proxy implementuje PŘESNĚ TO SAMÉ rozhraní a pouze řídí přístup.'
  },

  {
    id: 'fc-decorator',
    title: 'Decorator',
    czechTitle: 'Dekorátor',
    category: 'structural',
    patternId: 'decorator',
    problemScenario:
      'Máš základní kávu (Espresso) a zákazník si k ní může libovolně navolit mléko, karamel, šlehačku, skořici. Kdybys tvořil podtřídy pro každou kombinaci (KavaSMlekemAKaramelem), vznikne kombinatorická exploze desítek tříd.',
    hint: 'Slupky cibule! Dekorátor implementuje rozhraní komponenty a zároveň drží vnořenou instanci komponenty.',
    gofRule: 'Dynamicky připoj další odpovědnosti k objektu. Dekorátory poskytují flexibilní alternativu k podtřídám pro rozšíření funkčnosti.',
    whenToUse: [
      'Když potřebuješ dynamicky a za běhu přidávat či odebírat chování objektům.',
      'Když by dědičnost vedla k obrovskému množství podtříd se všemi kombinacemi vlastností.'
    ],
    whenNotToUse:
      'Když záleží na přesné vnitřní identitě konkrétního objektu (obalení dekorátorem změní referenci) nebo když má komponenta příliš rozsáhlé rozhraní.',
    codeSnippet: `public interface IKava { double Cena(); }
public class Espresso : IKava { public double Cena() => 50; }

public abstract class KavaDecorator : IKava
{
    protected readonly IKava _kava; // Vnořená komponenta
    public KavaDecorator(IKava k) => _kava = k;
    public virtual double Cena() => _kava.Cena();
}

public class MlekoDecorator : KavaDecorator
{
    public MlekoDecorator(IKava k) : base(k) { }
    public override double Cena() => base.Cena() + 15;
}
// Použití: IKava k = new MlekoDecorator(new Espresso());`,
    examTrap: 'Při skládání dekorátorů se volá "base.Cena() + 15". Bez base.Cena() by se ztratil výpočet předchozích vnořených vrstev!'
  },

  {
    id: 'fc-bridge',
    title: 'Bridge',
    czechTitle: 'Most',
    category: 'structural',
    patternId: 'bridge',
    problemScenario:
      'Vyvíjíš hierarchii tvarů (Kruh, Čtverec) a zároveň barev (Červená, Modrá). Kdybys použil klasickou dědičnost, potřebuješ třídy CervenyKruh, ModryKruh, CervenyCtverec, ModryCtverec (N × M tříd).',
    hint: 'Most rozděluje dvě dimenze: abstrakci (Tvar) a implementaci (IBarva). Tvar má pole s referencí na IBarva.',
    gofRule: 'Odděl abstrakci od její implementace, aby se obě mohly měnit nezávisle.',
    whenToUse: [
      'Když chceš rozdělit a uspořádat monolitickou třídu, která má několik variant funkcionality (např. DálkovýOvladač + Rádio/TV).',
      'Když potřebuješ přepínat implementace za běhu programu.'
    ],
    whenNotToUse:
      'Pokud má tvůj systém pouze jedinou stabilní dimenzi variability – zbytečné rozdělení na abstrakci a implementátora kód zkomplikuje.',
    codeSnippet: `public interface IBarva { string ZiskejOdstin(); }
public class Cervena : IBarva { public string ZiskejOdstin() => "Červená"; }

public abstract class Tvar
{
    protected readonly IBarva _barva; // Most na implementátora
    public Tvar(IBarva barva) => _barva = barva;
    public abstract void Vykresli();
}

public class Kruh : Tvar
{
    public Kruh(IBarva b) : base(b) { }
    public override void Vykresli() => 
        Console.WriteLine($"Kruh s barvou {_barva.ZiskejOdstin()}");
}`,
    examTrap: 'Bridge se navrhuje DOPŘEDU v architektuře, zatímco Adapter se používá DODATEČNĚ k propojení nekompatibilních existujících tříd.'
  },

  {
    id: 'fc-flyweight',
    title: 'Flyweight',
    czechTitle: 'Muší váha',
    category: 'structural',
    patternId: 'flyweight',
    problemScenario:
      'V herním lese potřebuješ vykreslit 1 000 000 stromů. Každý strom má texturu (10 MB mesh a barvy). Alokace milionu instancí v RAM způsobí pád aplikace na OutOfMemoryException.',
    hint: 'Rozděl stav na vnitřní (sdílený: textura, model) a vnější (unikátní: souřadnice X, Y na mapě).',
    gofRule: 'Použij sdílení k efektivní podpoře velkého počtu drobných objektů.',
    whenToUse: [
      'Aplikace vytváří obrovské množství objektů a vyčerpává RAM.',
      'Objekty obsahují duplicitní stav, který lze vytknout a sdílet mezi instancemi.'
    ],
    whenNotToUse:
      'Když v aplikaci není problém s nedostatkem paměti – Flyweight obětuje CPU cykly při předávání vnějšího stavu výměnou za ušetřenou RAM.',
    codeSnippet: `// Intrinsic state: Vnitřní sdílený stav (Model, Textura)
public class DruhStromu
{
    public string Nazev { get; }
    public string Textura { get; }
    public DruhStromu(string n, string t) { Nazev = n; Textura = t; }

    public void Vykresli(int x, int y) // Extrinsic: X, Y předány zvenčí!
    {
        Console.WriteLine($"Strom {Nazev} na souřadnicích [{x},{y}]");
    }
}

// Extrinsic state: Každý strom si drží jen souřadnice + referenci
public class Strom
{
    private int _x, _y;
    private DruhStromu _druh; // 1 milion stromů odkazuje na tentýž 1 objekt v Heapu
}`,
    examTrap: 'Vnitřní stav (Intrinsic) MUSÍ být neměnný (immutable), protože je sdílený stovkami tisíc kontextů najednou.'
  },

  {
    id: 'fc-facade',
    title: 'Facade',
    czechTitle: 'Fasáda',
    category: 'structural',
    patternId: 'facade',
    problemScenario:
      'Klient chce provést jednoduchou akci (např. "Převést video"), ale musí ručně inicializovat a propojit 5 složitých podsystémů: AudioMixer, VideoBitrateCompressor, CodecFactory a FileStream.',
    hint: 'Jednoduché jednotné tlačítko zakrývající chaos podsystému.',
    gofRule: 'Poskytni jednotné rozhraní pro sadu rozhraní v podsystému. Fasáda definuje rozhraní vyšší úrovně, které usnadňuje používání podsystému.',
    whenToUse: [
      'Když potřebuješ poskytnout jednoduché, omezené rozhraní ke komplexnímu subsystému.',
      'Když chceš strukturovat subsystémy do vrstev a minimalizovat vazby mezi nimi.'
    ],
    whenNotToUse:
      'Když klient potřebuje plný přístup ke všem pokročilým a specifickým funkcím podsystému bez omezení.',
    codeSnippet: `public class VideoKonvertorFasada
{
    public void PrevedVideo(string soubor, string format)
    {
        var mixer = new AudioMixer();
        var video = new VideoExtractor();
        var encoder = new MpegEncoder();
        
        video.Extract(soubor);
        mixer.FixAudio(soubor);
        encoder.Encode(soubor, format);
        // Klient volá jen jednu metodu PrevedVideo()!
    }
}`,
    examTrap: 'Fasáda nebrání pokročilým klientům přistupovat přímo k podsystémům, pokud potřebují – pouze nabízí pohodlnou zkratku pro 95 % běžných scénářů.'
  },

  {
    id: 'fc-composite',
    title: 'Composite',
    czechTitle: 'Kompozit',
    category: 'structural',
    patternId: 'composite',
    problemScenario:
      'Máš stromovou strukturu souborového systému (Soubor a Složka). Složka může obsahovat soubory i další vnořené složky. Chceš spočítat celkovou velikost nebo vypsat názvy, aniž bys zjišťoval "if (polozka is Slozka)".',
    hint: 'Stromová struktura! List i uzel implementují stejné rozhraní IKomponenta.',
    gofRule: 'Sestav objekty do stromových struktur pro reprezentaci hierarchií část-celek. Kompozit umožňuje klientům zacházet s jednotlivými objekty i složeninami jednotně.',
    whenToUse: [
      'Když potřebuješ reprezentovat stromové hierarchie část-celek (GUI prvky, strom složek, organizační struktura).',
      'Když chceš, aby klientský kód zacházel se složenými i jednoduchými prvky jednotně.'
    ],
    whenNotToUse:
      'Když prvky stromu nemají žádné společné operace a jejich sjednocení do jednoho rozhraní by porušilo Interface Segregation Principle.',
    codeSnippet: `public interface ISoucastka { int SpocitejCenu(); }

// List (jednoduchý prvek)
public class Sroubek : ISoucastka { public int SpocitejCenu() => 5; }

// Kompozit (složený prvek s potomky)
public class Krabice : ISoucastka
{
    private List<ISoucastka> _polozky = new();
    public void Pridej(ISoucastka s) => _polozky.Add(s);

    public int SpocitejCenu() => _polozky.Sum(p => p.SpocitejCenu());
}`,
    examTrap: 'Rekurze! Metoda kompozitu rekurzivně volá stejnou metodu na všech svých dětech. Klient nemusí vědět, zda drží krabici nebo šroubek.'
  },

  // =========================================================================
  // BEHAVIORAL PATTERNS (Vzory chování)
  // =========================================================================
  {
    id: 'fc-strategy',
    title: 'Strategy',
    czechTitle: 'Strategie',
    category: 'behavioral',
    patternId: 'strategy',
    problemScenario:
      'V e-shopu máš nákupní košík a potřebuješ podporovat různé způsoby platby (Platba kartou, PayPal, Bitcoin). Kdybys použil switch/if v košíku, každá nová platební metoda vyžaduje úpravu existujícího kódu a porušuje Open/Closed Principle.',
    hint: 'Záměnný algoritmus za běhu! Třída drží rozhraní IPlatebniStrategie.',
    gofRule: 'Definuj rodinu algoritmů, zapouzdři každý z nich a učiň je vzájemně zaměnitelnými. Strategie umožňuje měnit algoritmus nezávisle na klientech, kteří jej používají.',
    whenToUse: [
      'Když chceš používat různé varianty algoritmu v rámci jednoho objektu a moci je přepínat za běhu.',
      'Pro odstranění masivních bloků "if/else" nebo "switch", které vybírají varianty výpočtu.'
    ],
    whenNotToUse:
      'Pokud máš jen 2 stabilní jednoduché algoritmy, které se nikdy nemění – režie rozhraní a nových tříd je zbytečná.',
    codeSnippet: `public interface IPlatebniStrategie
{
    void Zaplat(int castka);
}

public class PlatbaKartou : IPlatebniStrategie
{
    public void Zaplat(int castka) => Console.WriteLine($"Platba kartou: {castka} Kč");
}

public class NakupniKosik
{
    private IPlatebniStrategie _strategie;
    public void NastavStrategii(IPlatebniStrategie s) => _strategie = s;
    public void DokoncitObjednavku(int cena) => _strategie.Zaplat(cena);
}`,
    examTrap: 'Strategie vs State: Strategie řeší výběr nezávislého algoritmu (klient ví, kterou volí). State mění chování automaticky podle vnitřního stavu objektu.'
  },

  {
    id: 'fc-command',
    title: 'Command',
    czechTitle: 'Příkaz',
    category: 'behavioral',
    patternId: 'command',
    problemScenario:
      'V textovém editoru chceš implementovat tlačítka (Zkopírovat, Vložit) a zároveň historii operací s možností operaci vrátit zpět (Undo) a znovu provést (Redo). Přímé volání metod editoru z tlačítek znemožňuje historii.',
    hint: 'Zapouzdři požadavek jako objekt s metodami Execute() a Undo()!',
    gofRule: 'Zapouzdři požadavek jako objekt, čímž umožníš parametrizovat klienty různými požadavky, řadit je do fronty a podporovat operace vrácení zpět.',
    whenToUse: [
      'Pro implementaci operací Zpět (Undo) a Znovu (Redo).',
      'Pro plánování úloh do fronty, odložené spouštění nebo logování historie akcí.',
      'Pro oddělení odesílatele příkazu (GUI tlačítko) od příjemce (Receiver, např. Dokument).'
    ],
    whenNotToUse:
      'Pro triviální přímá volání metod bez potřeby historie, fronty či odloženého běhu.',
    codeSnippet: `public interface IPrikaz
{
    void Execute();
    void Undo();
}

public class VlozTextPrikaz : IPrikaz
{
    private readonly Editor _editor;
    private readonly string _text;

    public VlozTextPrikaz(Editor editor, string text)
    {
        _editor = editor;
        _text = text;
    }

    public void Execute() => _editor.PripojText(_text);
    public void Undo() => _editor.SmazPoslednichNZnaku(_text.Length);
}`,
    examTrap: 'Příkaz si musí uložit přesný stav nebo parametry potřebné pro Undo v momentě své inicializace (např. pozici kurzoru nebo původní text).'
  },

  {
    id: 'fc-memento',
    title: 'Memento',
    czechTitle: 'Památka / Snímek stavu',
    category: 'behavioral',
    patternId: 'memento',
    problemScenario:
      'Potřebuješ uložit snapshot (snímek stavu) složitého herního objektu před soubojem, abys v případě smrti hráče mohl stav obnovit. Kdyby si externí správce četl soukromé atributy hráče, porušíš zapouzdření.',
    hint: 'Tři role: Originator (Hráč), Memento (Snímek) a Caretaker (Správce historie/Save manager).',
    gofRule: 'Bez porušení zapouzdření zachyť a externalizuj vnitřní stav objektu, aby bylo možné objekt později do tohoto stavu vrátit.',
    whenToUse: [
      'Když potřebuješ vytvářet snímky stavu objektu pro možnost návratu (Checkpoints, Save/Load).',
      'Když by přímé zpřístupnění vnitřních proměnných objektu porušilo jeho zapouzdření.'
    ],
    whenNotToUse:
      'Když snímky spotřebovávají obrovské množství RAM a ukládají se příliš často bez komprese.',
    codeSnippet: `// 1. Memento: Neměnný snímek stavu
public class HracMemento
{
    public int Zdravi { get; }
    public int Zlato { get; }
    public HracMemento(int z, int g) { Zdravi = z; Zlato = g; }
}

// 2. Originator: Původce stavu
public class Hrac
{
    public int Zdravi { get; set; } = 100;
    public int Zlato { get; set; } = 50;

    public HracMemento UlozStav() => new(Zdravi, Zlato);
    public void ObnovStav(HracMemento m)
    {
        Zdravi = m.Zdravi;
        Zlato = m.Zlato;
    }
}`,
    examTrap: 'Caretaker (správce sejvů) drží memento jako černou skříňku – nesmí modifikovat data uvnitř mementa!'
  },

  {
    id: 'fc-observer',
    title: 'Observer',
    czechTitle: 'Pozorovatel',
    category: 'behavioral',
    patternId: 'observer',
    problemScenario:
      'Máš burzovní server s cenami akcií. Jakmile se cena změní, musí se aktualizovat mobilní aplikace, webový dashboard i automatický obchodní robot. Server nesmí mít hardcodované závislosti na konkrétních klientech.',
    hint: 'Vzor Odběratel / Vydavatel (Publisher / Subscriber). V C# často realizováno přes eventy a delegáty.',
    gofRule: 'Definuj závislost 1:N mezi objekty, takže když jeden objekt změní stav, všichni jeho závislí pozorovatelé jsou automaticky upozorněni a aktualizováni.',
    whenToUse: [
      'Když změna jednoho objektu vyžaduje aktualizaci ostatních a předem nevíš, kolik jich bude.',
      'Při tvorbě reaktivních UI systémů nebo event-driven architektur.'
    ],
    whenNotToUse:
      'Pokud je odběratelů příliš mnoho a notifikace probíhají v náhodném pořadí – může vést k race conditions a memory leakům (pokud se odběratel neodhlásí!).',
    codeSnippet: `public interface IObserver { void Update(double novaCena); }

public class BurzaSubject
{
    private List<IObserver> _pozorovatele = new();
    
    public void Prihlas(IObserver o) => _pozorovatele.Add(o);
    public void Odhlas(IObserver o) => _pozorovatele.Remove(o);

    public void Notifikuj(double cena)
    {
        foreach (var p in _pozorovatele) p.Update(cena);
    }
}`,
    examTrap: 'Memory leak chyták: Pokud se Observer neodhlásí (Unsubscribe), Subject na něj drží referenci a Garbage Collector objekt v paměti RAM nikdy neuvolní!'
  },

  {
    id: 'fc-state',
    title: 'State',
    czechTitle: 'Stav',
    category: 'behavioral',
    patternId: 'state',
    problemScenario:
      'Bankomat se chová úplně jinak, když v něm není karta, když čeká na PIN, nebo když vydává hotovost. Psaní metod plných obřích switch(stav) { case CekaNaPin: ... case KartaVlozena: ... } vede ke špagetovému kódu.',
    hint: 'Objekt mění své chování, když se změní jeho vnitřní stav. Třída kontextu deleguje akce na aktuální stav.',
    gofRule: 'Umožni objektu změnit své chování, když se změní jeho vnitřní stav. Objekt se bude jevit, jako by změnil svou třídu.',
    whenToUse: [
      'Když má objekt chování závislé na stavu a má desítky stavových podmínek v každé metodě.',
      'Když chceš přechody mezi stavy vyjádřit explicitně jako samostatné třídy.'
    ],
    whenNotToUse:
      'Když má stavový automat jen 2–3 stavy a jednoduchou logiku – State vyžaduje novou třídu pro každý stav.',
    codeSnippet: `public interface IStavBankomatu
{
    void VlozKartu(Bankomat b);
    void ZadejPin(Bankomat b, int pin);
}

public class BezKartyStav : IStavBankomatu
{
    public void VlozKartu(Bankomat b)
    {
        Console.WriteLine("Karta vložena. Zadejte PIN.");
        b.NastavStav(new CekaNaPinStav()); // Přechod do dalšího stavu!
    }
    public void ZadejPin(Bankomat b, int pin) => Console.WriteLine("Nejprve vložte kartu!");
}`,
    examTrap: 'Kdo řídí přechod mezi stavy? Buď samotné stavy (které znají další stav a volají kontext.NastavStav()), nebo kontext.'
  },

  // =========================================================================
  // CORE OOP EXAM CONCEPTS (Zkoušková teorie OOP)
  // =========================================================================
  {
    id: 'fc-stack-vs-heap',
    title: 'Stack vs Heap',
    czechTitle: 'Zásobník vs Halda v RAM',
    category: 'oop-theory',
    problemScenario:
      'Zkoušející se ptá: "Co se přesně stane v paměti RAM při `int a = 5; int b = a;` versus `Uzivatel u1 = new(); Uzivatel u2 = u1; u2.Jmeno = \"Petr\";`? Jaká bude hodnota u1.Jmeno?"',
    hint: 'Mentální model: Hodnotové typy žijí přímo na zásobníku (Stack), referenční typy na haldě (Heap) a proměnná drží jen adresu (nálepku na krabici).',
    gofRule: 'Základ fungování runtime .NET CLR: Value types vs Reference types určují sémantiku kopírování.',
    whenToUse: [
      'Pro pochopení výkonnostních rozdílů, memory allocations, garbage collection a předávání parametrů (ref/out).'
    ],
    whenNotToUse:
      'Není volitelný vzor, ale fundamentální architektura CLR paměti v C#.',
    codeSnippet: `// 1. STACK: Hodnotové typy (int, double, bool, struct)
int x = 10;
int y = x; // Kopíruje se samotná HODNOTA (y má vlastní kopii 10)
y = 99;    // x zůstává 10!

// 2. HEAP: Referenční typy (class, interface, string, object)
Uzivatel u1 = new Uzivatel("Karel"); // Alokace v RAM na Heapu
Uzivatel u2 = u1; // Kopíruje se pouze REFERENČNÍ UKAZATEL (adresa)!
u2.Jmeno = "David";

Console.WriteLine(u1.Jmeno); // Vypíše "David" (obě proměnné míří na stejný objekt)`,
    examTrap: 'Chyták se stringem! String je referenční typ (na Heapu), ale je IMMUTABLE (neměnný). text.ToUpper() nemění původní string, vrací nový objekt!'
  },

  {
    id: 'fc-upcasting-downcasting',
    title: 'Upcasting vs Downcasting',
    czechTitle: 'Přetypování (is / as operátory)',
    category: 'oop-theory',
    problemScenario:
      'V proměnné předka `Zamestnanec z = new Programator()` potřebuješ zavolat metodu `Programuj()`, která existuje pouze v odvozené třídě `Programator`. Jak to provést bezpečně a vyhnout se pádu programu?',
    hint: 'Upcasting je vždy bezpečný a implicitní. Downcasting může vyhodit InvalidCastException – použij moderní operátory is / as.',
    gofRule: 'Liskov Substitution Principle (LSP): Odvozená třída musí být kdykoliv zaměnitelná za svou bázovou třídu.',
    whenToUse: [
      'Při procházení kolekcí obecných předků (List<Zamestnanec>), když potřebuješ zjistit specifický typ prvku.',
      'Při zpracování zpráv nebo událostí různého typu.'
    ],
    whenNotToUse:
      'Pokud zjistíš, že 90 % tvého kódu je plných "if (x is TypA)", máš špatný návrh – použij polymorfismus místo větvicích podmínek!',
    codeSnippet: `Zamestnanec z = new Programator("David"); // Upcasting: automatický

// 1. NEBEZPEČNÝ C-style downcast (při chybě vyhodí InvalidCastException!)
// Programator p1 = (Programator)z;

// 2. BEZPEČNÝ operátor 'as' (při neúspěchu vrátí null)
Programator? p2 = z as Programator;
if (p2 != null) p2.Programuj();

// 3. NEJLEPŠÍ C# Pattern Matching 'is' (otestuje a rovnou naplní proměnnou)
if (z is Programator p3)
{
    p3.Programuj();
}`,
    examTrap: 'Rozdíl (Typ) vs "as": Přímý cast (Typ) vyhodí výjimku InvalidCastException. Operátor "as" nikdy výjimku nevyhodí, pouze vrátí null (lze použít jen na referenční/nullable typy).'
  },

  {
    id: 'fc-inheritance-override-vs-new',
    title: 'Dědičnost: override vs new',
    czechTitle: 'VTABLE vs Statické zastínění (hiding)',
    category: 'oop-theory',
    problemScenario:
      'Zkouškový chyták číslo jedna: Máš třídu `Rodic` a třídu `Potomek : Rodic`. Proměnná je deklarována jako `Rodic r = new Potomek();`. Co se zavolá, pokud je metoda v potomkovi označena jako `override` a co když jako `new`?',
    hint: 'VLEVO (Rodic r) = statický typ pro kompilátor. VPRAVO (new Potomek()) = reálný objekt v RAM. Override přepisuje záznam ve VTABLE!',
    gofRule: 'Polymorfismus se v C# uplatňuje pouze přes klíčová slova virtual / abstract a override.',
    whenToUse: [
      'override: Když chceš skutečný polymorfismus (chování se řídí objektem v RAM).',
      'new: Když v potomkovi náhodou koliduje název metody s předkem z cizí knihovny, kterou nemůžeš měnit (statické zastínění).'
    ],
    whenNotToUse:
      'Klíčové slovo "new" pro zastínění virtuálních metod v novém kódu nikdy nepoužívej – mate čtenáře kódu a rozbíjí polymorfismus.',
    codeSnippet: `public class Rodic
{
    public void Obycejna() => Console.WriteLine("Rodič");
    public virtual void Virtualni() => Console.WriteLine("Rodič");
}

public class Potomek : Rodic
{
    public new void Obycejna() => Console.WriteLine("Potomek (new)");
    public override void Virtualni() => Console.WriteLine("Potomek (override)");
}

// Spuštění se zkouškovou proměnnou:
Rodic r = new Potomek();
r.Obycejna();   // VYPÍŠE: "Rodič" (statická vazba podle typu Rodic vlevo!)
r.Virtualni();  // VYPÍŠE: "Potomek (override)" (dynamická vazba přes VTABLE!)`,
    examTrap: 'Pokud u potomka neuvedeš ani override ani new, kód se zkompiluje s varováním CS0108 a chová se jako "new"!'
  },

  {
    id: 'fc-access-modifiers',
    title: 'Specifikátory přístupu',
    czechTitle: '6 modifikátorů přístupu v C#',
    category: 'oop-theory',
    problemScenario:
      'Jaký je přesný rozdíl mezi `protected internal` a `private protected`? Který z nich představuje logické SJCEDNOCENÍ (OR) a který logický PRŮNIK (AND) podmínek?',
    hint: 'private protected = (potomek) AND (stejný projekt). protected internal = (potomek) OR (stejný projekt).',
    gofRule: 'Zapouzdření (Encapsulation): Chraň vnitřní stav třídy a zpřístupňuj jen to nejnutnější.',
    whenToUse: [
      'Výchozí volba: private pro atributy, public pro veřejné rozhraní.',
      'protected: když potomci potřebují přístup k internímu stavu předka.',
      'internal: pro pomocné třídy v rámci jedné knihovny/projektu.'
    ],
    whenNotToUse:
      'Nikdy nedělej atributy public (porušení zapouzdření) – použij raději auto-vlastnost { get; private set; }.',
    codeSnippet: `// 1. private: Jen uvnitř této třídy (výchozí pro členy!)
private int _tajneCislo;

// 2. protected: V této třídě a ve všech potomcích
protected void ChranenaMetoda() { }

// 3. internal: Kdekoliv v rámci stejného projektu (.dll / assembly)
internal class Pomocnik { }

// 4. protected internal: (potomek kdekoli) OR (cokoliv ve stejném projektu)
protected internal void SirsiPristup() { }

// 5. private protected: (potomek) AND (pouze ve stejném projektu!)
private protected void UzkyPristup() { }

// 6. public: Odkudkoliv bez omezení
public string Jmeno { get; set; }`,
    examTrap: 'Pokud před člen třídy nenapíšeš nic, je automaticky PRIVATE! Pokud nenapíšeš nic před třídu na úrovni namespace, je automaticky INTERNAL!'
  },

  {
    id: 'fc-two-golden-rules-gof',
    title: '2 Zlatá pravidla GoF',
    czechTitle: 'Základní pilíře návrhových vzorů',
    category: 'oop-theory',
    problemScenario:
      'Zkoušející u státnic nebo zkoušky z OONV se zeptá: "Jaká jsou dvě nejdůležitější zlatá pravidla Gang of Four (GoF), ze kterých vychází téměř všechny návrhové vzory?"',
    hint: '1. Proti čemu máme programovat? 2. Co máme upřednostňovat před dědičností?',
    gofRule: 'Pravidlo 1: Programuj proti rozhraní, ne proti implementaci. Pravidlo 2: Upřednostňuj kompozici před dědičností.',
    whenToUse: [
      'Při návrhu jakéhokoliv softwarového systému, mikroslužby i jednotlivé třídy.',
      'Při psaní rozšiřitelného a snadno testovatelného kódu s volnou vazbou (loose coupling).'
    ],
    whenNotToUse:
      'Pravidla platí univerzálně v celém objektově orientovaném návrhu.',
    codeSnippet: `// ZLATÉ PRAVIDLO 1: Programuj proti rozhraní, ne implementaci!
// Špatně (těsná vazba):
// MySQLDatabaze db = new MySQLDatabaze();
// Správně (volná vazba):
IDatabaze db = new MySQLDatabaze();

// ZLATÉ PRAVIDLO 2: Upřednostňuj kompozici před dědičností!
// Špatně (křehká dědičnost):
// public class Auto : Motor, Prevodovka { } // Vícenásobná dědičnost v C# ani nejde
// Správně (kompozice):
public class Auto
{
    private readonly IMotor _motor;             // Auto "MÁ" motor (HAS-A)
    private readonly IPrevodovka _prevodovka;   // Auto "MÁ" převodovku
    public Auto(IMotor m, IPrevodovka p) { _motor = m; _prevodovka = p; }
}`,
    examTrap: 'Vztah IS-A (Dědičnost: Pes JE Zvíře) vytváří nejpevnější možnou vazbu v OOP (změna předka rozbije potomky). Vztah HAS-A (Kompozice: Auto MÁ Motor) umožňuje výměnu motoru za běhu!'
  }
];
