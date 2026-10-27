import { AccessModifierInfo, PythonCSharpComparison, UmlArrowRelation } from '../types/curriculum';

export const pythonVsCSharpComparisons: PythonCSharpComparison[] = [
  {
    feature: 'Typový systém',
    pythonSyntax: 'x = 10\nx = "ahoj"  # Dynamické, změna typu za běhu',
    csharpSyntax: 'int x = 10;\n// x = "ahoj"; // Chyba kompilace Roslyn: CS0029',
    explanation: 'C# je silně a staticky typovaný jazyk. Typ každé proměnné kontroluje kompilátor Roslyn ještě před spuštěním.'
  },
  {
    feature: 'Definice funkcí a metod',
    pythonSyntax: 'def secti(a: int, b: int) -> int:\n    return a + b',
    csharpSyntax: 'public int Secti(int a, int b)\n{\n    return a + b;\n}',
    explanation: 'V C# neexistuje klíčové slovo "def". Metoda má specifikátor přístupu, návratový typ (nebo void) a blok je ohraničen složenými závorkami { }.'
  },
  {
    feature: 'Instance a "self" vs "this"',
    pythonSyntax: 'class Auto:\n    def __init__(self, znacka):\n        self.znacka = znacka',
    csharpSyntax: 'public class Auto\n{\n    public string Znacka { get; set; }\n    public Auto(string znacka)\n    {\n        this.Znacka = znacka;\n    }\n}',
    explanation: 'V C# není self prvním parametrem metody. Instance se odkazuje klíčovým slovem "this", nebo se pole označuje podtržítkem _znacka.'
  },
  {
    feature: 'Prázdná hodnota (None vs null)',
    pythonSyntax: 'uzivatel = None\nif uzivatel is None:\n    print("Nikdo")',
    csharpSyntax: 'Uzivatel? uzivatel = null;\nif (uzivatel == null)\n{\n    Console.WriteLine("Nikdo");\n}',
    explanation: 'Hodnotové typy (int, bool) nemohou být null bez operátoru ? (Nullable). Referenční typy (třídy, string) mohou být null.'
  },
  {
    feature: 'Dědičnost a volání předka',
    pythonSyntax: 'class Pes(Zvire):\n    def __init__(self, jmeno):\n        super().__init__(jmeno)',
    csharpSyntax: 'public class Pes : Zvire\n{\n    public Pes(string jmeno) : base(jmeno)\n    {\n    }\n}',
    explanation: 'V C# se dědí operátorem dvojtečka :. Volání konstruktoru předka probíhá před tělem konstruktoru pomocí : base(...).'
  },
  {
    feature: 'Protokol / Rozhraní (Interface)',
    pythonSyntax: 'class IPolozka(Protocol):\n    def ziskej_cenu(self) -> float: ...',
    csharpSyntax: 'public interface IPolozka\n{\n    double ZiskejCenu();\n}',
    explanation: 'V C# je interface čistý kontrakt bez těla. Třída jej implementuje přes : IPolozka a kompilátor vynucuje dodržení všech signatur.'
  }
];

export const accessModifiersData: AccessModifierInfo[] = [
  {
    modifier: 'private',
    czechName: 'Soukromý (výchozí pro členy třídy)',
    sameClass: true,
    derivedClassSameAssembly: false,
    otherClassSameAssembly: false,
    derivedClassOtherAssembly: false,
    otherClassOtherAssembly: false,
    description: 'Přístupný pouze v rámci té samé třídy nebo struktury.',
    examNote: 'Pokud u atributu či metody neuvedete žádný modifikátor, je automaticky private!'
  },
  {
    modifier: 'private protected',
    czechName: 'Soukromý chráněný',
    sameClass: true,
    derivedClassSameAssembly: true,
    otherClassSameAssembly: false,
    derivedClassOtherAssembly: false,
    otherClassOtherAssembly: false,
    description: 'Přístupný pouze v odvozených třídách v rámci STEJNÉ sestavy (assembly / projektu).',
    examNote: 'Logický průnik: (odvozená třída) AND (stejný projekt).'
  },
  {
    modifier: 'protected',
    czechName: 'Chráněný',
    sameClass: true,
    derivedClassSameAssembly: true,
    otherClassSameAssembly: false,
    derivedClassOtherAssembly: true,
    otherClassOtherAssembly: false,
    description: 'Přístupný v téže třídě a ve všech odvozených potomcích (i v jiném projektu).',
    examNote: 'Cizí třída ve stejném projektu k němu přístup nemá, potomek v jiném projektu ano.'
  },
  {
    modifier: 'internal',
    czechName: 'Interní (výchozí pro top-level třídy)',
    sameClass: true,
    derivedClassSameAssembly: true,
    otherClassSameAssembly: true,
    derivedClassOtherAssembly: false,
    otherClassOtherAssembly: false,
    description: 'Přístupný pro libovolný kód uvnitř téže sestavy (assembly / projektu).',
    examNote: 'Top-level třída deklarovaná bez specifikátoru (class Uzivatel) je defaultně internal!'
  },
  {
    modifier: 'protected internal',
    czechName: 'Chráněný nebo interní',
    sameClass: true,
    derivedClassSameAssembly: true,
    otherClassSameAssembly: true,
    derivedClassOtherAssembly: true,
    otherClassOtherAssembly: false,
    description: 'Přístupný pro jakoukoliv třídu v témže projektu NEBO pro potomky v cizích projektech.',
    examNote: 'Logické sjednocení: (odvozená třída) OR (stejný projekt).'
  },
  {
    modifier: 'public',
    czechName: 'Veřejný',
    sameClass: true,
    derivedClassSameAssembly: true,
    otherClassSameAssembly: true,
    derivedClassOtherAssembly: true,
    otherClassOtherAssembly: true,
    description: 'Neomezený přístup z jakéhokoliv místa i cizích knihoven.',
    examNote: 'Používá se pro veřejná API rozhraní a vlastnosti.'
  }
];

