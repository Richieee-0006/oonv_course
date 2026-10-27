import { Pattern } from '../types/patterns';

export const patternsData: Pattern[] = [
  // ==========================================
  // CREATIONAL PATTERNS
  // ==========================================
  {
    id: 'singleton',
    category: 'creational',
    name: 'Singleton',
    czechName: 'Jedináček',
    syllabusWeek: 'Týdny 6–7',
    intent: 'Zajistí, že třída má pouze jedinou instanci v celé aplikaci a poskytuje k ní globální přístupový bod.',
    problem: 'Potřebujete centrální správu sdíleného zdroje (např. konfigurace aplikace, logování, připojení k DB). Běžné volání "new" by vytvořilo pokaždé nový objekt s nekonzistentním stavem.',
    solution: 'Privátní konstruktor zabrání vytvoření objektu zvenčí. Třída obsahuje privátní statickou proměnnou a veřejnou statickou vlastnost Instance s línou inicializací.',
    umlDescription: 'KonfiguraceSingleton: - instance: KonfiguraceSingleton, - KonfiguraceSingleton(), + Instance: KonfiguraceSingleton',
    umlSvgKey: 'singleton',
    participants: [
      { name: 'KonfiguraceSingleton', role: 'Obsahuje privátní statickou instanci, privátní konstruktor a veřejnou statickou vlastnost Instance.' }
    ],
    similarPatterns: [
      { name: 'Factory Method', difference: 'Factory Method vytváří různé instance na základě požadavku, Singleton zaručuje jedinou instanci.' },
      { name: 'Facade', difference: 'Fasáda může být často implementována jako Singleton, protože obvykle stačí jedna fasáda.' }
    ],
    pythonComparisonNote: 'V Pythonu se Singleton často obchází module-level proměnnou (protože modul je v Pythonu importován pouze jednou). V C# je nutná statická třídní konstrukce s privátním konstruktorem.',
    keyTakeaway: 'Zkouškový chyták: Konstruktor MUSÍ být privátní! Pokud chybí private, kompilátor vytvoří veřejný parameterless konstruktor a vzor je porušen.',
    csharpCode: `using System;

public class KonfiguraceSingleton
{
    // 1. Statická proměnná pro uložení jediné instance
    private static KonfiguraceSingleton? _instance;

    // 2. Data konfigurace
    public string NazevAplikace { get; set; }
    public int MaximalniPocetVlaken { get; set; }

    // 3. ZKOUŠKOVÁ PODMÍNKA: Privátní konstruktor zabrání volání 'new' zvenčí!
    private KonfiguraceSingleton()
    {
        NazevAplikace = "C# Kurz 2026";
        MaximalniPocetVlaken = 4;
        Console.WriteLine("[Singleton] Konstruktor inicializován (pouze 1x za běh aplikace).");
    }

    // 4. Globální přístupový bod (Lazy initialization)
    public static KonfiguraceSingleton Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new KonfiguraceSingleton();
            }
            return _instance;
        }
    }

    public void VypisInfo()
    {
        Console.WriteLine($"Aplikace: {NazevAplikace}, Vlákna: {MaximalniPocetVlaken}");
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Získáváme instanci 1:");
        KonfiguraceSingleton k1 = KonfiguraceSingleton.Instance;
        k1.VypisInfo();

        Console.WriteLine("\\nZískáváme instanci 2 a měníme konfiguraci:");
        KonfiguraceSingleton k2 = KonfiguraceSingleton.Instance;
        k2.MaximalniPocetVlaken = 16;

        Console.WriteLine("\\nKontrola instance 1 (obě proměnné ukazují na stejný objekt na Heap):");
        k1.VypisInfo();

        bool jsouStejne = ReferenceEquals(k1, k2);
        Console.WriteLine($"Odkazují k1 a k2 na stejnou paměťovou adresu? {jsouStejne}");
    }
}`
  },

  {
    id: 'factory-method',
    category: 'creational',
    name: 'Factory Method',
    czechName: 'Tovární metoda',
    syllabusWeek: 'Týdny 6–7',
    intent: 'Definuje rozhraní pro vytváření objektu, ale nechává na podtřídách, kterou třídu instanciovat. Umožňuje třídě delegovat instanciaci na podtřídy.',
    problem: 'Třída herního levelu (HerniSvet) potřebuje generovat nepřátele, ale nesmí být pevně svázána s konkrétními třídami (Kostlivec, Zombie). Přidání nového nepřítele by vyžadovalo přepisování existujícího kódu.',
    solution: 'Tvůrce deklaruje abstraktní tovární metodu "VytvorNepritele()", která vrací obecné rozhraní "INepritel". Konkrétní tvůrci (Hrbitov, Balzamovna) tuto metodu přepíšou a vracejí specifické instance.',
    umlDescription: 'HerniSpawner { + SpustVlnu(), # VytvorNepritele(): INepritel } <|-- HrbitovSpawner, BalzamovnaSpawner',
    umlSvgKey: 'factory-method',
    participants: [
      { name: 'INepritel', role: 'Společné rozhraní všech produktů (nepřátel).' },
      { name: 'Kostlivec, Zombie', role: 'Konkrétní produkty implementující INepritel.' },
      { name: 'HerniSpawner', role: 'Abstraktní tvůrce definující abstraktní tovární metodu VytvorNepritele() a obecnou logiku SpustVlnu().' },
      { name: 'HrbitovSpawner', role: 'Konkrétní tvůrce vytvářející instanci Kostlivec.' }
    ],
    similarPatterns: [
      { name: 'Abstract Factory', difference: 'Factory Method vytváří jeden produkt pomocí jedné metody, Abstract Factory vytváří celé rodiny souvisejících produktů.' },
      { name: 'Template Method', difference: 'Factory Method je často specifickou variantou Template Method zaměřenou na tvorbu instancí.' }
    ],
    pythonComparisonNote: 'V Pythonu často stačí předat samotnou třídu jako objekt prvního řádu (first-class citizen). V C# se delegování tvorby řeší polymorfním přepisem virtuální/abstraktní metody v podtřídě.',
    keyTakeaway: 'Zkouškový chyták: Klient volá metodu SpustVlnu(), která uvnitř zavolá VytvorNepritele(). Třída nepoužívá operátor new na konkrétní typ, ale na tovární metodu.',
    csharpCode: `using System;

// 1. Společné rozhraní produktů
public interface INepritel
{
    void Utoc();
}

// 2. Konkrétní produkty
public class Kostlivec : INepritel
{
    public void Utoc() => Console.WriteLine("Kostlivec útočí rezavým mečem! (-15 HP)");
}

public class Zombie : INepritel
{
    public void Utoc() => Console.WriteLine("Zombie kouše a šíří nákazu! (-25 HP)");
}

// 3. Abstraktní tvůrce s tovární metodou
public abstract class HerniSpawner
{
    // Tovární metoda - potomci MUSÍ dodat konkrétní instanci
    public abstract INepritel VytvorNepritele();

    // Hlavní obchodní logika - pracuje pouze s rozhraním INepritel!
    public void SpustVlnu()
    {
        Console.WriteLine("[HerniSpawner] Příprava nové vlny...");
        INepritel potvora = VytvorNepritele();
        potvora.Utoc();
    }
}

// 4. Konkrétní tvůrci
public class HrbitovSpawner : HerniSpawner
{
    public override INepritel VytvorNepritele() => new Kostlivec();
}

public class BalzamovnaSpawner : HerniSpawner
{
    public override INepritel VytvorNepritele() => new Zombie();
}

public class Program
{
    public static void Main()
    {
        HerniSpawner spawner1 = new HrbitovSpawner();
        spawner1.SpustVlnu();

        HerniSpawner spawner2 = new BalzamovnaSpawner();
        spawner2.SpustVlnu();
    }
}`
  },

  {
    id: 'abstract-factory',
    category: 'creational',
    name: 'Abstract Factory',
    czechName: 'Abstraktní továrna',
    syllabusWeek: 'Týdny 6–7',
    intent: 'Poskytuje rozhraní pro vytváření rodin souvisejících nebo závislých objektů bez specifikování jejich konkrétních tříd.',
    problem: 'Aplikace vyrábí sady nábytku (Židle, Stůl, Pohovka) v různých stylech (Moderní, Retro, Gotický). Nesmí dojít k situaci, kdy klient zkombinuje Retro židli s Moderním stolem.',
    solution: 'Definujeme rozhraní INabytekFactory s metodami VytvorZidli() a VytvorStul(). Každá konkrétní továrna (ModerniNabytekFactory, RetroNabytekFactory) garantuje vytvoření vzájemně kompatibilních produktů stejného stylu.',
    umlDescription: 'INabytekFactory <|.. ModerniFactory, RetroFactory; IZidle <|.. ModerniZidle, RetroZidle',
    umlSvgKey: 'abstract-factory',
    participants: [
      { name: 'IZidle, IStul', role: 'Rozhraní pro jednotlivé druhy produktů.' },
      { name: 'ModerniZidle, ModerniStul', role: 'Konkrétní rodina moderního nábytku.' },
      { name: 'RetroZidle, RetroStul', role: 'Konkrétní rodina retro nábytku.' },
      { name: 'INabytekFactory', role: 'Rozhraní továrny deklarující metody pro všechny produkty v rodině.' },
      { name: 'ModerniNabytekFactory', role: 'Konkrétní továrna produkující výhradně moderní sadu.' }
    ],
    similarPatterns: [
      { name: 'Factory Method', difference: 'Factory method vytváří 1 produkt, Abstract Factory vytváří celou ucelenou sadu (rodinu) produktů.' },
      { name: 'Builder', difference: 'Builder staví 1 složitý objekt krok za krokem, Abstract factory vrací hotové rodiny objektů okamžitě.' }
    ],
    pythonComparisonNote: 'V C# typový systém garantuje, že pokud klient pracuje s INabytekFactory, nemůže omylem obdržet nekompatibilní produkty.',
    keyTakeaway: 'Zkouškový chyták: Zákaz míchání stylů! Klient je inicializován jednou továrnou a všechny vytvořené objekty k sobě stylově ladí.',
    csharpCode: `using System;

// 1. Rozhraní produktů rodiny
public interface IZidle
{
    void SedniSi();
}

public interface IStul
{
    void PolozVec(string vec);
}

// 2. Moderní rodina produktů
public class ModerniZidle : IZidle
{
    public void SedniSi() => Console.WriteLine("Sedíte na ergonomické kovové moderní židli.");
}

public class ModerniStul : IStul
{
    public void PolozVec(string vec) => Console.WriteLine($"Pokládám '{vec}' na skleněný moderní stůl.");
}

// 3. Retro rodina produktů
public class RetroZidle : IZidle
{
    public void SedniSi() => Console.WriteLine("Sedíte na čalouněné vyřezávané retro židli.");
}

public class RetroStul : IStul
{
    public void PolozVec(string vec) => Console.WriteLine($"Pokládám '{vec}' na masivní dřevěný retro stůl.");
}

// 4. Abstraktní továrna
public interface INabytekFactory
{
    IZidle VytvorZidli();
    IStul VytvorStul();
}

// 5. Konkrétní továrny garantující kompatibilitu rodiny
public class ModerniNabytekFactory : INabytekFactory
{
    public IZidle VytvorZidli() => new ModerniZidle();
    public IStul VytvorStul() => new ModerniStul();
}

public class RetroNabytekFactory : INabytekFactory
{
    public IZidle VytvorZidli() => new RetroZidle();
    public IStul VytvorStul() => new RetroStul();
}

// 6. Klientský kód - pracuje výhradně přes rozhraní
public class ObyvaciPokoj
{
    private readonly IZidle _zidle;
    private readonly IStul _stul;

    public ObyvaciPokoj(INabytekFactory tovarna)
    {
        _zidle = tovarna.VytvorZidli();
        _stul = tovarna.VytvorStul();
    }

    public void OtestovatPokoj()
    {
        _zidle.SedniSi();
        _stul.PolozVec("Notebook");
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("--- Vybavení moderního pokoje ---");
        ObyvaciPokoj moderni = new ObyvaciPokoj(new ModerniNabytekFactory());
        moderni.OtestovatPokoj();

        Console.WriteLine("\\n--- Vybavení retro pokoje ---");
        ObyvaciPokoj retro = new ObyvaciPokoj(new RetroNabytekFactory());
        retro.OtestovatPokoj();
    }
}`
  },

  {
    id: 'builder',
    category: 'creational',
    name: 'Builder',
    czechName: 'Stavitel',
    syllabusWeek: 'Týdny 6–7',
    intent: 'Odděluje konstrukci složitého objektu od jeho reprezentace, takže stejný konstrukční proces může vytvářet různé reprezentace. Řeší problém teleskopických konstruktorů.',
    problem: 'Třída Pocitac má 10 parametrů (CPU, RAM, GPU, SSD, vodní chlazení, RGB...). Vytváření konstruktorů se všemi kombinacemi parametrů (telescopic constructors) vede k nepřehlednému a chybovému kódu.',
    solution: 'Vytvoříme samostatný objekt Stavitel (PocitacBuilder), který umožňuje konfigurovat jednotlivé části krok za krokem pomocí řetězení metod (fluent interface) a finálně zavolat .Build().',
    umlDescription: 'Director o-> IPocitacBuilder <|.. HerniPocitacBuilder; PocitacBuilder -> Pocitac',
    umlSvgKey: 'builder',
    participants: [
      { name: 'Pocitac', role: 'Složitý výsledný produkt s mnoha komponenty.' },
      { name: 'IPocitacBuilder', role: 'Rozhraní stavitele s jednotlivými konfiguračními kroky.' },
      { name: 'HerniPocitacBuilder', role: 'Konkrétní stavitel, metody vracejí "this" pro plynulé řetězení (Fluent syntax).' }
    ],
    similarPatterns: [
      { name: 'Abstract Factory', difference: 'Abstract Factory vytváří hotový objekt v jediném kroku, Builder ho staví postupně v sérii volitelných kroků.' },
      { name: 'Composite', difference: 'Builder se často používá k postupnému sestavování stromových struktur Composite.' }
    ],
    pythonComparisonNote: 'V Pythonu se často využívají pojmenované volitelné parametry s výchozími hodnotami def __init__(self, cpu="i5", ram=16...). V C# je Builder idiomatickým vzorem pro immutabilitu a validaci.',
    keyTakeaway: 'Fluent interface: Každá metoda stavitele vrací "this", což umožňuje řetězit .NastavCPU().NastavRAM().Build().',
    csharpCode: `using System;

// 1. Výsledný složitý produkt
public class Pocitac
{
    public string Procesor { get; set; } = "Základní CPU";
    public int RamGb { get; set; } = 8;
    public string GrafickaKarta { get; set; } = "Integrovaná GPU";
    public int DiskGb { get; set; } = 256;
    public bool MaVodniChlazeni { get; set; } = false;

    public void VypisSpecifikaci()
    {
        Console.WriteLine($"PC: {Procesor}, RAM: {RamGb}GB, GPU: {GrafickaKarta}, SSD: {DiskGb}GB, Vodník: {MaVodniChlazeni}");
    }
}

// 2. Stavitel s plynulým rozhraním (Fluent API)
public class PocitacBuilder
{
    private Pocitac _pocitac = new Pocitac();

    public PocitacBuilder NastavProcesor(string cpu)
    {
        _pocitac.Procesor = cpu;
        return this; // Umožňuje řetězení metod
    }

    public PocitacBuilder NastavRam(int ramGb)
    {
        _pocitac.RamGb = ramGb;
        return this;
    }

    public PocitacBuilder NastavGrafiku(string gpu)
    {
        _pocitac.GrafickaKarta = gpu;
        return this;
    }

    public PocitacBuilder NastavDisk(int diskGb)
    {
        _pocitac.DiskGb = diskGb;
        return this;
    }

    public PocitacBuilder PridatVodniChlazeni()
    {
        _pocitac.MaVodniChlazeni = true;
        return this;
    }

    // Finální vytvoření
    public Pocitac Build()
    {
        Pocitac hotovy = _pocitac;
        _pocitac = new Pocitac(); // Reset pro další stavbu
        return hotovy;
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Stavba kancelářského PC:");
        Pocitac kancl = new PocitacBuilder()
            .NastavProcesor("Intel i3")
            .NastavRam(8)
            .NastavDisk(512)
            .Build();
        kancl.VypisSpecifikaci();

        Console.WriteLine("\\nStavba herního děla s vodním chlazením:");
        Pocitac delo = new PocitacBuilder()
            .NastavProcesor("AMD Ryzen 7 7800X3D")
            .NastavRam(32)
            .NastavGrafiku("NVIDIA RTX 4080")
            .NastavDisk(2000)
            .PridatVodniChlazeni()
            .Build();
        delo.VypisSpecifikaci();
    }
}`
  },

  // ==========================================
  // STRUCTURAL PATTERNS
  // ==========================================
  {
    id: 'adapter',
    category: 'structural',
    name: 'Adapter',
    czechName: 'Adaptér',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Umožňuje objektům s nekompatibilními rozhraními spolupracovat tím, že obalí existující třídu a převede její volání do formátu očekávaného klientem.',
    problem: 'Náš e-shop komunikuje s platebními branami přes rozhraní "IPlatebniBrana" (metoda ZaplatKc(castka)). Chceme integrovat externí knihovnu PayPal/CryptoService, která však používá metodu "MakePaymentUsd(dollars)" s cizí měnou.',
    solution: 'Vytvoříme třídu PayPalAdapter implementující IPlatebniBrana, která v sobě drží referenci na PayPalService (objektový adaptér), nebo z ní přímo dědí (třídní adaptér), a provádí přepočet kurzu a přesměrování volání.',
    umlDescription: 'IPlatebniBrana <|.. PayPalAdapter o-> PayPalService',
    umlSvgKey: 'adapter',
    participants: [
      { name: 'IPlatebniBrana', role: 'Cílové rozhraní vyžadované klientem e-shopu.' },
      { name: 'PayPalService', role: 'Přizpůsobovaná cizí třída (Adaptee) s nekompatibilním rozhraním.' },
      { name: 'PayPalAdapter (Objektový)', role: 'Implementuje IPlatebniBrana a drží referenci na Adaptee v privátním poli (kompozice).' },
      { name: 'TridniAdapter (Třídní)', role: 'V C# dědí z Adaptee a současně implementuje rozhraní (: Adaptee, ITarget).' }
    ],
    similarPatterns: [
      { name: 'Bridge', difference: 'Bridge se navrhuje dopředu, aby oddělil abstrakci od implementace. Adapter se obvykle přidává dodatečně pro spojení nekompatibilního existujícího kódu.' },
      { name: 'Decorator', difference: 'Decorator nemění rozhraní, pouze přidává chování. Adapter rozhraní cíleně mění a transformuje.' },
      { name: 'Proxy', difference: 'Proxy poskytuje naprosto stejné rozhraní bez transformace a řídí přístup.' }
    ],
    pythonComparisonNote: 'V Pythonu se díky duck-typingu adaptér někdy simuluje dynamickým monkey-patchingem nebo getattr. V C# je vyžadována explicitní implementace rozhraní.',
    keyTakeaway: 'Zkouškový chyták: Rozdíl mezi objektovým (kompozice) a třídním adaptérem (vícenásobná dědičnost v C# povolena pouze jako 1 třída + N rozhraní).',
    csharpCode: `using System;

// 1. Cílové rozhraní našeho systému
public interface IPlatebniBrana
{
    void ZaplatKc(decimal castka);
}

// 2. Adaptee: Cizí nekompatibilní knihovna (např. balíček z NuGetu)
public class PayPalService
{
    public void SendPaymentInUsd(decimal dollars)
    {
        Console.WriteLine($"[PayPal API] Strženo {dollars:F2} USD z účtu zákazníka.");
    }
}

// 3A. OBJEKTOVÝ ADAPTÉR (Upřednostňovaný - kompozice)
public class PayPalAdapter : IPlatebniBrana
{
    private readonly PayPalService _payPal;
    private const decimal KurzUsdKc = 23.5m;

    public PayPalAdapter(PayPalService payPal)
    {
        _payPal = payPal;
    }

    public void ZaplatKc(decimal castka)
    {
        decimal dollars = castka / KurzUsdKc;
        Console.WriteLine($"[Adapter] Převod {castka} Kč na {dollars:F2} USD...");
        _payPal.SendPaymentInUsd(dollars);
    }
}

// 3B. TŘÍDNÍ ADAPTÉR (Dědí z Adaptee + implementuje rozhraní)
public class TridniPayPalAdapter : PayPalService, IPlatebniBrana
{
    private const decimal KurzUsdKc = 23.5m;

    public void ZaplatKc(decimal castka)
    {
        decimal dollars = castka / KurzUsdKc;
        Console.WriteLine($"[Třídní adaptér] Přímé volání zděděné metody předka SendPaymentInUsd...");
        SendPaymentInUsd(dollars);
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("--- Test 1: Objektový adaptér ---");
        PayPalService ciziSluzba = new PayPalService();
        IPlatebniBrana brana1 = new PayPalAdapter(ciziSluzba);
        brana1.ZaplatKc(470); // 470 Kč = 20 USD

        Console.WriteLine("\\n--- Test 2: Třídní adaptér ---");
        IPlatebniBrana brana2 = new TridniPayPalAdapter();
        brana2.ZaplatKc(940); // 940 Kč = 40 USD
    }
}`
  },

  {
    id: 'proxy',
    category: 'structural',
    name: 'Proxy',
    czechName: 'Zástupce',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Poskytuje zástupný objekt nebo náhradu za jiný objekt k řízení přístupu k němu, línému načítání, logování nebo cachování.',
    problem: 'Třída SkutecnaDatabaze při inicializaci navazuje těžké síťové spojení do cloudu a stahuje gigabajty dat. Nemůžeme ji vytvářet zbytečně, a navíc k ní nesmí mít přístup neautorizovaný uživatel (Host).',
    solution: 'Zástupce (DatabazeProxy) implementuje přesně stejné rozhraní IDatabaze jako skutečný objekt. Zkontroluje roli uživatele (Protection proxy), odloží vytvoření skutečné DB až na první dotaz (Virtual/Lazy proxy) a výsledky uloží do mezipaměti (Caching proxy).',
    umlDescription: 'IDatabaze <|.. DatabazeProxy o-> SkutecnaDatabaze; IDatabaze <|.. SkutecnaDatabaze',
    umlSvgKey: 'proxy',
    participants: [
      { name: 'IDatabaze', role: 'Společné rozhraní pro RealSubject i Proxy.' },
      { name: 'SkutecnaDatabaze', role: 'Skutečný náročný objekt (RealSubject).' },
      { name: 'DatabazeProxy', role: 'Zástupce řídící přístup, lazy alokaci a cache.' }
    ],
    similarPatterns: [
      { name: 'Adapter', difference: 'Adapter mění rozhraní objektu. Proxy zachovává identické rozhraní.' },
      { name: 'Decorator', difference: 'Decorator přidává nové odpovědnosti a dynamicky se skládá zvenčí. Proxy řídí přístup a životní cyklus svého subjektu.' }
    ],
    pythonComparisonNote: 'V Pythonu se proxy často realizuje přes magické metody __getattr__ nebo dekorátory funkcí. V C# je proxy silně typovaný objekt realizující stejný interface.',
    keyTakeaway: 'Zkouškový chyták: 3 typy proxy v jednom: 1. Protection (kontrola oprávnění), 2. Virtual (líná inicializace až při volání), 3. Caching (vrácení výsledku bez opakovaného dotazu).',
    csharpCode: `using System;

// 1. Společné rozhraní
public interface IDatabaze
{
    string? NactiTajnaData();
}

// 2. Skutečný těžký objekt (Real Subject)
public class SkutecnaDatabaze : IDatabaze
{
    public SkutecnaDatabaze()
    {
        Console.WriteLine("[SkutecnaDatabaze] TĚŽKÁ INICIALIZACE: Navazuji TLS spojení k SQL serveru...");
    }

    public string NactiTajnaData()
    {
        Console.WriteLine("[SkutecnaDatabaze] Provádím náročný SQL SELECT...");
        return "TopSecretData: Zisk firmy za rok 2026 je 42 000 000 Kč.";
    }
}

// 3. Zástupce (Proxy) s ochranou, líným načtením a mezipamětí
public class DatabazeProxy : IDatabaze
{
    private SkutecnaDatabaze? _skutecnaDb;
    private readonly string _roleUzivatele;
    private string? _kesovanaData;

    public DatabazeProxy(string roleUzivatele)
    {
        _roleUzivatele = roleUzivatele;
    }

    public string? NactiTajnaData()
    {
        // A) PROTECTION PROXY: Kontrola oprávnění
        if (_roleUzivatele != "Admin")
        {
            Console.WriteLine($"[Proxy] PŘÍSTUP ODEPŘEN! Uživatel s rolí '{_roleUzivatele}' nemá oprávnění.");
            return null;
        }

        // B) CACHING PROXY: Pokud už data máme, neobtěžujeme skutečnou DB
        if (_kesovanaData != null)
        {
            Console.WriteLine("[Proxy] BLESKOVÁ ODPOVĚĎ Z CACHE (databáze nebyla kontaktována).");
            return _kesovanaData;
        }

        // C) VIRTUAL / LAZY PROXY: Vytvoří skutečný objekt až při prvním oprávněném požadavku!
        if (_skutecnaDb == null)
        {
            Console.WriteLine("[Proxy] První požadavek: Vytvářím instanci SkutecnaDatabaze...");
            _skutecnaDb = new SkutecnaDatabaze();
        }

        _kesovanaData = _skutecnaDb.NactiTajnaData();
        return _kesovanaData;
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("=== Pokus 1: Host se pokouší číst data ===");
        IDatabaze hostDb = new DatabazeProxy("Host");
        hostDb.NactiTajnaData(); // Přístup zamítnut, skutečná DB se vůbec nevytvoří!

        Console.WriteLine("\\n=== Pokus 2: Admin čte data poprvé ===");
        IDatabaze adminDb = new DatabazeProxy("Admin");
        string? d1 = adminDb.NactiTajnaData();
        Console.WriteLine($"Výsledek: {d1}");

        Console.WriteLine("\\n=== Pokus 3: Admin čte data podruhé ===");
        string? d2 = adminDb.NactiTajnaData();
        Console.WriteLine($"Výsledek: {d2}");
    }
}`
  },

  {
    id: 'decorator',
    category: 'structural',
    name: 'Decorator',
    czechName: 'Dekorátor',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Dynamicky přidává objektu nové chování a zodpovědnosti tím, že ho zabalí do obalovacích objektů (jako slupky cibule nebo matrjoška), aniž by měnil původní třídu.',
    problem: 'V kavárně máme základní nápoje (Espresso, Čaj) a desítky možných přísad (Mléko, Karamel, Šlehačka, Vanilka). Vytvoření podtřídy pro každou kombinaci (EspressoSMlekemAKaramelem) způsobí explozi tříd (desítky tříd).',
    solution: 'Základní komponent i dekorátory implementují rozhraní IKava. Abstraktní KavaDecorator obsahuje chráněné pole s referencí na vnitřní IKava. Jednotlivé dekorátory delegují volání dovnitř a přičítají svou cenu.',
    umlDescription: 'IKava <|.. Espresso; IKava <|.. KavaDecorator o-> IKava; KavaDecorator <|-- MlekoDecorator, KaramelDecorator',
    umlSvgKey: 'decorator',
    participants: [
      { name: 'IKava', role: 'Rozhraní komponenty definující SpocitejCenu() a ZiskejPopis().' },
      { name: 'Espresso', role: 'Konkrétní základní komponenta.' },
      { name: 'KavaDecorator', role: 'Abstraktní základ dekorátorů držící vnitřní zabalenou IKava.' },
      { name: 'MlekoDecorator, KaramelDecorator', role: 'Konkrétní dekorátory přidávající cenu a modifikující popis.' }
    ],
    similarPatterns: [
      { name: 'Adapter', difference: 'Adapter mění rozhraní na jiné. Decorator zachovává stejné rozhraní a rozšiřuje chování.' },
      { name: 'Composite', difference: 'Decorator lze vnímat jako degenerovaný Composite s právě jedním potomkem.' },
      { name: 'Proxy', difference: 'Proxy řídí přístup/životní cyklus, Decorator rekurzivně vrství chování.' }
    ],
    pythonComparisonNote: 'V Pythonu existují funkcionální dekorátory s operátorem @fn. Návrhový vzor Decorator v OOP (GoF) je však objektový kompoziční vzor obalující instance za běhu programu.',
    keyTakeaway: 'Zkouškový chyták: Slupky cibule - pořadí balení! new KaramelDecorator(new MlekoDecorator(new Espresso())) postupně zavolá Espresso -> Mléko -> Karamel.',
    csharpCode: `using System;

// 1. Společné rozhraní komponenty
public interface IKava
{
    string ZiskejPopis();
    decimal SpocitejCenu();
}

// 2. Konkrétní základní nápoj
public class Espresso : IKava
{
    public string ZiskejPopis() => "Espresso";
    public decimal SpocitejCenu() => 50m;
}

// 3. Abstraktní dekorátor držící referenci na vnitřní kávu
public abstract class KavaDecorator : IKava
{
    protected readonly IKava _vnitrniKava;

    protected KavaDecorator(IKava kava)
    {
        _vnitrniKava = kava;
    }

    public virtual string ZiskejPopis() => _vnitrniKava.ZiskejPopis();
    public virtual decimal SpocitejCenu() => _vnitrniKava.SpocitejCenu();
}

// 4. Konkrétní dekorátory
public class MlekoDecorator : KavaDecorator
{
    public MlekoDecorator(IKava kava) : base(kava) {}

    public override string ZiskejPopis() => _vnitrniKava.ZiskejPopis() + " + Mléko";
    public override decimal SpocitejCenu() => _vnitrniKava.SpocitejCenu() + 15m;
}

public class KaramelDecorator : KavaDecorator
{
    public KaramelDecorator(IKava kava) : base(kava) {}

    public override string ZiskejPopis() => _vnitrniKava.ZiskejPopis() + " + Karamelový sirup";
    public override decimal SpocitejCenu() => _vnitrniKava.SpocitejCenu() + 20m;
}

public class Program
{
    public static void Main()
    {
        // Obyčejné espresso
        IKava obycejne = new Espresso();
        Console.WriteLine($"{obycejne.ZiskejPopis()} -> {obycejne.SpocitejCenu()} Kč");

        // Espresso s mlékem a dvojitým karamelem (obalování jako cibule!)
        IKava luxusni = new KaramelDecorator(
            new KaramelDecorator(
                new MlekoDecorator(
                    new Espresso()
                )
            )
        );

        Console.WriteLine($"{luxusni.ZiskejPopis()} -> {luxusni.SpocitejCenu()} Kč");
    }
}`
  },

  {
    id: 'bridge',
    category: 'structural',
    name: 'Bridge',
    czechName: 'Most',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Odděluje abstrakci od její implementace, takže obojí se může vyvíjet a měnit nezávisle na sobě bez nutnosti kartézského násobení podtříd.',
    problem: 'Máme tvary (Kruh, Ctverec) a barvy (Cervena, Modra). Pokud bychom použili dědičnost, potřebujeme třídy CervenyKruh, ModryKruh, CervenyCtverec, ModryCtverec (2x2=4 třídy). Přidání dalšího tvaru a 2 barev způsobí exponenciální růst (4x3=12 tříd).',
    solution: 'Převedeme vztah z dědičnosti na kompozici: Tvar (abstrakce) drží v chráněném poli referenci na IBarva (implementace). Mezi nimi vznikne kompoziční "most".',
    umlDescription: 'Tvar o-> IBarva; Tvar <|-- Kruh, Ctverec; IBarva <|.. Cervena, Modra',
    umlSvgKey: 'bridge',
    participants: [
      { name: 'Tvar', role: 'Abstrakce držící referenci na rozhraní IBarva.' },
      { name: 'Kruh, Ctverec', role: 'Zpřesněná abstrakce (Refined Abstraction).' },
      { name: 'IBarva', role: 'Rozhraní implementátora.' },
      { name: 'CervenaBarva, ModraBarva', role: 'Konkrétní implementátoři.' }
    ],
    similarPatterns: [
      { name: 'Adapter', difference: 'Adapter řeší propojení až po napsání kódu. Bridge se navrhuje dopředu jako architektura rozdělení na dvě osy změn.' },
      { name: 'Strategy', difference: 'Strukturálně jsou identické, ale Bridge spojuje dvě hierarchie tříd, zatímco Strategy řeší výměnu algoritmu.' }
    ],
    pythonComparisonNote: 'V C# je Bridge klíčovým architektonickým nástrojem např. v GUI knihovnách (Window na Windows vs Window na Linuxu používají společnou abstrakci a systémové bridge renderery).',
    keyTakeaway: 'Zamezuje kombinatorické explozi tříd (M x N podtříd se redukuje na pouhých M + N tříd).',
    csharpCode: `using System;

// 1. Rozhraní implementátora (osa barev)
public interface IBarva
{
    string AplikujBarvu();
}

public class CervenaBarva : IBarva
{
    public string AplikujBarvu() => "červenou barvou";
}

public class ModraBarva : IBarva
{
    public string AplikujBarvu() => "modrou barvou";
}

// 2. Abstrakce (osa tvarů) propojená mostem na implementátora
public abstract class Tvar
{
    // MOST: reference na rozhraní implementátora
    protected readonly IBarva _barva;

    protected Tvar(IBarva barva)
    {
        _barva = barva;
    }

    public abstract void Vykresli();
}

// 3. Zpřesněné abstrakce
public class Kruh : Tvar
{
    private readonly double _polomer;

    public Kruh(double polomer, IBarva barva) : base(barva)
    {
        _polomer = polomer;
    }

    public override void Vykresli()
    {
        Console.WriteLine($"Vykresluji kruh o poloměru {_polomer} {_barva.AplikujBarvu()}.");
    }
}

public class Ctverec : Tvar
{
    private readonly double _strana;

    public Ctverec(double strana, IBarva barva) : base(barva)
    {
        _strana = strana;
    }

    public override void Vykresli()
    {
        Console.WriteLine($"Vykresluji čtverec o straně {_strana} {_barva.AplikujBarvu()}.");
    }
}

public class Program
{
    public static void Main()
    {
        // Libovolná kombinace tvaru a barvy za běhu bez vytváření nových tříd!
        IBarva cervena = new CervenaBarva();
        IBarva modra = new ModraBarva();

        Tvar cervenyKruh = new Kruh(5.0, cervena);
        Tvar modryCtverec = new Ctverec(10.0, modra);

        cervenyKruh.Vykresli();
        modryCtverec.Vykresli();
    }
}`
  },

  {
    id: 'flyweight',
    category: 'structural',
    name: 'Flyweight',
    czechName: 'Muší váha',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Umožňuje efektivně pracovat s obrovským množstvím objektů tím, že sdílí společné části stavu napříč objekty namísto ukládání všech dat do každého z nich.',
    problem: 'Ve hře máme les s 1 000 000 stromy. Každý strom má 3D model a texturu listů (10 MB). Pokud by každý strom byl samostatným objektem se všemi daty, hra by spotřebovala 10 GB RAM a spadla na OutOfMemoryException.',
    solution: 'Rozdělíme stav objektu na dvě části: 1. Vnitřní stav (Intrinsic) = neměnný, sdílený (DruhStromu s texturou, barvou a názvem uložený v tovární cache); 2. Vnější stav (Extrinsic) = unikátní (souřadnice X, Y na mapě).',
    umlDescription: 'Les o-> Strom o-> DruhStromuFactory o-> DruhStromu (Flyweight)',
    umlSvgKey: 'flyweight',
    participants: [
      { name: 'DruhStromu (Flyweight)', role: 'Obsahuje těžký, sdílený vnitřní stav (název, barva, textura).' },
      { name: 'DruhStromuFactory', role: 'Továrna spravující cache existujících flyweightů v Dictionary.' },
      { name: 'Strom (Context)', role: 'Lehký objekt obsahující unikátní vnější stav (X, Y) a referenci na Flyweight.' }
    ],
    similarPatterns: [
      { name: 'Singleton', difference: 'Singleton má v celé aplikaci přesně 1 instanci. Flyweight má více sdílených instancí (např. 1 pro dub, 1 pro smrk).' },
      { name: 'Composite', difference: 'Listy ve stromu Composite mohou být často reprezentovány jako sdílené Flyweight objekty pro úsporu RAM.' }
    ],
    pythonComparisonNote: 'V Pythonu se úspora paměti často řeší přes __slots__. V C# se vzor Flyweight používá např. při formátování znaků v textových editorech nebo ve hrách.',
    keyTakeaway: 'Zkouškový chyták: Rozlišení Intrinsic (vnitřní sdílený) vs. Extrinsic (vnější unikátní předávaný do metody).',
    csharpCode: `using System;
using System.Collections.Generic;

// 1. FLYWEIGHT: Vnitřní stav (Intrinsic) - těžká sdílená data
public class DruhStromu
{
    public string Nazev { get; }
    public string BarvaListi { get; }
    public string Textura { get; }

    public DruhStromu(string nazev, string barvaListi, string textura)
    {
        Nazev = nazev;
        BarvaListi = barvaListi;
        Textura = textura;
        Console.WriteLine($"[Flyweight] Vytvořena těžká instance pro '{nazev}' (alokováno 10MB textury).");
    }

    // Metoda přijímá vnější stav (Extrinsic) jako parametry
    public void Vykresli(int x, int y)
    {
        Console.WriteLine($"Vykreslen {Nazev} na [{x},{y}] s texturou {Textura}.");
    }
}

// 2. TOVÁRNA FLYWEIGHTŮ: Zajišťuje sdílení a cache
public static class TovarnaNaDruhyStromu
{
    private static readonly Dictionary<string, DruhStromu> _druhy = new();

    public static DruhStromu ZiskejDruh(string nazev, string barva, string textura)
    {
        if (!_druhy.TryGetValue(nazev, out DruhStromu? druh))
        {
            druh = new DruhStromu(nazev, barva, textura);
            _druhy[nazev] = druh;
        }
        return druh;
    }
}

// 3. KONTEXTOVÝ OBJEKT: Lehký, nese pouze souřadnice a referenci
public class Strom
{
    public int X { get; }
    public int Y { get; }
    private readonly DruhStromu _druh;

    public Strom(int x, int y, DruhStromu druh)
    {
        X = x;
        Y = y;
        _druh = druh;
    }

    public void Vykresli() => _druh.Vykresli(X, Y);
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Sázíme 1 000 000 stromů do lesa...");
        List<Strom> les = new List<Strom>();

        // Získáme pouze 2 sdílené instance pro celý les!
        DruhStromu dub = TovarnaNaDruhyStromu.ZiskejDruh("Dub letní", "Zelená", "dub_texture_4k.png");
        DruhStromu smrk = TovarnaNaDruhyStromu.ZiskejDruh("Smrk ztepilý", "Tmavě zelená", "smrk_texture_4k.png");

        // Tisíce stromů sdílejí stejné dvě adresy v RAM
        les.Add(new Strom(10, 20, dub));
        les.Add(new Strom(15, 25, dub));
        les.Add(new Strom(50, 80, smrk));

        foreach (var strom in les)
        {
            strom.Vykresli();
        }

        Console.WriteLine($"Počet unikátních flyweightů v paměti: 2. Všech stromů v lese: {les.Count}.");
    }
}`
  },

  {
    id: 'facade',
    category: 'structural',
    name: 'Facade',
    czechName: 'Fasáda',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Poskytuje zjednodušené rozhraní ke složitému subsystému tříd, knihovně nebo frameworku.',
    problem: 'Konverze videa vyžaduje desítku složitých kroků: inicializaci dekodéru, načtení audio stopy, kompresi, nastavení bitratu a synchronizaci multiplexeru. Klient chce pouze převést soubor jedním voláním.',
    solution: 'Fasáda (VideoKonvertorFasada) zapouzdří inicializaci a koordinaci všech subsystémů do jednoduché metody PrevedVideo(nazev, format).',
    umlDescription: 'Klient -> VideoKonvertorFasada -> (ZvukovyDekoder, VideoKodek, BitrateKompresor)',
    umlSvgKey: 'facade',
    participants: [
      { name: 'VideoKonvertorFasada', role: 'Zjednodušené vysoké rozhraní pro klienta.' },
      { name: 'ZvukovyDekoder, VideoKodek, Kompresor', role: 'Komplexní vnitřní třídy subsystému.' }
    ],
    similarPatterns: [
      { name: 'Adapter', difference: 'Adapter přizpůsobuje jedno nekompatibilní rozhraní. Facade definuje zcela nové zjednodušené rozhraní pro celý subsystém.' },
      { name: 'Mediator', difference: 'Mediator koordinuje komunikaci mezi kolegy navzájem. Facade komunikuje pouze jednosměrně z klienta do subsystému.' }
    ],
    pythonComparisonNote: 'V C# se Fasáda často kombinuje se Singletonem nebo dependency injection kontejnerem.',
    keyTakeaway: 'Jedno jednoduché tlačítko pro klienta, které uvnitř orchestrueje desítky složitých tříd.',
    csharpCode: `using System;

// 1. Složité vnitřní třídy subsystému
public class ZvukovyDekoder
{
    public void NactiAudioStopu(string soubor) => Console.WriteLine($"[Audio] Načítám zvuk ze souboru {soubor}...");
    public void NastavVzorkovani(int hz) => Console.WriteLine($"[Audio] Vzorkování nastaveno na {hz} Hz.");
}

public class VideoKodek
{
    public void DekodujObraz(string soubor) => Console.WriteLine($"[Video] Dekóduji video stream z {soubor}...");
    public void EnkodujDoFormatu(string format) => Console.WriteLine($"[Video] Překódovávám do výstupního formátu {format}...");
}

public class Kompresor
{
    public void AplikujKompresi(int uroven) => Console.WriteLine($"[Kompresor] Aplikována úroveň komprese {uroven}/10.");
}

// 2. FASÁDA: Jednoduché rozhraní pro klienta
public class VideoKonvertorFasada
{
    private readonly ZvukovyDekoder _audio = new();
    private readonly VideoKodek _video = new();
    private readonly Kompresor _kompresor = new();

    public void PrevedVideo(string soubor, string cilovyFormat)
    {
        Console.WriteLine($"=== Zahájení konverze souboru '{soubor}' do '{cilovyFormat}' ===");
        _audio.NactiAudioStopu(soubor);
        _audio.NastavVzorkovani(44100);

        _video.DekodujObraz(soubor);
        _video.EnkodujDoFormatu(cilovyFormat);

        _kompresor.AplikujKompresi(8);
        Console.WriteLine($"=== Konverze úspěšně dokončena! Výsledný soubor je připraven. ===\\n");
    }
}

public class Program
{
    public static void Main()
    {
        // Klient nemusí vědět nic o kodecích, audiu ani kompresi!
        VideoKonvertorFasada fasada = new VideoKonvertorFasada();
        fasada.PrevedVideo("dovolena_2026.avi", "mp4");
    }
}`
  },

  {
    id: 'composite',
    category: 'structural',
    name: 'Composite',
    czechName: 'Kompozit',
    syllabusWeek: 'Týdny 8–9',
    intent: 'Umožňuje skládat objekty do stromových struktur pro reprezentaci hierarchií část-celek. Umožňuje klientům zacházet s jednotlivými objekty i složeninami jednotným způsobem.',
    problem: 'V souborovém systému máme soubory (listy) a složky (kontejnery). Složka může obsahovat další složky i soubory. Klient chce spočítat celkovou velikost nebo vypsat obsah bez toho, aby musel rozlišovat if (polozka is Slozka) else...',
    solution: 'Definujeme rozhraní ISouborovaPolozka s metodou ZiskejVelikostMb() a Vypis(odsazeni). Soubor i Složka implementují toto rozhraní. Složka ve svých metodách rekurzivně volá své podpoložky.',
    umlDescription: 'ISouborovaPolozka <|.. Soubor; ISouborovaPolozka <|.. Slozka o-> ISouborovaPolozka',
    umlSvgKey: 'composite',
    participants: [
      { name: 'ISouborovaPolozka', role: 'Společné rozhraní pro listy i kontejnery.' },
      { name: 'Soubor (Leaf)', role: 'Koncový prvek stromu bez potomků.' },
      { name: 'Slozka (Composite)', role: 'Kontejner obsahující seznam prvků typu ISouborovaPolozka.' }
    ],
    similarPatterns: [
      { name: 'Decorator', difference: 'Decorator má právě jednoho potomka a přidává chování. Composite organizuje libovolný počet dětí do stromu.' },
      { name: 'Iterator', difference: 'Iterator se často používá k procházení prvků stromové struktury Composite.' }
    ],
    pythonComparisonNote: 'V C# je stromová struktura přísně typovaná přes rozhraní ISouborovaPolozka, což zaručuje polymorfní výpočet velikosti bez přetypování.',
    keyTakeaway: 'Jednotné zacházení: Klient volá metodu na kořenovém prvku a hierarchie se rekurzivně spočítá sama.',
    csharpCode: `using System;
using System.Collections.Generic;

// 1. Společné rozhraní komponenty
public interface ISouborovaPolozka
{
    string Nazev { get; }
    double ZiskejVelikostMb();
    void Vypis(int odsazeni);
}

// 2. List (Leaf) - koncový prvek
public class Soubor : ISouborovaPolozka
{
    public string Nazev { get; }
    private readonly double _velikostMb;

    public Soubor(string nazev, double velikostMb)
    {
        Nazev = nazev;
        _velikostMb = velikostMb;
    }

    public double ZiskejVelikostMb() => _velikostMb;

    public void Vypis(int odsazeni)
    {
        Console.WriteLine($"{new string(' ', odsazeni * 2)}📄 {Nazev} ({_velikostMb} MB)");
    }
}

// 3. Kompozit (Composite) - kontejner obsahující podpoložky
public class Slozka : ISouborovaPolozka
{
    public string Nazev { get; }
    private readonly List<ISouborovaPolozka> _polozky = new();

    public Slozka(string nazev)
    {
        Nazev = nazev;
    }

    public void Pridej(ISouborovaPolozka polozka)
    {
        _polozky.Add(polozka);
    }

    public double ZiskejVelikostMb()
    {
        // Rekurzivní součet velikostí všech vnořených položek
        double suma = 0;
        foreach (var p in _polozky)
        {
            suma += p.ZiskejVelikostMb();
        }
        return suma;
    }

    public void Vypis(int odsazeni)
    {
        Console.WriteLine($"{new string(' ', odsazeni * 2)}📁 [{Nazev}] - celkem {ZiskejVelikostMb()} MB");
        foreach (var p in _polozky)
        {
            p.Vypis(odsazeni + 1);
        }
    }
}

public class Program
{
    public static void Main()
    {
        Slozka root = new Slozka("C:\\\\Projekt");
        root.Pridej(new Soubor("Program.cs", 0.05));
        root.Pridej(new Soubor("README.md", 0.01));

        Slozka subFolder = new Slozka("Assets");
        subFolder.Pridej(new Soubor("logo.png", 2.5));
        subFolder.Pridej(new Soubor("zvuk.mp3", 4.8));

        root.Pridej(subFolder);

        // Klient zachází se složkou i se soubory jednotně:
        root.Vypis(0);
        Console.WriteLine($"\\nCelková zabraná velikost projektu: {root.ZiskejVelikostMb()} MB");
    }
}`
  },

  // ==========================================
  // BEHAVIORAL PATTERNS
  // ==========================================
  {
    id: 'strategy',
    category: 'behavioral',
    name: 'Strategy',
    czechName: 'Strategie',
    syllabusWeek: 'Týdny 10–11',
    intent: 'Definuje rodinu algoritmů, zapouzdří každý z nich do samostatné třídy a činí je vzájemně zaměnitelnými za běhu programu.',
    problem: 'V nákupním košíku e-shopu má zákazník možnost zaplatit Kartou, Převodem nebo Kryptoměnou. Použití obřího switch(typPlatby) porušuje Open/Closed princip (při přidání nové metody musíme měnit kód košíku).',
    solution: 'Definujeme rozhraní IPlatebniStrategie s metodou Zaplat(castka). Každý platební algoritmus je samostatná třída. Nákupní košík (Kontext) drží referenci na vybranou strategii a deleguje na ni platbu.',
    umlDescription: 'NakupniKosik o-> IPlatebniStrategie <|.. PlatbaKartou, PlatbaPrevodem',
    umlSvgKey: 'strategy',
    participants: [
      { name: 'IPlatebniStrategie', role: 'Společné rozhraní všech platebních algoritmů.' },
      { name: 'PlatbaKartou, PlatbaPrevodem', role: 'Konkrétní strategie implementující algoritmus.' },
      { name: 'NakupniKosik (Context)', role: 'Udržuje referenci na zvolenou strategii a umožňuje její výměnu za běhu.' }
    ],
    similarPatterns: [
      { name: 'State', difference: 'U Strategy volí algoritmus uživatel zvenčí a strategie spolu nesouvisejí. U State přechody mezi stavy řídí samotný kontext automaticky.' },
      { name: 'Command', difference: 'Command zapouzdřuje operaci do objektu (s podporou Undo/Redo fronty). Strategy zapouzdřuje způsob, jakým se operace provede.' }
    ],
    pythonComparisonNote: 'V Pythonu lze strategii předat jednoduše jako lambda funkci nebo referenci na funkci. V C# je idiomatické použít rozhraní IPlatebniStrategie.',
    keyTakeaway: 'Zkouškový chyták: Kontrola null v kontextu! Pokud uživatel zapomene nastavit strategii, košík musí ohlásit chybu dříve než dojde k NullReferenceException.',
    csharpCode: `using System;

// 1. Rozhraní strategie
public interface IPlatebniStrategie
{
    void Zaplat(decimal castka);
}

// 2. Konkrétní strategie
public class PlatbaKartou : IPlatebniStrategie
{
    private readonly string _cisloKarty;

    public PlatbaKartou(string cisloKarty)
    {
        _cisloKarty = cisloKarty;
    }

    public void Zaplat(decimal castka)
    {
        Console.WriteLine($"[Karta] Autorizována platba {castka} Kč z karty {_cisloKarty.Substring(_cisloKarty.Length - 4).PadLeft(16, '*')}.");
    }
}

public class PlatbaPrevodem : IPlatebniStrategie
{
    public void Zaplat(decimal castka)
    {
        Console.WriteLine($"[Banka] Vygenerován QR kód pro bankovní převod částky {castka} Kč.");
    }
}

// 3. Kontext (Nákupní košík)
public class NakupniKosik
{
    private IPlatebniStrategie? _strategie;

    // Možnost změnit strategii kdykoliv za běhu programu!
    public void NastavPlatebniMetodu(IPlatebniStrategie strategie)
    {
        _strategie = strategie;
    }

    public void DokoncitObjednavku(decimal castka)
    {
        // Chránící klauzule proti NullReferenceException
        if (_strategie == null)
        {
            Console.WriteLine("[Chyba] Nebyla zvolena žádná platební metoda!");
            return;
        }

        Console.WriteLine($"[Košík] Zpracovávám objednávku za {castka} Kč...");
        _strategie.Zaplat(castka);
        Console.WriteLine("[Košík] Objednávka úspěšně uhrazena.\\n");
    }
}

public class Program
{
    public static void Main()
    {
        NakupniKosik kosik = new NakupniKosik();

        // 1. Zkouška bez nastavené strategie
        kosik.DokoncitObjednavku(500);

        // 2. Nastavení platby kartou
        kosik.NastavPlatebniMetodu(new PlatbaKartou("1234567812349988"));
        kosik.DokoncitObjednavku(1500);

        // 3. Dynamická změna strategie na bankovní převod
        kosik.NastavPlatebniMetodu(new PlatbaPrevodem());
        kosik.DokoncitObjednavku(3200);
    }
}`
  },

  {
    id: 'command',
    category: 'behavioral',
    name: 'Command',
    czechName: 'Příkaz',
    syllabusWeek: 'Týdny 10–11',
    intent: 'Zapouzdří požadavek jako objekt, což umožňuje parametrizovat klienty různými požadavky, řadit je do fronty, logovat a podporovat vratné operace (Undo/Redo).',
    problem: 'V textovém editoru uživatel maže text, píše znaky nebo vkládá odstavce. Chceme mít univerzální tlačítka "Zpět" (Ctrl+Z) a "Znovu" (Ctrl+Y), aniž by editor znal vnitřní detaily každé akce.',
    solution: 'Každou akci zapouzdříme do třídy implementující IPrikaz s metodami Execute() a Undo(). Správce historie (Invoker) ukládá provedené příkazy do zásobníku Stack<IPrikaz>.',
    umlDescription: 'EditorInvoker o-> IPrikaz <|.. PisPrikaz; IPrikaz -> TextovyDokument',
    umlSvgKey: 'command',
    participants: [
      { name: 'IPrikaz', role: 'Rozhraní příkazu deklarující Execute() a Undo().' },
      { name: 'PisPrikaz', role: 'Konkrétní příkaz ukládající si předchozí stav pro návrat zpět.' },
      { name: 'TextovyDokument (Receiver)', role: 'Příjemce akce, na kterém se změny fyzicky provádějí.' },
      { name: 'EditorPrikazu (Invoker)', role: 'Udržuje zásobník historie a spouští Execute() a Undo().' }
    ],
    similarPatterns: [
      { name: 'Memento', difference: 'Command zapouzdřuje samotnou akci a její reverzní logiku. Memento zapouzdřuje pouze stavový snapshot.' },
      { name: 'Strategy', difference: 'Strategy zapouzdřuje algoritmus provádění. Command zapouzdřuje samostatný požadavek s časovou historií.' }
    ],
    pythonComparisonNote: 'V Pythonu se příkaz někdy simuluje dvojicí lambda funkcí (do, undo). V C# se používá objektový vzor s explicitním zásobníkem Stack<IPrikaz>.',
    keyTakeaway: 'Undo historie: Správce historie ukládá příkazy do Stack<IPrikaz>. Při Undo() vybere poslední příkaz a zavolá jeho Undo().',
    csharpCode: `using System;
using System.Collections.Generic;

// 1. Rozhraní příkazu
public interface IPrikaz
{
    void Execute();
    void Undo();
}

// 2. Příjemce (Receiver) - uchovává reálná data
public class TextovyDokument
{
    public string Obsah { get; set; } = "";

    public void PripojText(string text)
    {
        Obsah += text;
        Console.WriteLine($"[Dokument] Aktuální stav: \"{Obsah}\"");
    }
}

// 3. Konkrétní příkaz: Vložení textu
public class PisPrikaz : IPrikaz
{
    private readonly TextovyDokument _dokument;
    private readonly string _pridanyText;

    public PisPrikaz(TextovyDokument dokument, string pridanyText)
    {
        _dokument = dokument;
        _pridanyText = pridanyText;
    }

    public void Execute()
    {
        _dokument.PripojText(_pridanyText);
    }

    public void Undo()
    {
        // Vrácení změny zpět
        if (_dokument.Obsah.EndsWith(_pridanyText))
        {
            _dokument.Obsah = _dokument.Obsah.Substring(0, _dokument.Obsah.Length - _pridanyText.Length);
            Console.WriteLine($"[Undo] Vráceno zpět. Aktuální stav: \"{_dokument.Obsah}\"");
        }
    }
}

// 4. Invoker: Správce historie se zásobníkem
public class EditorInvoker
{
    private readonly Stack<IPrikaz> _historie = new();

    public void SpustitPrikaz(IPrikaz prikaz)
    {
        prikaz.Execute();
        _historie.Push(prikaz);
    }

    public void StiskUndo()
    {
        if (_historie.Count > 0)
        {
            IPrikaz posledni = _historie.Pop();
            posledni.Undo();
        }
        else
        {
            Console.WriteLine("[Undo] Žádné další akce k vrácení!");
        }
    }
}

public class Program
{
    public static void Main()
    {
        TextovyDokument doc = new TextovyDokument();
        EditorInvoker editor = new EditorInvoker();

        Console.WriteLine("Píšeme text:");
        editor.SpustitPrikaz(new PisPrikaz(doc, "Ahoj "));
        editor.SpustitPrikaz(new PisPrikaz(doc, "studente! "));
        editor.SpustitPrikaz(new PisPrikaz(doc, "C# je super."));

        Console.WriteLine("\\nTestujeme Undo (Ctrl+Z):");
        editor.StiskUndo();
        editor.StiskUndo();

        Console.WriteLine("\\nPíšeme nový text:");
        editor.SpustitPrikaz(new PisPrikaz(doc, "Návrhové vzory fungují!"));
    }
}`
  },

  {
    id: 'memento',
    category: 'behavioral',
    name: 'Memento',
    czechName: 'Památka (Snapshot)',
    syllabusWeek: 'Týdny 10–11',
    intent: 'Umožňuje zachytit a externalizovat vnitřní stav objektu bez porušení jeho zapouzdření, takže objekt lze později do tohoto stavu obnovit.',
    problem: 'Hráč prochází levelem RPG hry (životy, mana, pozice X, Y). Chceme funkci "Uložit hru" a "Nahrát hru". Pokud by stav byl public, kdokoliv by mohl nebezpečně modifikovat vnitřnosti hráče.',
    solution: 'Hrac (Originator) vytvoří na požádání neměnný objekt HracMemento (snapshot). Tento snapshot je předán správci uložení (Caretaker), který do něj však nesmí zasahovat. Při obnově předá Caretaker memento zpět Hráči.',
    umlDescription: 'Hrac (Originator) -> HracMemento; UlozisteStavu (Caretaker) o-> HracMemento',
    umlSvgKey: 'memento',
    participants: [
      { name: 'Hrac (Originator)', role: 'Vytváří memento se svým aktuálním stavem a umí svůj stav z mementa obnovit.' },
      { name: 'HracMemento', role: 'Neměnný snapshot vnitřního stavu.' },
      { name: 'UlozisteStavu (Caretaker)', role: 'Uchovává mementa, ale nikdy nečte ani nemění jejich vnitřní data.' }
    ],
    similarPatterns: [
      { name: 'Command', difference: 'Command a Memento se často kombinují: Command ukládá Memento před provedením akce pro snadný návrat.' },
      { name: 'Prototype', difference: 'Prototype klonuje celý funkční objekt pro další práci. Memento slouží jako pasivní časová kapsle pro obnovu.' }
    ],
    pythonComparisonNote: 'V Pythonu se memento často simuluje pomocí modulu copy.deepcopy() nebo pickle. V C# je klíčové, aby memento neporušovalo zapouzdření a bylo ideálně neměnné.',
    keyTakeaway: 'Zapouzdření zachováno: Caretaker drží snapshot, ale nesahá do jeho atributů.',
    csharpCode: `using System;
using System.Collections.Generic;

// 1. Memento: Neměnný snímek stavu (časová kapsle)
public class HracMemento
{
    public int Zdravi { get; }
    public int Mana { get; }
    public string Pozice { get; }

    public HracMemento(int zdravi, int mana, string pozice)
    {
        Zdravi = zdravi;
        Mana = mana;
        Pozice = pozice;
    }
}

// 2. Původce (Originator): Objekt, jehož stav ukládáme
public class Hrac
{
    private int _zdravi = 100;
    private int _mana = 50;
    private string _pozice = "Začátek jeskyně";

    public void UtrpZraneni(int poskozeni)
    {
        _zdravi -= poskozeni;
        _mana -= 10;
        Console.WriteLine($"[Hráč] Utrpěl zranění! HP: {_zdravi}, Mana: {_mana}");
    }

    public void PohniSe(string novaPozice)
    {
        _pozice = novaPozice;
        Console.WriteLine($"[Hráč] Přesunul se na: {_pozice}");
    }

    // Vytvoření snímku
    public HracMemento UlozStav()
    {
        Console.WriteLine($"[Checkpoint] Ukládám stav: HP={_zdravi}, Mana={_mana}, Pozice='{_pozice}'");
        return new HracMemento(_zdravi, _mana, _pozice);
    }

    // Obnova ze snímku
    public void ObnovStav(HracMemento memento)
    {
        _zdravi = memento.Zdravi;
        _mana = memento.Mana;
        _pozice = memento.Pozice;
        Console.WriteLine($"[Obnova] Hráč načten: HP={_zdravi}, Mana={_mana}, Pozice='{_pozice}'");
    }
}

// 3. Správce (Caretaker): Uchovává checkpointy
public class UlozisteStavu
{
    private readonly Stack<HracMemento> _checkpoints = new();

    public void UlozCheckpoint(HracMemento memento) => _checkpoints.Push(memento);

    public HracMemento? NacistPosledni() => _checkpoints.Count > 0 ? _checkpoints.Pop() : null;
}

public class Program
{
    public static void Main()
    {
        Hrac hrac = new Hrac();
        UlozisteStavu uloziste = new UlozisteStavu();

        // 1. Uložíme hru před bojem s bossem
        uloziste.UlozCheckpoint(hrac.UlozStav());

        // 2. Hráč bojuje a málem umře
        hrac.PohniSe("Doupě draka");
        hrac.UtrpZraneni(90);

        // 3. Boss ho dorazil - načteme checkpoint!
        Console.WriteLine("\\n--- GAME OVER! Načítám poslední checkpoint ---");
        HracMemento? cp = uloziste.NacistPosledni();
        if (cp != null)
        {
            hrac.ObnovStav(cp);
        }
    }
}`
  },

  {
    id: 'observer',
    category: 'behavioral',
    name: 'Observer',
    czechName: 'Pozorovatel (Publisher / Subscriber)',
    syllabusWeek: 'Týdny 10–11',
    intent: 'Definuje závislost 1:N mezi objekty, takže když jeden objekt změní stav, všichni jeho závislí pozorovatelé jsou automaticky uvědoměni a aktualizováni.',
    problem: 'YouTube kanál publikuje nová videa. Odběratelé (studenti) chtějí okamžitě vědět o novém videu. Pokud by se každý student každou vteřinu dotazoval serveru (polling), server by zkolaboval.',
    solution: 'Kanál (Subject / Publisher) si udržuje seznam odběratelů List<IObserver>. Když vyjde video, kanál projde seznam a zavolá metodu Update(nazevVidea) na každém registrovaném pozorovateli.',
    umlDescription: 'IKanal (Subject) o-> IObserver <|.. StudentObserver; IKanal <|.. YouTubeKanal',
    umlSvgKey: 'observer',
    participants: [
      { name: 'IObserver', role: 'Rozhraní odběratele s metodou Update().' },
      { name: 'StudentObserver', role: 'Konkrétní odběratel reagující na zprávu.' },
      { name: 'IKanal (Subject)', role: 'Rozhraní vydavatele s metodami Prihlasit(), Odhlasit(), UpozorniOdběratele().' },
      { name: 'YouTubeKanal', role: 'Konkrétní vydavatel spravující seznam List<IObserver>.' }
    ],
    similarPatterns: [
      { name: 'Mediator', difference: 'Mediator centralizuje komunikaci mezi mnoha různými objekty navzájem. Observer vytváří jednosměrný broadcast od 1 vydavatele k N odběratelům.' },
      { name: 'Chain of Responsibility', difference: 'V CoR je požadavek předáván po řetězu, dokud ho někdo nezpracuje. V Observeru obdrží zprávu všichni registrovaní odběratelé.' }
    ],
    pythonComparisonNote: 'V C# je Observer také zabudován přímo v jazyce pomocí klíčových slov event a delegate. Zkouška však vyžaduje klasickou objektovou GoF implementaci přes rozhraní IObserver.',
    keyTakeaway: 'Zkouškový chyták: Nezapomenout na metodu Odhlasit (Unsubscribe), jinak může docházet k únikům paměti (memory leak)!',
    csharpCode: `using System;
using System.Collections.Generic;

// 1. Rozhraní pozorovatele (Odběratel)
public interface IObserver
{
    void Aktualizuj(string nazevVidea);
}

// 2. Rozhraní subjektu (Vydavatel)
public interface ISubject
{
    void PrihlasitOdběr(IObserver observer);
    void OdhlasitOdběr(IObserver observer);
    void UpozorniOdběratele(string zprava);
}

// 3. Konkrétní vydavatel (YouTube kanál)
public class YouTubeKanal : ISubject
{
    private readonly List<IObserver> _odberatele = new();
    public string NazevKanalu { get; }

    public YouTubeKanal(string nazevKanalu)
    {
        NazevKanalu = nazevKanalu;
    }

    public void PrihlasitOdběr(IObserver observer)
    {
        _odberatele.Add(observer);
        Console.WriteLine($"[YouTube] Nový odběratel zaregistrován.");
    }

    public void OdhlasitOdběr(IObserver observer)
    {
        _odberatele.Remove(observer);
        Console.WriteLine($"[YouTube] Odběratel odhlášen.");
    }

    public void PublikujVideo(string titulek)
    {
        Console.WriteLine($"\\n[YouTube] Kanál '{NazevKanalu}' právě nahrál nové video: '{titulek}'!");
        UpozorniOdběratele(titulek);
    }

    public void UpozorniOdběratele(string titulek)
    {
        foreach (var o in _odberatele)
        {
            o.Aktualizuj(titulek);
        }
    }
}

// 4. Konkrétní pozorovatelé (Studenti)
public class StudentObserver : IObserver
{
    private readonly string _jmeno;

    public StudentObserver(string jmeno)
    {
        _jmeno = jmeno;
    }

    public void Aktualizuj(string nazevVidea)
    {
        Console.WriteLine($"  -> Notifikace pro {_jmeno}: Jdu se dívat na video '{nazevVidea}'!");
    }
}

public class Program
{
    public static void Main()
    {
        YouTubeKanal kanal = new YouTubeKanal("C# & Design Patterns CZ");

        IObserver jan = new StudentObserver("Jan Novák");
        IObserver petr = new StudentObserver("Petr Svoboda");

        kanal.PrihlasitOdběr(jan);
        kanal.PrihlasitOdběr(petr);

        // Notifikaci dostanou oba
        kanal.PublikujVideo("Dědičnost vs Kompozice za 10 minut");

        // Petr se odhlásí
        kanal.OdhlasitOdběr(petr);

        // Další notifikaci dostane už jen Jan
        kanal.PublikujVideo("Jak zvládnout zkoušku z OONV");
    }
}`
  },

  {
    id: 'state',
    category: 'behavioral',
    name: 'State',
    czechName: 'Stav',
    syllabusWeek: 'Týdny 10–11',
    intent: 'Umožňuje objektu měnit své chování, když se změní jeho vnitřní stav. Z pohledu zvenčí to vypadá, jako by objekt změnil svou třídu.',
    problem: 'Objednávka v e-shopu prochází fázemi: Nová -> Zaplacená -> Odeslaná -> Doručená. Metody jako Stornovat() nebo Zaplatit() se v každé fázi chovají úplně jinak. Použití vnořených podmínek if-else vytváří nepřehledný monolit.',
    solution: 'Definujeme rozhraní IStavObjednavky. Každý stav je samostatná třída implementující povolené přechody a akce. Objednávka deleguje volání na svůj aktuální stavový objekt.',
    umlDescription: 'Objednavka o-> IStavObjednavky <|.. NovaObjednavkaStav, ZaplacenaStav, OdeslanaStav',
    umlSvgKey: 'state',
    participants: [
      { name: 'IStavObjednavky', role: 'Rozhraní stavu deklarující akce Zaplatit(), Odeslat(), Stornovat().' },
      { name: 'NovaStav, ZaplacenaStav', role: 'Konkrétní stavy definující platné i neplatné operace.' },
      { name: 'Objednavka (Context)', role: 'Kontext udržující instanci aktuálního stavu.' }
    ],
    similarPatterns: [
      { name: 'Strategy', difference: 'U vzoru Strategy klient explicitně volí algoritmus zvenčí. U vzoru State jsou stavy propojeny a přechody řízeny automaticky vnitřní logikou.' },
      { name: 'Bridge', difference: 'Bridge odděluje abstrakci od implementátora natrvalo. State mění vnitřní objekt dynamicky podle životního cyklu.' }
    ],
    pythonComparisonNote: 'V C# zabraňuje State stavovým chybám (např. odeslání nezaplacené objednávky) přímo na úrovni objektové architektury.',
    keyTakeaway: 'Zamezuje stavovým podmínkám: Namísto if (stav == 1) se zavolá _stav.Zaplatit(this), což automaticky přepne stav na nový.',
    csharpCode: `using System;

public interface IStavObjednavky
{
    void Zaplatit(Objednavka objednavka);
    void Odeslat(Objednavka objednavka);
    void Stornovat(Objednavka objednavka);
}

public class Objednavka
{
    public IStavObjednavky Stav { get; set; }

    public Objednavka()
    {
        // Počáteční stav
        Stav = new NovaObjednavkaStav();
        Console.WriteLine("[Objednavka] Vytvořena nová objednávka.");
    }

    public void Zaplatit() => Stav.Zaplatit(this);
    public void Odeslat() => Stav.Odeslat(this);
    public void Stornovat() => Stav.Stornovat(this);
}

// Konkrétní stav 1: Nová
public class NovaObjednavkaStav : IStavObjednavky
{
    public void Zaplatit(Objednavka objednavka)
    {
        Console.WriteLine("[Stav: Nová] Platba úspěšně přijata. Přechod do stavu Zaplaceno.");
        objednavka.Stav = new ZaplacenaStav();
    }

    public void Odeslat(Objednavka objednavka)
    {
        Console.WriteLine("[Chyba] Nelze odeslat nezaplacenou objednávku!");
    }

    public void Stornovat(Objednavka objednavka)
    {
        Console.WriteLine("[Stav: Nová] Objednávka stornována.");
        objednavka.Stav = new StornovanaStav();
    }
}

// Konkrétní stav 2: Zaplacená
public class ZaplacenaStav : IStavObjednavky
{
    public void Zaplatit(Objednavka objednavka) => Console.WriteLine("[Upozornění] Objednávka již je zaplacena.");

    public void Odeslat(Objednavka objednavka)
    {
        Console.WriteLine("[Stav: Zaplaceno] Balíček předán kurýrovi. Přechod do stavu Odesláno.");
        objednavka.Stav = new OdeslanaStav();
    }

    public void Stornovat(Objednavka objednavka)
    {
        Console.WriteLine("[Stav: Zaplaceno] Vracíme peníze a stornujeme objednávku.");
        objednavka.Stav = new StornovanaStav();
    }
}

// Konkrétní stav 3: Odeslaná
public class OdeslanaStav : IStavObjednavky
{
    public void Zaplatit(Objednavka objednavka) => Console.WriteLine("[Chyba] Již zaplaceno i odesláno.");
    public void Odeslat(Objednavka objednavka) => Console.WriteLine("[Chyba] Zásilka už je na cestě.");
    public void Stornovat(Objednavka objednavka) => Console.WriteLine("[Chyba] Nelze stornovat! Balík byl již odeslán zákazníkovi.");
}

// Konkrétní stav 4: Stornovaná
public class StornovanaStav : IStavObjednavky
{
    public void Zaplatit(Objednavka objednavka) => Console.WriteLine("[Chyba] Objednávka je stornována.");
    public void Odeslat(Objednavka objednavka) => Console.WriteLine("[Chyba] Nelze odeslat stornovanou objednávku.");
    public void Stornovat(Objednavka objednavka) => Console.WriteLine("[Chyba] Už je stornována.");
}

public class Program
{
    public static void Main()
    {
        Objednavka obj = new Objednavka();

        // Pokus o neplatnou akci
        obj.Odeslat();

        // Správný průchod
        obj.Zaplatit();
        obj.Odeslat();

        // Pokus o storno po odeslání
        obj.Stornovat();
    }
}`
  }
];
