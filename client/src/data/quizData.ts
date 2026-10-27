import { QuizQuestion } from '../types/trainer';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-method-shadowing-new',
    title: 'Zkouškový chyták č. 1: override vs new na proměnné předka',
    category: 'polymorphism',
    codeSnippet: `using System;

public class Rodic
{
    public void PozdravObycejne() => Console.WriteLine("Rodič obyčejně");
    public virtual void PozdravVirtualne() => Console.WriteLine("Rodič virtuálně");
}

public class Potomek : Rodic
{
    public new void PozdravObycejne() => Console.WriteLine("Potomek nově");
    public override void PozdravVirtualne() => Console.WriteLine("Potomek override");
}

public class Program
{
    public static void Main()
    {
        Rodic r = new Potomek();
        r.PozdravObycejne();
        r.PozdravVirtualne();
    }
}`,
    options: [
      { id: 'a', text: 'Potomek nově\nPotomek override', isCorrect: false },
      { id: 'b', text: 'Rodič obyčejně\nPotomek override', isCorrect: true },
      { id: 'c', text: 'Rodič obyčejně\nRodič virtuálně', isCorrect: false },
      { id: 'd', text: 'Kód nelze zkompilovat kvůli chybě CS0108', isCorrect: false }
    ],
    explanation: 'Zlatý zkouškový chyták! Proměnná r má typ Rodic (vlevo). Protože PozdravObycejne() používá "new", kompilátor použije STATICKOU VAZBU podle typu proměnné (Rodic). Naopak PozdravVirtualne() má "override", takže se uplatní DYNAMICKÁ VAZBA přes tabulku virtuálních metod (VTABLE) a zavolá se objekt v RAM (Potomek).',
    memoryDiagramNote: 'Vlevo: Rodic r (statický typ kompilátoru) -> Vpravo: new Potomek() v RAM (vtable odkazuje na Potomek.PozdravVirtualne).'
  },

  {
    id: 'quiz-string-immutability',
    title: 'Zkouškový chyták č. 2: String immutability',
    category: 'gotchas',
    codeSnippet: `using System;

public class Program
{
    public static void Main()
    {
        string text = "ahoj";
        text.ToUpper();
        Console.WriteLine(text);
    }
}`,
    options: [
      { id: 'a', text: 'AHOJ', isCorrect: false },
      { id: 'b', text: 'ahoj', isCorrect: true },
      { id: 'c', text: 'NullReferenceException', isCorrect: false },
      { id: 'd', text: 'Kompilátor vyhodí chybu CS0201', isCorrect: false }
    ],
    explanation: 'Typ string je v C# sice referenční typ na Heap, ale je IMMUTABLE (neměnný). Metoda text.ToUpper() nemění původní instanci, ale alokuje a vrací zcela NOVÝ string! Jelikož výsledek nebyl nikam přiřazen (např. text = text.ToUpper()), proměnná text zůstává nezměněna ("ahoj").'
  },

  {
    id: 'quiz-reference-aliasing-heap',
    title: 'Zkouškový chyták č. 3: Kopírování referencí na Stack vs Heap',
    category: 'memory',
    codeSnippet: `using System;

public class Uzivatel
{
    public string Jmeno { get; set; }
    public Uzivatel(string jmeno) => Jmeno = jmeno;
}

public class Program
{
    public static void Main()
    {
        Uzivatel a = new Uzivatel("Petr");
        Uzivatel b = a;
        b.Jmeno = "Honza";

        Console.WriteLine(a.Jmeno);
    }
}`,
    options: [
      { id: 'a', text: 'Petr', isCorrect: false },
      { id: 'b', text: 'Honza', isCorrect: true },
      { id: 'c', text: 'null', isCorrect: false },
      { id: 'd', text: 'Vyhodí výjimku za běhu', isCorrect: false }
    ],
    explanation: 'Třída Uzivatel je referenční typ. Na Stacku se vytvoří proměnná a, která ukazuje na paměťovou adresu na Heap. Přiřazení "b = a" nekopíruje objekt, ale zduplikuje POUZE adresu ukazatele na Stacku. Obě proměnné a i b ukazují na jediný objekt v RAM. Změna b.Jmeno se tedy projeví i na a.Jmeno.',
    memoryDiagramNote: 'Stack: [a: 0x1A40, b: 0x1A40] ---> Heap [0x1A40: Uzivatel { Jmeno = "Honza" }]'
  },

  {
    id: 'quiz-downcasting-exception',
    title: 'Zkouškový chyták č. 4: Explicitní přetypování vs operátor "as"',
    category: 'gotchas',
    codeSnippet: `using System;

public interface IZvire {}
public class Pes : IZvire {}
public class Kocka : IZvire {}

public class Program
{
    public static void Main()
    {
        IZvire z = new Kocka();
        Pes? p = z as Pes;
        Console.WriteLine(p == null ? "JeNull" : "NeniNull");
    }
}`,
    options: [
      { id: 'a', text: 'JeNull', isCorrect: true },
      { id: 'b', text: 'NeniNull', isCorrect: false },
      { id: 'c', text: 'InvalidCastException za běhu', isCorrect: false },
      { id: 'd', text: 'Kód se nezkompiluje', isCorrect: false }
    ],
    explanation: 'Operátor "as" provádí bezpečné přetypování. Pokud runtime typ neodpovídá cílovému typu (objekt v paměti je Kocka, nikoliv Pes), operátor "as" NEVYHODÍ InvalidCastException, ale bezpečně vrátí null. Kdyby bylo použito explicitní (Pes)z, vyhodila by se výjimka.'
  },

  {
    id: 'quiz-access-modifier-default',
    title: 'Zkouškový chyták č. 5: Výchozí viditelnost v C#',
    category: 'access',
    codeSnippet: `// V souboru Knihovna.cs:
class TajnyVypocet
{
    int _hodnota = 42;
    void Spocti() {}
}`,
    options: [
      { id: 'a', text: 'Třída je public, členy jsou public (jako v Java/Python)', isCorrect: false },
      { id: 'b', text: 'Třída je internal, členy jsou private', isCorrect: true },
      { id: 'c', text: 'Třída je private, členy jsou internal', isCorrect: false },
      { id: 'd', text: 'Třída je protected, členy jsou protected', isCorrect: false }
    ],
    explanation: 'V C# platí přísná pravidla pro výchozí viditelnost bez uvedení modifikátoru: Top-level třída deklarovaná v namespace/souboru je defaultně INTERNAL (viditelná jen v rámci projektu). Členy třídy (atributy, metody) jsou defaultně PRIVATE.'
  },

  {
    id: 'quiz-constructor-base-mandatory',
    title: 'Zkouškový chyták č. 6: Chybějící bezparametrický konstruktor předka',
    category: 'inheritance',
    codeSnippet: `public class Zamestnanec
{
    public Zamestnanec(string jmeno, int mzda) {}
}

public class Programator : Zamestnanec
{
    public Programator(string jmeno, int mzda)
    {
        // Chybí volání : base(...)
    }
}`,
    options: [
      { id: 'a', text: 'Zkompiluje se a automaticky předá null a 0', isCorrect: false },
      { id: 'b', text: 'Chyba kompilace: Zamestnanec neobsahuje konstruktor bez parametrů (CS7036)', isCorrect: true },
      { id: 'c', text: 'Zkompiluje se a vyhodí výjimku za běhu', isCorrect: false },
      { id: 'd', text: 'Zkompiluje se, pokud je Programator ve stejné sestavě', isCorrect: false }
    ],
    explanation: 'Pokud předek definuje konstruktor s parametry, kompilátor C# již negeneruje výchozí bezparametrický konstruktor. Každý odvozený konstruktor potomka MUSÍ explicitně zavolat : base(jmeno, mzda), jinak kompilátor Roslyn odmítne kód sestavit (CS7036).'
  },

  {
    id: 'quiz-uml-adapter-vs-proxy',
    title: 'UML Diagram č. 7: Jak v diagramu odlišit Adaptér od Proxy?',
    category: 'polymorphism',
    codeSnippet: `// V UML diagramu vidíš:
// Třída X implementuje rozhraní ITarget (- - ▷ ITarget)
// A ZÁROVEŇ má uvnitř kompozici (◇───> StaraSluzba),
// přičemž StaraSluzba NEIMPLEMENTUJE ITarget a má úplně jiné názvy metod.

using System;
public interface ITarget { void Proved(); }
public class StaraSluzba { public void SpecificAction() => Console.WriteLine("StaraSluzba"); }
public class X : ITarget
{
    private readonly StaraSluzba _adaptee = new StaraSluzba();
    public void Proved() => _adaptee.SpecificAction();
}
public class Program { public static void Main() => new X().Proved(); }`,
    options: [
      { id: 'a', text: 'Jde o vzor Proxy (Zástupce), protože obaluje jiný objekt', isCorrect: false },
      { id: 'b', text: 'Jde o vzor Objektový Adaptér (Adapter), protože převádí nekompatibilní rozhraní StaraSluzba na ITarget', isCorrect: true },
      { id: 'c', text: 'Jde o vzor Dekorátor (Decorator), protože přidává novou metodu', isCorrect: false },
      { id: 'd', text: 'Jde o vzor Tovární metoda (Factory Method)', isCorrect: false }
    ],
    explanation: 'V UML diagramu mají Adapter, Proxy i Decorator kompozici (◇───>) i implementaci rozhraní (- - ▷). Rozdíl poznáš podle zabaleného objektu: u Proxy i Decoratoru implementuje zabalený objekt STEJNÉ rozhraní jako obal (šípka ◇───> vede zpět na společné rozhraní/předka). U Adaptéru vede šipka ◇───> do cizí třídy (Adaptee), která rozhraní ITarget vůbec neimplementuje!'
  },

  {
    id: 'quiz-uml-decorator-vs-proxy',
    title: 'UML Diagram č. 8: Jak v diagramu poznat Dekorátor (Decorator)?',
    category: 'polymorphism',
    codeSnippet: `// V UML diagramu vidíš:
// Abstraktní třída Obal implementuje IKava (- - ▷ IKava)
// A ZÁROVEŇ drží odkaz na totéž rozhraní (# _kava : IKava ◇───> IKava).
// Z třídy Obal dědí konkrétní přísady (───▷ Slekem, SKaramelem).

using System;
public interface IKava { int Cena(); }
public class Espresso : IKava { public int Cena() => 45; }
public abstract class KavaDecorator : IKava
{
    protected IKava _kava;
    protected KavaDecorator(IKava k) => _kava = k;
    public virtual int Cena() => _kava.Cena();
}
public class SMlekem : KavaDecorator
{
    public SMlekem(IKava k) : base(k) {}
    public override int Cena() => base.Cena() + 15;
}
public class Program { public static void Main() => Console.WriteLine(new SMlekem(new Espresso()).Cena()); }`,
    options: [
      { id: 'a', text: 'Dekorátor (Decorator) – abstraktní obal implementuje IKava a zároveň skládá IKava do sebe jako slupky cibule', isCorrect: true },
      { id: 'b', text: 'Most (Bridge) – protože spojuje dvě nezávislé hierarchie', isCorrect: false },
      { id: 'c', text: 'Jedináček (Singleton) – protože drží statickou instanci', isCorrect: false },
      { id: 'd', text: 'Příkaz (Command) – protože zapouzdřuje volání', isCorrect: false }
    ],
    explanation: 'Typický znak Dekorátoru v UML diagramu: abstraktní třída (KavaDecorator) implementuje rozhraní komponenty (IKava - - ▷) a současně má agregaci/kompozici (◇───>) mířící zpět na samotné rozhraní IKava, přičemž z ní dědí (───▷) konkrétní dekorátory.'
  },

  {
    id: 'quiz-struct-value-semantics',
    title: 'Zkouškový chyták č. 9: Sémantika hodnotových typů (struct vs class)',
    category: 'memory',
    codeSnippet: `using System;

public struct Bod
{
    public int X;
    public int Y;
}

public class Program
{
    public static void Main()
    {
        Bod b1 = new Bod { X = 5, Y = 10 };
        Bod b2 = b1;
        b2.X = 99;

        Console.WriteLine(b1.X);
    }
}`,
    options: [
      { id: 'a', text: '99', isCorrect: false },
      { id: 'b', text: '5', isCorrect: true },
      { id: 'c', text: '0', isCorrect: false },
      { id: 'd', text: 'NullReferenceException', isCorrect: false }
    ],
    explanation: 'Klíčové slovo "struct" definuje hodnotový typ (Value Type) alokovaný přímo na Stacku. Přiřazení "b2 = b1" provede BITOVOU KOPII celého stavu do nové proměnné na Stacku. Změna b2.X nijak neovlivní b1.X, na rozdíl od třídy (class), kde se kopíruje pouze reference ukazující na Heap.',
    memoryDiagramNote: 'Stack: [b1: {X=5, Y=10}], [b2: {X=99, Y=10}] (dva zcela nezávislé paměťové sloty)'
  },

  {
    id: 'quiz-is-pattern-matching-null',
    title: 'Zkouškový chyták č. 10: Pattern Matching "is" a hodnota null',
    category: 'gotchas',
    codeSnippet: `using System;

public class Program
{
    public static void Main()
    {
        object? data = null;
        if (data is string text)
        {
            Console.WriteLine("String: " + text);
        }
        else
        {
            Console.WriteLine("NeniStringNeboJeNull");
        }
    }
}`,
    options: [
      { id: 'a', text: 'Vypíše: String: ', isCorrect: false },
      { id: 'b', text: 'Vypíše: NeniStringNeboJeNull', isCorrect: true },
      { id: 'c', text: 'Vyhodí NullReferenceException', isCorrect: false },
      { id: 'd', text: 'Chyba kompilátoru: typ nullable nelze testovat přes is', isCorrect: false }
    ],
    explanation: 'V C# pattern matching s typovým vzorem "expr is Typ proměnná" selže vždy, když je výraz vyhodnocen jako NULL. Tedy podmínka je pravdivá pouze tehdy, když hodnota není null A ZÁROVEŇ ji lze přetypovat na daný typ. Zde data == null, takže se větev if neprovede a vypíše se else.'
  },

  {
    id: 'quiz-sealed-method-override',
    title: 'Zkouškový chyták č. 11: Zpečetění metody klíčovým slovem "sealed"',
    category: 'inheritance',
    codeSnippet: `public class A
{
    public virtual void Akce() {}
}

public class B : A
{
    public sealed override void Akce() {}
}

public class C : B
{
    public override void Akce() {}
}`,
    options: [
      { id: 'a', text: 'Kód se zkompiluje a třída C úspěšně přepíše metodu Akce', isCorrect: false },
      { id: 'b', text: 'Chyba kompilace: C.Akce() nemůže přepsat zděděného člena B.Akce(), protože je sealed (CS0239)', isCorrect: true },
      { id: 'c', text: 'Chyba kompilace: klíčové slovo sealed lze použít pouze na celou třídu, ne na metodu', isCorrect: false },
      { id: 'd', text: 'Kód se zkompiluje, ale za běhu vyhodí InvalidOperationException', isCorrect: false }
    ],
    explanation: 'Klíčové slovo "sealed" lze v C# použít na třídu (brání dědění) A TAKÉ na metodu s modifikátorem override. Zpečetěná metoda "sealed override" zakazuje dalším odvozeným podtřídám (zde C) její další přepisování. Pokus o override v C skončí chybou kompilátoru CS0239.'
  },

  {
    id: 'quiz-access-protected-internal-vs-private-protected',
    title: 'Zkouškový chyták č. 12: Rozdíl mezi "protected internal" a "private protected"',
    category: 'access',
    codeSnippet: `// Sestava 1 (AssemblyA.dll):
public class Zaklad
{
    protected internal void MetodaA() {}
    private protected void MetodaB() {}
}

// Sestava 2 (AssemblyB.dll):
public class Odvozeny : Zaklad
{
    public void Test()
    {
        MetodaA(); // Řádek 1
        MetodaB(); // Řádek 2
    }
}`,
    options: [
      { id: 'a', text: 'Oba řádky se zkompilují bez chyb', isCorrect: false },
      { id: 'b', text: 'Řádek 1 projde, Řádek 2 skončí chybou kompilace', isCorrect: true },
      { id: 'c', text: 'Řádek 1 skončí chybou kompilace, Řádek 2 projde', isCorrect: false },
      { id: 'd', text: 'Ani jeden řádek se nezkompiluje, protože jsou v jiné sestavě', isCorrect: false }
    ],
    explanation: '"protected internal" funguje jako logické NEBO (OR): je přístupný odkudkoliv v rámci stejné sestavy NEBO z odvozených tříd v libovolné jiné sestavě. Naproti tomu "private protected" funguje jako logické A ZÁROVEŇ (AND): je přístupný POUZE z odvozených tříd VE STEJNÉ sestavě. Proto v AssemblyB.dll Řádek 1 projde, ale Řádek 2 ne.'
  },

  {
    id: 'quiz-explicit-interface-implementation',
    title: 'Zkouškový chyták č. 13: Explicitní implementace rozhraní',
    category: 'polymorphism',
    codeSnippet: `using System;

public interface IKreslit
{
    void Kresli();
}

public class Platno : IKreslit
{
    void IKreslit.Kresli() => Console.WriteLine("Explicitní kreslení");
}

public class Program
{
    public static void Main()
    {
        Platno p = new Platno();
        p.Kresli();
    }
}`,
    options: [
      { id: 'a', text: 'Vypíše: Explicitní kreslení', isCorrect: false },
      { id: 'b', text: 'Chyba kompilace: Platno neobsahuje definici pro "Kresli" (CS1061)', isCorrect: true },
      { id: 'c', text: 'Vyhodí výjimku NotImplementedException za běhu', isCorrect: false },
      { id: 'd', text: 'Vypíše prázdný řádek', isCorrect: false }
    ],
    explanation: 'Při explicitní implementaci rozhraní (void IKreslit.Kresli()) metoda NENÍ součástí veřejného kontraktu třídy Platno. Nelze ji zavolat přímo na referenci typu Platno! Lze ji volat jedině po přetypování na rozhraní: ((IKreslit)p).Kresli(). Proto p.Kresli() způsobí chybu kompilátoru CS1061.'
  },

  {
    id: 'quiz-abstract-factory-vs-factory-method',
    title: 'Návrhové vzory č. 14: Tovární metoda vs Abstraktní továrna',
    category: 'polymorphism',
    codeSnippet: `// Vzor A: Třída má jednu metodu CreateButton(), potomci ji přepisují a vracejí konkrétní tlačítko.
// Vzor B: Rozhraní GUIFactory definuje sadu metod: CreateButton(), CreateCheckbox(), CreateScrollbar() pro ucelenou rodinu komponent.`,
    options: [
      { id: 'a', text: 'Vzor A je Abstraktní továrna, Vzor B je Stavitel (Builder)', isCorrect: false },
      { id: 'b', text: 'Vzor A je Tovární metoda (Factory Method), Vzor B je Abstraktní továrna (Abstract Factory)', isCorrect: true },
      { id: 'c', text: 'Oba vzory jsou jen varianty Singletonu', isCorrect: false },
      { id: 'd', text: 'Vzor A je Prototyp, Vzor B je Fasáda', isCorrect: false }
    ],
    explanation: 'Základní rozdíl z Refactoring.Guru a sylabu: Factory Method je založen na DĚDIČNOSTI (jedna virtuální metoda v nadtřídě, kterou potomek přepíše pro vytvoření jednoho produktu). Abstract Factory je založen na OBJEKTOVÉ KOMPOZICI (rozhraní továrny definuje metody pro vytvoření celé rodiny příbuzných produktů).'
  },

  {
    id: 'quiz-flyweight-state-separation',
    title: 'Návrhové vzory č. 15: Vnitřní (Intrinsic) vs Vnější (Extrinsic) stav u Muší váhy',
    category: 'memory',
    codeSnippet: `// Třída StromModel obsahuje 3D textury a polygony (10 MB dat v paměti).
// Na herní mapě máme 100 000 stromů, každý má své unikátní souřadnice [X, Y, Z].
// Jak správně aplikovat Flyweight?`,
    options: [
      { id: 'a', text: 'Souřadnice [X, Y, Z] jsou Intrinsic (uloženy v instanci), textury jsou Extrinsic', isCorrect: false },
      { id: 'b', text: '3D textury a geometrie jsou Intrinsic (sdílené v 1 instanci), souřadnice [X, Y, Z] jsou Extrinsic (předávané zvenčí při vykreslení)', isCorrect: true },
      { id: 'c', text: 'Oba stavy musí být uloženy v každém stromu na haldě', isCorrect: false },
      { id: 'd', text: 'Vzor Muší váha vyžaduje převod z class na struct', isCorrect: false }
    ],
    explanation: 'U vzoru Muší váha (Flyweight): Vnitřní stav (Intrinsic) je neměnný, sdílený a uložený přímo v objektu muší váhy (např. těžký 3D model, název a barva listí). Vnější stav (Extrinsic) je kontextový a proměnlivý (souřadnice X,Y,Z každého stromu) – ten se do muší váhy neukládá, ale předává se jí jako parametr metody Render(x, y, z).'
  },

  {
    id: 'quiz-singleton-thread-safety-lock',
    title: 'Návrhové vzory č. 16: Vláknová bezpečnost Jedináčka (Singleton)',
    category: 'gotchas',
    codeSnippet: `public class Logger
{
    private static Logger? _instance;
    private Logger() {}

    public static Logger Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new Logger(); // Nebezpečí při multithreadingu!
            }
            return _instance;
        }
    }
}`,
    options: [
      { id: 'a', text: 'Kód je bezpečný, protože statické proměnné jsou v C# automaticky synchronizovány', isCorrect: false },
      { id: 'b', text: 'Při souběžném přístupu dvou vláken může dojít k souběhu (race condition) a vytvoření dvou instancí', isCorrect: true },
      { id: 'c', text: 'Kompilátor vyhodí chybu CS0161, protože chybí návratová hodnota', isCorrect: false },
      { id: 'd', text: 'Tento kód vyhodí DeadlockException', isCorrect: false }
    ],
    explanation: 'Naivní líná inicializace bez zámku (lock) nebo Lazy<T> není thread-safe. Pokud dvě vlákna zkontrolují "_instance == null" současně, obě vyhodnotí podmínku jako pravdivou a obě zavolají "new Logger()", čímž se poruší hlavní invariant Singletonu o existenci jediné instance.'
  },

  {
    id: 'quiz-observer-memory-leak-event',
    title: 'Návrhové vzory č. 17: Únik paměti (Memory Leak) u Pozorovatele v C#',
    category: 'memory',
    codeSnippet: `public class Burza { public event Action? KurzZmenen; }
public class Klient
{
    public Klient(Burza b) { b.KurzZmenen += Zpracuj; }
    private void Zpracuj() => Console.WriteLine("Aktualizace");
}

public class Program
{
    public static void Main()
    {
        Burza b = new Burza();
        {
            Klient k = new Klient(b);
        } // Zde lokální proměnná k zaniká
        GC.Collect();
    }
}`,
    options: [
      { id: 'a', text: 'Objekt k je úspěšně uvolněn Garbage Collectorem', isCorrect: false },
      { id: 'b', text: 'Objekt k zůstává v paměti na haldě (Lapsed Listener leak), protože Burza na něj drží referenci přes delegát události', isCorrect: true },
      { id: 'c', text: 'Volání GC.Collect() vyhodí výjimku', isCorrect: false },
      { id: 'd', text: 'Delegát události se automaticky odregistruje po zániku proměnné k', isCorrect: false }
    ],
    explanation: 'Zkouškový chyták "Lapsed Listener": Když se objekt k přihlásí k události b.KurzZmenen += Zpracuj, delegát události uvnitř Burzy si uloží silnou referenci (Target) na instanci Klient. Dokud žije Burza, Garbage Collector objekt k nemůže uklidit! Řešením je implementovat IDisposable a v něm provést b.KurzZmenen -= Zpracuj.'
  },

  {
    id: 'quiz-command-vs-memento-undo',
    title: 'Návrhové vzory č. 18: Jak realizovat Undo: Příkaz (Command) vs Memento',
    category: 'polymorphism',
    codeSnippet: `// Potřebujeme v textovém editoru realizovat operaci Ctrl+Z (Krok zpět).
// Máme dvě možnosti:
// Řešení 1: Uložit instanci příkazu se zapouzdřenou operací Undo() (inverzní operace, např. smazat vložený znak).
// Řešení 2: Vyžádat si od editoru snímek vnitřního stavu (Snapshot) a při Ctrl+Z stav obnovit bez porušení zapouzdření.`,
    options: [
      { id: 'a', text: 'Řešení 1 je Memento, Řešení 2 je Příkaz (Command)', isCorrect: false },
      { id: 'b', text: 'Řešení 1 je Příkaz (Command), Řešení 2 je Memento (Snímek)', isCorrect: true },
      { id: 'c', text: 'Obě řešení představují vzor Pozorovatel (Observer)', isCorrect: false },
      { id: 'd', text: 'Ani jedno řešení nedodržuje pravidla GoF', isCorrect: false }
    ],
    explanation: 'Vzor Command (Příkaz) zapouzdřuje požadavek jako objekt a obsahuje metodu Undo(), která provádí reverzní logiku (delta změnu). Vzor Memento (Snímek) naopak serializuje/ukládá snapshot celého vnitřního stavu původce (Originator) tak, aby neporušil zapouzdření.'
  },

  {
    id: 'quiz-bridge-pattern-intent',
    title: 'Návrhové vzory č. 19: Proč a kdy použít Most (Bridge)?',
    category: 'polymorphism',
    codeSnippet: `// Máme 2 rozměry růstu:
// 1. Abstrakce GUI oken: JednoducheOkno, DialogoveOkno, ModalniOkno
// 2. Implementace renderingu: WindowsAPI, LinuxGTK, macOSCocoa
// Při prosté dědičnosti bychom potřebovali 3 × 3 = 9 tříd (exploze podtříd).`,
    options: [
      { id: 'a', text: 'Vzor Most (Bridge) oddělí abstrakci od implementace a propojí je kompozicí, takže máme 3 + 3 = 6 tříd', isCorrect: true },
      { id: 'b', text: 'Použijeme Singleton pro každé okno', isCorrect: false },
      { id: 'c', text: 'Použijeme Flyweight, který zmenší počet oken v RAM', isCorrect: false },
      { id: 'd', text: 'V C# je toto řešeno výhradně vícenásobnou dědičností tříd', isCorrect: false }
    ],
    explanation: 'Záměrem vzoru Bridge (Most) podle GoF je "oddělit abstrakci od její implementace tak, aby se obě mohly měnit nezávisle". Místo kartézského součinu podtříd (M * N) udržuje dvě nezávislé hierarchie propojené kompozicí (M + N).'
  },

  {
    id: 'quiz-static-constructor-timing',
    title: 'Zkouškový chyták č. 20: Kdy se spouští statický konstruktor v C#?',
    category: 'gotchas',
    codeSnippet: `using System;

public class Demo
{
    public static int Cislo = 10;
    static Demo()
    {
        Console.Write("StatickyKonstruktor ");
    }
}

public class Program
{
    public static void Main()
    {
        Console.Write("Start ");
        int x = Demo.Cislo;
        Demo d = new Demo();
        Console.Write("Konec");
    }
}`,
    options: [
      { id: 'a', text: 'StatickyKonstruktor Start Konec', isCorrect: false },
      { id: 'b', text: 'Start StatickyKonstruktor Konec', isCorrect: true },
      { id: 'c', text: 'Start Konec StatickyKonstruktor', isCorrect: false },
      { id: 'd', text: 'Start StatickyKonstruktor StatickyKonstruktor Konec', isCorrect: false }
    ],
    explanation: 'V .NET CLR se statický konstruktor "static Demo()" vykoná líně (lazy) přesně JEDNOU před prvním vytvořením instance nebo před prvním přístupem k jakémukoliv statickému členu dané třídy. Zde nejprve běží Main -> "Start ", pak přístup k Demo.Cislo vyvolá statický konstruktor -> "StatickyKonstruktor ", a následné "new Demo()" jej již znovu nevolá -> "Konec".'
  }
];