export const umlArrowRelations: UmlArrowRelation[] = [
  {
    name: 'Implementace rozhraní (Realization)',
    umlSymbol: '- - - - ▷',
    meaning: 'Třída implementuje smlouvu definovanou rozhraním. Nemá žádnou výchozí implementaci, zavazuje se dodat kód.',
    csharpSyntax: 'public class Pes : IZvire\n{\n    public void VydejZvuk() => Console.WriteLine("Haf!");\n}',
    example: 'Pes realizuje kontrakt IZvire',
    guruTip: 'Čárkovaná čára s prázdným bílým trojúhelníkem. V C# se píše za dvojtečku : IZvire.'
  },
  {
    name: 'Dědičnost tříd (Generalization / Inheritance)',
    umlSymbol: '────────▷',
    meaning: 'Třída potomek přebírá kód, stav a chování od předka. C# podporuje dědění z pouze JEDNÉ třídy.',
    csharpSyntax: 'public class Programator : Zamestnanec\n{\n    public Programator(string jmeno, int mzda) : base(jmeno, mzda) {}\n}',
    example: 'Programátor je potomkem Zaměstnance',
    guruTip: 'Plná čára s prázdným bílým trojúhelníkem směřujícím k předkovi. Pozor na povinné volání : base(...)!'
  },
  {
    name: 'Kompozice (Composition)',
    umlSymbol: '◆───────>',
    meaning: 'Silná vazba "vlastnictví". Část nemůže existovat bez celku. Životní cyklus vnitřního objektu řídí vlastník.',
    csharpSyntax: 'public class Dum\n{\n    private readonly Pokoj _pokoj = new Pokoj();\n}',
    example: 'Dům se skládá z pokojů (zánikem domu zanikají pokoje)',
    guruTip: 'Plný černý kosočtverec u vlastníka. Upřednostňuj kompozici před dědičností (2. pravidlo GoF)!'
  },
  {
    name: 'Agregace (Aggregation)',
    umlSymbol: '◇───────>',
    meaning: 'Volnější vazba "má". Vnitřní objekt existuje nezávisle a je předán zvenčí (např. přes konstruktor - DI).',
    csharpSyntax: 'public class NakupniKosik\n{\n    private readonly IPlatebniBrana _brana;\n    public NakupniKosik(IPlatebniBrana brana) => _brana = brana;\n}',
    example: 'Nákupní košík používá platební bránu',
    guruTip: 'Prázdný bílý kosočtverec u vlastníka. Základ pro vzory Strategy, Adapter a Proxy.'
  },
  {
    name: 'Asociace a Závislost (Dependency)',
    umlSymbol: '- - - - >',
    meaning: 'Jednoduché použití objektu jako parametru metody nebo dočasné lokální proměnné.',
    csharpSyntax: 'public class ReportGenerator\n{\n    public void Exportuj(IDokument doc) => doc.Tisk();\n}',
    example: 'Generátor závisí na formátu dokumentu pouze během volání metody',
    guruTip: 'Čárkovaná šipka. Třída A potřebuje třídu B, ale nevlastní ji jako členský atribut.'
  }
];

export const step1CodeExamples = {
  stackVsHeap: `using System;

public class Program
{
    // Třída = Referenční typ (alokuje se na HEAPU v RAM)
    public class UkazkaZakladu
    {
        public string Nazev { get; set; }
        public int Hodnota { get; set; }

        public UkazkaZakladu(string nazev, int hodnota)
        {
            Nazev = nazev;
            Hodnota = hodnota;
        }
    }

    public static void Main()
    {
        Console.WriteLine("=== 1. HODNOTOVÉ TYPY (STACK) ===");
        int x = 10;
        int y = x; // Vytvoří se PLNOHODNOTNÁ KOPIE hodnoty 10
        y = 999;
        Console.WriteLine($"x: {x} (zůstalo 10)");
        Console.WriteLine($"y: {y} (změněno na 999)");

        Console.WriteLine("\\n=== 2. REFERENČNÍ TYPY (HEAP) ===");
        UkazkaZakladu a = new UkazkaZakladu("Původní", 42);
        UkazkaZakladu b = a; // Kopíruje se POUZE UKAZATEL na stejný objekt na Heap!
        b.Nazev = "Změněno přes B";

        Console.WriteLine($"a.Nazev: '{a.Nazev}' (pozor! Změnilo se i 'a')");
        Console.WriteLine($"b.Nazev: '{b.Nazev}'");

        Console.WriteLine("\\n=== 3. ZKOUŠKOVÝ CHYTÁK: STRING IMMUTABILITY ===");
        string s1 = "ahoj";
        string s2 = s1;
        s1 += " světe"; // String je třída na heapu, ale IMMUTABLE! Vytvoří se NOVÝ string!
        Console.WriteLine($"s1: '{s1}' (nová alokace)");
        Console.WriteLine($"s2: '{s2}' (zůstal původní řetězec)");
    }
}`,

  uzivatelDemo: `using System;

public class Uzivatel
{
    // Soukromý atribut (zapouzdření)
    private int _pocetPrihlaseni;

    // Veřejná auto-vlastnost s chráněným setterem
    public string Jmeno { get; private set; }
    public string Role { get; set; }

    public Uzivatel(string jmeno, string role)
    {
        Jmeno = jmeno;
        Role = role;
        _pocetPrihlaseni = 0;
    }

    public void Prihlasit()
    {
        _pocetPrihlaseni++;
        Console.WriteLine($"Uživatel {Jmeno} ({Role}) přihlášen. Počet přihlášení: {_pocetPrihlaseni}");
    }
}

public class Program
{
    public static void Main()
    {
        Uzivatel u = new Uzivatel("Karel", "Admin");
        u.Prihlasit();
        u.Prihlasit();
        Console.WriteLine($"Jméno: {u.Jmeno}, Role: {u.Role}");
    }
}`
};

export const step2CodeExamples = {
  holyTrinityPolymorphism: `using System;

public class Program
{
    public abstract class Zamestnanec
    {
        public string Jmeno { get; set; }
        public int Plat { get; set; }

        // Povinný konstruktor předka
        public Zamestnanec(string jmeno, int plat)
        {
            Jmeno = jmeno;
            Plat = plat;
        }

        // Běžná metoda (statická vazba podle typu proměnné)
        public void PredstavSeObycejne()
        {
            Console.WriteLine($"[Obyčejně] Jsem zaměstnanec {Jmeno}");
        }

        // Virtuální metoda (dynamická vazba přes VTABLE podle objektu v RAM)
        public virtual void SpocitejBonus()
        {
            Console.WriteLine($"[Virtual Zamestnanec] Standardní bonus 10%: {Plat * 0.10} Kč");
        }
    }

    public class Programator : Zamestnanec
    {
        public string HlavniJazyk { get; set; }

        // CHYTÁK ZE ZKOUŠKY: Povinné volání : base(...)!
        public Programator(string jmeno, int plat, string jazyk) : base(jmeno, plat)
        {
            HlavniJazyk = jazyk;
        }

        // NEW = Zastínění (hiding) - přepíše metodu pouze při volání přes Programator typ!
        public new void PredstavSeObycejne()
        {
            Console.WriteLine($"[NEW Programator] Jsem programátor {Jmeno} v jazyce {HlavniJazyk}");
        }

        // OVERRIDE = Skutečný polymorfismus (přepíše záznam ve VTABLE)!
        public override void SpocitejBonus()
        {
            Console.WriteLine($"[OVERRIDE Programator] Speciální IT bonus 30%: {Plat * 0.30} Kč");
        }
    }

    public static void Main()
    {
        Console.WriteLine("=== ZKOUŠKOVÝ SCÉNÁŘ: VLEVO PŘEDEK, VPRAVO POTOMEK ===");
        // Mentální model:
        // VLEVO (Zamestnanec z): Nálepka na krabici pro Roslyn kompilátor
        // VPRAVO (new Programator): Reálný objekt alokovaný v RAM na Heap
        Zamestnanec z = new Programator("David", 80000, "C#");

        // 1. Zastínění 'new' se váže STATICKY podle typu vlevo (Zamestnanec)!
        z.PredstavSeObycejne(); 

        // 2. 'override' se váže DYNAMICKY přes vtable podle objektu v RAM (Programator)!
        z.SpocitejBonus();

        Console.WriteLine("\\n=== UPCASTING & DOWNCASTING (is / as) ===");
        if (z is Programator p)
        {
            Console.WriteLine($"Safe downcast pomocí 'is': Programátor píše v {p.HlavniJazyk}");
            p.PredstavSeObycejne(); // Zde je typ vlevo Programator, zavolá se nová metoda
        }

        Programator? testAs = z as Programator;
        Console.WriteLine($"Safe downcast pomocí 'as': {(testAs != null ? "Úspěch" : "Selhalo")}");
    }
}`
};
